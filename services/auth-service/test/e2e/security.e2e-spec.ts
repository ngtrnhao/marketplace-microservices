// services/auth-service/test/e2e/security.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Security Features (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Rate Limiting', () => {
    it('should block excessive requests', async () => {
      const requests = Array(11)
        .fill(null)
        .map(() =>
          request(app.getHttpServer()).post('/auth/login').send({
            email: 'test@example.com',
            password: 'password123',
          }),
        );

      const responses = await Promise.all(requests);
      const blockedResponse = responses[responses.length - 1];

      expect(blockedResponse.status).toBe(429);
      expect(blockedResponse.body.message).toBe(
        'Quá nhiều yêu cầu, vui lòng thử lại sau',
      );
    });
  });

  describe('IP Blocking', () => {
    it('should block IP after multiple failed login attempts', async () => {
      // Thực hiện 5 lần đăng nhập thất bại
      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer()).post('/auth/login').send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });
      }

      // Thử đăng nhập lần thứ 6
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('IP của bạn đã bị chặn');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
