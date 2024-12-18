import {
  Injectable,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ErrorCodes, ErrorMessages } from '../common/constants/error-code';
import { SessionService } from '../auth/services/session.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private sessionService: SessionService) {
    super();
  }

  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (err || !user) {
      if (info?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          ErrorMessages[ErrorCodes.TOKEN_EXPIRED],
        );
      }
      throw new UnauthorizedException(ErrorMessages[ErrorCodes.TOKEN_INVALID]);
    }

    return user as TUser;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    if (!result) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (request.path === '/auth/refresh-token') {
      return true;
    }

    // Validate session
    if (user && user.sessionId) {
      const isValidSession = await this.sessionService.validateSession(
        user.sessionId,
      );
      if (!isValidSession) {
        throw new UnauthorizedException(
          ErrorMessages[ErrorCodes.SESSION_INVALID],
        );
      }
    }

    return true;
  }
}
