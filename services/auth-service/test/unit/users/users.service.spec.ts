import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../../src/users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../../src/users/schemas/user.schema';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService; // Instance của service để test
  let mockUserModel: any; // Mock của Mongoose Model

  // Setup trước mỗi test case
  beforeEach(async () => {
    // Tạo mock cho UserModel với các method cần thiết
    mockUserModel = {
      create: jest.fn(), // Mock tạo user mới
      findOne: jest.fn(), // Mock tìm một user
      findById: jest.fn(), // Mock tìm theo id
      findByIdAndUpdate: jest.fn(), // Mock update user
    };

    // Tạo module test với UserModel đã được mock
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name), // Token để inject Model
          useValue: mockUserModel, // Sử dụng mock thay vì Model thật
        },
      ],
    }).compile();

    // Lấy instance của service
    service = module.get<UsersService>(UsersService);
  });

  // Test suite cho method findByEmail
  describe('findByEmail', () => {
    // Test case: tìm thấy user
    it('should return a user if found', async () => {
      const mockUser = { email: 'test@example.com' };
      // Mock findOne trả về user
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });

    // Test case: không tìm thấy user
    it('should throw NotFoundException if user not found', async () => {
      // Mock findOne trả về null
      mockUserModel.findOne.mockResolvedValue(null);

      // Kiểm tra service có throw NotFoundException không
      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // Test suite cho method updateLastLogin
  describe('updateLastLogin', () => {
    // Test case: cập nhật thời gian đăng nhập
    it('should update last login time', async () => {
      const userId = 'testId';
      // Mock findByIdAndUpdate trả về empty object
      mockUserModel.findByIdAndUpdate.mockResolvedValue({});

      await service.updateLastLogin(userId);
      // Kiểm tra hàm được gọi với đúng tham số
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        userId,
        {
          lastLoginAt: expect.any(Date),
        },
        { new: true }
      );
    });
  });
});
