import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import * as crypto from 'crypto';
import { SessionService } from './services/session.service';
import { LoginAttemptsService } from './services/login-attempts.service';
import { TokenPayload } from './interfaces/token-payload.interface';
import { ErrorCodes, ErrorMessages } from '../common/constants/error-code';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    private readonly sessionService: SessionService,
    private readonly loginAttemptsService: LoginAttemptsService,
  ) {}

  async register(registerDto: RegisterDto) {
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.usersService.createUser({
      ...registerDto,
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await this.emailService.sendVerificationEmail(
      user.email,
      verificationToken,
    );

    return {
      message:
        'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
      userId: user._id,
    };
  }

  async login(loginDto: LoginDto) {
    // Kiểm tra tài khoản có bị khóa không
    if (await this.loginAttemptsService.isLocked(loginDto.email)) {
      throw new UnauthorizedException('Tài khoản tạm thởi bị khóa');
    }

    try {
      const { email, password } = loginDto;
      const user = await this.userModel.findOne({ email });

      if (!user) {
        await this.loginAttemptsService.trackAttempt(email, false);
        throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
      }

      const isPasswordValid = await bcrypt.compare(
        password.toString(),
        user.password,
      );
      if (!isPasswordValid) {
        await this.loginAttemptsService.trackAttempt(email, false);
        throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
      }

      // Login thành công
      await this.loginAttemptsService.trackAttempt(email, true);

      // Tạo session
      const session = await this.sessionService.createSession(
        user._id.toString(),
      );

      // Tạo tokens
      const tokens = await this.getTokens(
        user._id.toString(),
        user.email,
        user.role,
        session.id,
      );

      return {
        ...tokens,
        sessionId: session.id,
      };
    } catch (error) {
      throw error;
    }
  }

  private async getTokens(
    userId: string,
    email: string,
    role: string,
    sessionId?: string,
  ) {
    const accessTokenExpires = '15m';
    const refreshTokenExpires = '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
          type: 'access',
          sessionId,
        } as TokenPayload,
        {
          secret: process.env.JWT_SECRET,
          expiresIn: accessTokenExpires,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
          type: 'refresh',
          sessionId,
        } as TokenPayload,
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: refreshTokenExpires,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: ms(accessTokenExpires) / 1000, // Convert to seconds
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (user.verificationTokenExpires < new Date()) {
      throw new BadRequestException('Token đã hết hạn');
    }
    return this.usersService.verifyEmail(user._id.toString());
  }

  async verifyToken(
    token: string,
    isRefreshToken = false,
  ): Promise<TokenPayload> {
    try {
      const secret = isRefreshToken
        ? process.env.JWT_REFRESH_SECRET
        : process.env.JWT_SECRET;
      return await this.jwtService.verifyAsync(token, { secret });
    } catch {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Token không hợp lệ');
      }

      // Validate session
      if (payload.sessionId) {
        const isValidSession = await this.sessionService.validateSession(
          payload.sessionId,
        );

        if (!isValidSession) {
          throw new UnauthorizedException('Phiên đăng nhập không hợp lệ');
        }
      }

      // Generate new tokens
      const tokens = await this.getTokens(
        payload.sub,
        payload.email,
        payload.role,
        payload.sessionId,
      );

      return {
        ...tokens,
        sessionId: payload.sessionId,
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          ErrorMessages[ErrorCodes.TOKEN_EXPIRED],
        );
      }
      throw new UnauthorizedException(ErrorMessages[ErrorCodes.TOKEN_INVALID]);
    }
  }

  async googleLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException('No user from Google');
    }

    let existingUser = await this.userModel.findOne({ email: user.email }).exec();

    if (!existingUser) {
      const createUserDto = {
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(), 
        firstName: user.firstName,
        lastName: user.lastName,
        password: crypto.randomBytes(32).toString('hex'),
        isEmailVerified: true,
        profilePicture: user.picture,
        googleId: user.id,
        googleToken: user.accessToken
      };

      const newUser = await this.usersService.createUser(createUserDto);
      existingUser = await this.userModel.findById(newUser._id).exec();
      
      if (!existingUser) {
        throw new Error('Failed to create user');
      }
    }

    const payload: TokenPayload = { 
      sub: existingUser._id.toString(),
      userId: existingUser._id.toString(),
      email: existingUser.email,
      role: existingUser.role || 'user',
      type: 'access'
    };
    
    const accessToken = await this.jwtService.signAsync(payload);
    
    // Tạo session mới
    await this.sessionService.createSession(existingUser._id.toString());

    return {
      user: {
        id: existingUser._id,
        email: existingUser.email,
        firstName: existingUser.firstName || '',
        lastName: existingUser.lastName || '',
        profilePicture: existingUser.profilePicture || ''
      },
      accessToken,
    };
  }

  async socialLogin(profile: any): Promise<any> {
    try {
      // Tìm user dựa trên provider và providerId
      let user = await this.userModel.findOne({
        $or: [
          { email: profile.email },
          { providerId: profile.providerId, provider: profile.provider }
        ]
      });

      if (!user) {
        // Tạo mật khẩu ngẫu nhiên cho user mới
        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        // Tạo user mới
        user = await this.userModel.create({
          email: profile.email,
          name: profile.name,
          password: hashedPassword,
          avatar: profile.picture,
          provider: profile.provider,
          providerId: profile.providerId,
          isActive: true
        });
      }

      // Tạo JWT token
      const payload = {
        sub: user._id,
        email: user.email,
        role: user.role
      };

      const accessToken = await this.jwtService.signAsync(payload);

      return {
        user,
        accessToken
      };
    } catch (error) {
      throw new InternalServerErrorException('Error during social login');
    }
  }
}
