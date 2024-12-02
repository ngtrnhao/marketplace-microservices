import { ValidationFilter } from '../../../src/common/filters/validation.filter';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from '../../../src/common/services/logger.service';
import {
  ErrorCodes,
  ErrorMessages,
} from '../../../src/common/constants/error-code';
// Test suite cho ValidationFilter
describe('ValidationFilter', () => {
  let filter: ValidationFilter; // Instance của filter để test
  let mockResponse: any; // Mock response object
  let mockRequest: any; // Mock request object
  let mockLogger: any; // Mock logger object

  // Setup trước mỗi test case
  beforeEach(async () => {
    mockLogger = {
      error: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidationFilter,
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();
    filter = module.get<ValidationFilter>(ValidationFilter);
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockRequest = {
      url: '/test',
      body: {},
    };
  });

  // Test case: xử lý một lỗi đơn lẻ
  it('should format single error message', () => {
    // Tạo exception với message đơn giản
    const mockException = new BadRequestException('Email không hợp lệ');

    // Mock ArgumentsHost để lấy response object
    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };

    // Gọi method catch của filter
    filter.catch(mockException, mockHost as any);

    expect(mockLogger.error).toHaveBeenCalledWith(
      'Validation failed',
      expect.any(String),
      'ValidationFilter',
    );
    // Kiểm tra response:
    // 1. Status code phải là 400
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    // 2. Response body phải đúng format
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      errorCode: ErrorCodes.VALIDATION_ERROR,
      message: ErrorMessages[ErrorCodes.VALIDATION_ERROR],
      timestamp: expect.any(String), // Chỉ cần đảm bảo là string
      path: '/test',
      errors: { message: 'Email không hợp lệ' },
    });
  });

  // Test case: xử lý nhiều lỗi validation
  it('should format multiple validation errors', () => {
    // Tạo exception với nhiều lỗi validation
    const mockException = new BadRequestException({
      message: [
        {
          property: 'email', // Field có lỗi
          constraints: {
            isEmail: 'Email không hợp lệ', // Loại lỗi và message
          },
        },
        {
          property: 'password',
          constraints: {
            minLength: 'Mật khẩu phải có ít nhất 8 ký tự',
          },
        },
      ],
    });

    // Mock ArgumentsHost
    const mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    };

    // Gọi method catch
    filter.catch(mockException, mockHost as any);

    expect(mockLogger.error).toHaveBeenCalled();
    // Kiểm tra format của response với nhiều lỗi
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      errorCode: ErrorCodes.VALIDATION_ERROR,
      message: ErrorMessages[ErrorCodes.VALIDATION_ERROR],
      timestamp: expect.any(String),
      path: '/test',
      errors: {
        // Mỗi field là một mảng chứa các message lỗi
        email: ['Email không hợp lệ'],
        password: ['Mật khẩu phải có ít nhất 8 ký tự'],
      },
    });
  });
});
