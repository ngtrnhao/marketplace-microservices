import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCodes, ErrorMessages } from '../common/constants/error-code';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  //Overide handlleRequest để tùy chỉnh xử lý lỗi
  handleRequest(err: any, user: any, info: any) {
    //Nếu có lỗi hoặc không tìm thấy user
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          ErrorMessages[ErrorCodes.TOKEN_EXPIRED],
        );
      }
      if (info?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          ErrorMessages[ErrorCodes.TOKEN_INVALID],
        );
      }
      throw new UnauthorizedException(ErrorMessages[ErrorCodes.TOKEN_INVALID]);
    }
    // Kiểm tra trạng thái active của user
    if (!user.isActive) {
      throw new UnauthorizedException('Tài khoản đã bị vô hiệu hóa');
    }

    // Kiểm tra xác thực email (nếu cần)
    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        ErrorMessages[ErrorCodes.EMAIL_NOT_VERIFIED],
      );
    }

    return user;
  }

  // Override canActivate để thêm logic kiểm tra
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Gọi canActivate của lớp cha
    const result = (await super.canActivate(context)) as boolean;

    // Lấy request từ context
    const request = context.switchToHttp().getRequest();

    // Nếu có yêu cầu refresh token
    if (request.path === '/auth/refresh-token') {
      return true;
    }

    return result;
  }
}
