import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../../src/users/schemas/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../../src/users/users.service';
import { EmailService } from '../../../src/email/email.service';
import { SessionService } from '../../../src/auth/services/session.service';
import { LoginAttemptsService } from '../../../src/auth/services/login-attempts.service';
import { UnauthorizedException } from '@nestjs/common';
import {
  ErrorCodes,
  ErrorMessages,
} from '../../../src/common/constants/error-code';

// Mock toàn bộ module bcrypt vì:
// 1. Tránh thực hiện hash thật trong test
// 2. Kiểm soát được kết quả của hàm compare
// 3. Tăng tốc độ test
jest.mock('bcrypt', () => ({
  compare: jest.fn(), // Chỉ mock hàm compare vì ta chỉ test login
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let sessionService: SessionService;

  // Setup chạy trước mỗi test case để đảm bảo:
  // 1. Môi trường test sạch
  // 2. Không bị ảnh hưởng giữa các test
  beforeEach(async () => {
    // Reset mock để xóa các giá trị/lời gọi của test trước
    (bcrypt.compare as jest.Mock).mockReset();

    // Tạo mock user để test
    const mockUserDoc = {
      _id: new mongoose.Types.ObjectId(), // Tạo _id giả
      email: 'test@example.com',
      password: 'hashedPassword123', // Password đã được hash
    };

    // Tạo module test với các dependencies đã được mock
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockUserDoc),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockResolvedValue(mockUserDoc),
            updateLastLogin: jest.fn().mockResolvedValue(mockUserDoc),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendVerificationEmail: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: SessionService,
          useValue: {
            createSession: jest.fn().mockResolvedValue('test-session-id'),
            validateSession: jest.fn().mockResolvedValue(true),
            invalidateSession: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: LoginAttemptsService,
          useValue: {
            recordLoginAttempt: jest.fn(),
            isLoginBlocked: jest.fn().mockResolvedValue(false),
            isLocked: jest.fn().mockResolvedValue(false),
            trackAttempt: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    // Lấy instance của AuthService đã được inject các dependencies mock
    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    sessionService = module.get<SessionService>(SessionService);

    // Mock phương thức private getTokens
    // Sử dụng spyOn vì đây là method của class
    jest.spyOn(service as any, 'getTokens').mockResolvedValue({
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
    });
  });

  // Test case: Đăng nhập thành công
  it('should return access token when credentials are valid', async () => {
    // Mock bcrypt.compare trả về true -> password đúng
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Gọi hàm login với credentials test
    const result = await service.login({
      email: 'test@example.com',
      password: 'password123',
    });

    // Kiểm tra kết quả trả về có đúng format
    expect(result.accessToken).toBe('test-access-token');
    expect(result.refreshToken).toBe('test-refresh-token');
  });

  describe('refreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const mockPayload = {
        sub: 'userId',
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
        sessionId: 'sessionId',
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);
      jest.spyOn(sessionService, 'validateSession').mockResolvedValue(true);

      const result = await service.refreshToken('valid.refresh.token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('sessionId');
    });

    it('should throw SESSION_INVALID when session is invalid', async () => {
      const mockPayload = {
        sub: 'userId',
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
        sessionId: 'invalidSessionId',
      };

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockImplementation(async (token) => {
          if (token === 'valid.refresh.token') {
            return mockPayload;
          }
          throw new Error('Invalid token');
        });

      jest.spyOn(sessionService, 'validateSession').mockResolvedValue(false);

      await expect(service.refreshToken('valid.refresh.token')).rejects.toThrow(
        new UnauthorizedException(ErrorMessages[ErrorCodes.TOKEN_INVALID]),
      );

      expect(jwtService.verifyAsync).toHaveBeenCalled();
      expect(sessionService.validateSession).toHaveBeenCalledWith(
        'invalidSessionId',
      );
    });

    it('should throw TOKEN_EXPIRED when refresh token is expired', async () => {
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue({
        name: 'TokenExpiredError',
      });

      await expect(service.refreshToken('expired.token')).rejects.toThrow(
        new UnauthorizedException(ErrorMessages[ErrorCodes.TOKEN_EXPIRED]),
      );
    });

    it('should throw TOKEN_INVALID when token type is not refresh', async () => {
      const mockPayload = {
        sub: 'userId',
        email: 'test@example.com',
        role: 'user',
        type: 'access',
        sessionId: 'sessionId',
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

      await expect(service.refreshToken('invalid.type.token')).rejects.toThrow(
        new UnauthorizedException(ErrorMessages[ErrorCodes.TOKEN_INVALID]),
      );
    });
  });

  // Dọn dẹp sau mỗi test
  afterEach(() => {
    jest.clearAllMocks(); // Xóa tất cả mock data
  });
});
