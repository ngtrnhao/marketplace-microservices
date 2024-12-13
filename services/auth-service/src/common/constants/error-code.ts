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

  // Thêm mã lỗi cho refresh token
  REFRESH_TOKEN_INVALID = 'AUTH005',
  REFRESH_TOKEN_EXPIRED = 'AUTH006',
  SESSION_INVALID = 'AUTH007',
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
  [ErrorCodes.REFRESH_TOKEN_INVALID]: 'Refresh token không hợp lệ',
  [ErrorCodes.REFRESH_TOKEN_EXPIRED]: 'Refresh token đã hết hạn',
  [ErrorCodes.SESSION_INVALID]: 'Phiên đăng nhập không hợp lệ',
};
