import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Tìm user theo email
  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  // Kiểm tra email đã tồn tại chưa
  async isEmailUnique(email: string): Promise<boolean> {
    const existingUser = await this.userModel.findOne({ email });
    return !existingUser;
  }

  // Tạo user mới với kiểm tra email duy nhất
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const isUnique = await this.isEmailUnique(createUserDto.email);
    if (!isUnique) {
      throw new ConflictException('Email đã được sử dụng');
    }
    return this.userModel.create(createUserDto);
  }

  // Tìm user theo verification token
  async findByVerificationToken(token: string): Promise<User> {
    const user = await this.userModel.findOne({ verificationToken: token });
    if (!user) {
      throw new NotFoundException('Token không hợp lệ');
    }
    return user;
  }

  // Cập nhật trạng thái xác thực email
  async verifyEmail(userId: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        isEmailVerified: true,
        verificationToken: null,
      },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return user;
  }

  async updateLastLogin(userId: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        lastLoginAt: new Date(),
      },
      { new: true },
    );

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return user;
  }
}
