export enum ErrorCodes {
  //Auth realted errors
  INVALID_CREDENTIALS = 'AUTH001',
  EMAIL_NOT_VERIFIED = 'AUTH002',
  TOKEN_EXPIRED = 'AUTH003',
  TOKEN_INVALID = 'AUTH004',

  //User related errors
  USER_NOT_FOUND = 'USER001',
  EMAIL_ALREADY_EXISTS = 'USER002',

  //Validation errors
  VALIDATION_ERROR = 'VALI001',

  //Server errors
  INTERNAL_SERVER_ERROR = 'SRV001',
}

export const ErrorMessages = {
  [ErrorCodes.INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không đúng',
  [ErrorCodes.EMAIL_NOT_VERIFIED]: 'Email không được xác thực',
  [ErrorCodes.TOKEN_EXPIRED]: 'Token đã hết hạn',
  [ErrorCodes.TOKEN_INVALID]: 'Token không hợp lệ',
  [ErrorCodes.USER_NOT_FOUND]: 'Người dùng không tồn tại',
  [ErrorCodes.EMAIL_ALREADY_EXISTS]: 'Email đã tồn tại',
  [ErrorCodes.VALIDATION_ERROR]: 'Dữ liệu không hợp lệ',
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'Lỗi hệ thống',
};
