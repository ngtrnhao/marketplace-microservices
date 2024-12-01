import { ValidationFilter } from '../../../src/common/filters/validation.filter';
import { BadRequestException } from '@nestjs/common';

// Test suite cho ValidationFilter
describe('ValidationFilter', () => {
  let filter: ValidationFilter; // Instance của filter để test
  let mockResponse: any; // Mock response object

  // Setup trước mỗi test case
  beforeEach(() => {
    // Khởi tạo filter mới
    filter = new ValidationFilter();

    // Tạo mock response với 2 method cần thiết:
    // - status(): set HTTP status code
    // - json(): gửi JSON response
    mockResponse = {
      status: jest.fn().mockReturnThis(), // mockReturnThis() để có thể chain .json()
      json: jest.fn(), // Mock hàm json để kiểm tra response format
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
      }),
    };

    // Gọi method catch của filter
    filter.catch(mockException, mockHost as any);

    // Kiểm tra response:
    // 1. Status code phải là 400
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    // 2. Response body phải đúng format
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      timestamp: expect.any(String), // Chỉ cần đảm bảo là string
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
      }),
    };

    // Gọi method catch
    filter.catch(mockException, mockHost as any);

    // Kiểm tra format của response với nhiều lỗi
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      timestamp: expect.any(String),
      errors: {
        // Mỗi field là một mảng chứa các message lỗi
        email: ['Email không hợp lệ'],
        password: ['Mật khẩu phải có ít nhất 8 ký tự'],
      },
    });
  });
});
