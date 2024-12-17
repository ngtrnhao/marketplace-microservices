import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { DatabaseProvider } from './common/providers/database.provider';
import { DatabaseLoggingMiddleware } from './common/middleware/database-logging.middleware';
import { LoggerService } from './common/services/logger.service';
import { APP_FILTER } from '@nestjs/core';
import { ValidationFilter } from './common/filters/validation.filter';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseProvider,
      inject: [ConfigService],
    }),
    AuthModule,
    RateLimitModule,
  ],
  providers: [
    DatabaseProvider,
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: ValidationFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DatabaseLoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
