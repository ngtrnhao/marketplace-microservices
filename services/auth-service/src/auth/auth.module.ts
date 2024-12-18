import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UserModule } from '../users/users.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailService } from '../email/email.service';
import { LoginAttemptsService } from './services/login-attempts.service';
import { SessionService } from './services/session.service';
import { BlockedIP, BlockedIPSchema } from './schemas/blocked-ip.schema';
import { Device, DeviceSchema } from './schemas/device.schema';
import { AuditLog, AuditLogSchema } from '../common/schemas/audit-log.schema';
import { IpBlockingService } from './services/ip-blocking.service';
import { DeviceTrackingService } from './services/device-tracking.service';
import { SuspiciousActivityService } from './services/suspicious-activity.service';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: BlockedIP.name, schema: BlockedIPSchema },
      { name: Device.name, schema: DeviceSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    EmailService,
    LoginAttemptsService,
    SessionService,
    IpBlockingService,
    DeviceTrackingService,
    SuspiciousActivityService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
