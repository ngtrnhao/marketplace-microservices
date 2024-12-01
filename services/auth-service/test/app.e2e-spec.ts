import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest'; // Thư viện để test HTTP requests
import { AppModule } from './../src/app.module';
import { ValidationFilter } from '../src/common/filters/validation.filter';

// Test suite cho AppController (end-to-end testing)
describe('AppController (e2e)', () => {
  let app: INestApplication; // Biến để lưu instance của ứng dụng

  // Chạy trước mỗi test case
  beforeEach(async () => {
    // Tạo module testing với AppModule
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Khởi tạo ứng dụng
    app = moduleFixture.createNestApplication();

    // Cấu hình global pipes cho validation
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Chỉ cho phép các property được định nghĩa trong DTO
        transform: true, // Tự động transform types
        forbidNonWhitelisted: true, // Báo lỗi nếu có property không được whitelist
      }),
    );

    // Thêm filter xử lý validation errors
    app.useGlobalFilters(new ValidationFilter());
    // Đặt prefix cho tất cả routes
    app.setGlobalPrefix('api');

    await app.init(); // Khởi tạo ứng dụng
  });

  // Dọn dẹp sau khi tất cả test hoàn thành
  afterAll(async () => {
    await app.close();
  });

  // Test health check endpoint
  describe('Health Check', () => {
    it('/ (GET)', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .expect('Hello World!');
    });
  });

  // Test xử lý lỗi
  describe('Error Handling', () => {
    // Test 404 error
    it('should handle 404 errors', () => {
      return request(app.getHttpServer()).get('/api/not-exists').expect(404);
    });

    // Test validation errors
    it('should handle validation errors', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          email: 'invalid-email', // Email không hợp lệ
          password: '123', // Password quá ngắn
        })
        .expect(400)
        .expect((res) => {
          // Kiểm tra format của response error
          expect(res.body).toHaveProperty('errors');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('statusCode', 400);
        });
    });
  });
});
