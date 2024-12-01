// Import các decorator và types cần thiết từ @nestjs/common
import {
  ExceptionFilter, // Interface để xử lý exception
  Catch, // Decorator để bắt exception
  ArgumentsHost, // Cung cấp context của request
  BadRequestException, // Exception cho lỗi 400 Bad Request
} from '@nestjs/common';
import { Response } from 'express';

// @Catch(BadRequestException) chỉ định filter này sẽ bắt các BadRequestException
@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
  // Phương thức bắt buộc phải implement từ ExceptionFilter
  catch(exception: BadRequestException, host: ArgumentsHost) {
    // Lấy context HTTP
    const ctx = host.switchToHttp();
    // Lấy response object
    const response = ctx.getResponse<Response>();
    // Lấy HTTP status code từ exception (thường là 400)
    const status = exception.getStatus();
    // Lấy thông tin lỗi validation
    const validationErrors = exception.getResponse() as any;

    // Trả về response với format chuẩn
    response.status(status).json({
      statusCode: status, // Mã lỗi HTTP
      timestamp: new Date().toISOString(), // Thời điểm xảy ra lỗi
      errors: this.formatErrors(validationErrors), // Định dạng lại thông báo lỗi
    });
  }

  // Phương thức private để format lại cấu trúc lỗi
  private formatErrors(errors: any) {
    // Nếu message là một mảng (trường hợp nhiều lỗi validation)
    if (Array.isArray(errors.message)) {
      // Chuyển đổi mảng lỗi thành object
      return errors.message.reduce((acc, error) => {
        // Mỗi field lỗi sẽ có dạng: { fieldName: [error1, error2, ...] }
        acc[error.property] = Object.values(error.constraints);
        return acc;
      }, {});
    }
    // Nếu chỉ có một lỗi đơn giản
    return { message: errors.message };
  }
}
