import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Auth Service API')
  .setDescription('Auth Service API Documentation')
  .setVersion('1.0')
  .addTag('auth', 'Các API liên quan đến xác thực')
  .addTag('users', 'Các API liên quan đến người dùng')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Nhập JWT token của bạn',
    },
    'access-token',
  )
  .build();
