import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisThrottlerStorage } from './redis-throttler.storage';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockedIP, BlockedIPSchema } from '../auth/schemas/blocked-ip.schema';
import { IpBlockingService } from '../auth/services/ip-blocking.service';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get('security.throttle.ttl', 60),
            limit: configService.get('security.throttle.limit', 10),
          },
        ],
        storage: new RedisThrottlerStorage(configService),
        errorMessage: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
      }),
    }),
    MongooseModule.forFeature([
      { name: BlockedIP.name, schema: BlockedIPSchema },
    ]),
  ],
  providers: [RedisThrottlerStorage, IpBlockingService],
  exports: [RedisThrottlerStorage, IpBlockingService],
})
export class RateLimitModule {}
