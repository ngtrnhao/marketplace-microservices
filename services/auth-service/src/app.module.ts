import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { DatabaseProvider } from './common/providers/database.provider';
import { DatabaseLoggingMiddleware } from './common/middleware/database-logging.middleware';
import { LoggerService } from './common/services/logger.service';
import { APP_FILTER } from '@nestjs/core';
import { ValidationFilter } from './common/filters/validation.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DatabaseProvider,
      inject: [ConfigService],
    }),
    AuthModule,
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
