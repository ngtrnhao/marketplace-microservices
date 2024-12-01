import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { DatabaseProvider } from './common/providers/database.provider';
import { DatabaseLoggingMiddleware } from './common/middleware/database-logging.middleware';

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
  providers: [DatabaseProvider],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DatabaseLoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
