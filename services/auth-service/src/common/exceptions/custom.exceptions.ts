import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCodes, ErrorMessages } from '../constants/error-code';

export class AuthenticationException extends HttpException {
  constructor(errorCode: ErrorCodes, message?: string) {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode,
        message: message || ErrorMessages[errorCode],
        timestamp: new Date().toISOString(),
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
export class ValidationException extends HttpException {
  constructor(errors: Record<string, string[]>) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode: ErrorCodes.VALIDATION_ERROR,
        errors,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
