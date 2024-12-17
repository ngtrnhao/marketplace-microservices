import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModuleOptions } from '@nestjs/throttler';
import { LoggerService } from '../common/services/logger.service';
import { Reflector } from '@nestjs/core';
import { RedisThrottlerStorage } from './redis-throttler.storage';

@Injectable()
export class RateLimitGuard extends ThrottlerGuard {
  constructor(
    private readonly logger: LoggerService,
    options: ThrottlerModuleOptions,
    private readonly redisStorage: RedisThrottlerStorage,
    reflector: Reflector,
  ) {
    super(options, redisStorage, reflector);
  }

  protected errorMessage = 'Quá nhiều yêu cầu, vui lòng thử lại sau';

  protected async getTracker(req: Record<string, any>): Promise<string> {
    return Promise.resolve(req.ips.length ? req.ips[0] : req.ip);
  }

  async handleRequest(requestProps: any): Promise<boolean> {
    const request = requestProps.context.switchToHttp().getRequest();
    const ip = await this.getTracker(request);
    const key = await this.generateKeyForRequest(request, ip);

    try {
      const record = await this.redisStorage.get(key, 'default');

      if (record.isBlocked) {
        this.logger.warn(
          `IP ${ip} is blocked for ${record.timeToBlockExpire}ms`,
          'RateLimitGuard',
        );
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: this.errorMessage,
            error: 'Too Many Requests',
            timeToBlockExpire: record.timeToBlockExpire,
          },
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      const result = await super.handleRequest(requestProps);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.warn(
        `Rate limit exceeded for IP ${ip} at ${request.path}`,
        'RateLimitGuard',
      );

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: this.errorMessage,
          error: 'Too Many Requests',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  protected async generateKeyForRequest(
    request: any,
    ip: string,
  ): Promise<string> {
    return `rate-limit:${ip}:${request.method}:${request.path}`;
  }
}
