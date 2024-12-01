import { Test, TestingModule } from '@nestjs/testing'; // Module testing của NestJS
import { INestApplication, ValidationPipe } from '@nestjs/common'; // Types và Pipes
import * as request from 'supertest'; // Thư viện để test HTTP requests
import { AppModule } from '../../src/app.module'; // Root module của ứng dụng
import { ValidationFilter } from '../../src/common/filters/validation.filter';

// Test suite cho AuthController (end-to-end testing)
describe('AuthController (e2e)', () => {
  // Biến để lưu instance của ứng dụng NestJS
  let app: INestApplication;

  // Setup trước mỗi test case
  beforeEach(async () => {
    // Tạo module testing với AppModule (toàn bộ ứng dụng)
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import toàn bộ AppModule để test e2e
    }).compile();

    // Khởi tạo ứng dụng NestJS
    app = moduleFixture.createNestApplication();

    // Thêm global validation pipe để validate DTOs
    app.useGlobalPipes(new ValidationPipe());

    // Thêm filter để xử lý validation errors
    app.useGlobalFilters(new ValidationFilter());

    // Khởi động ứng dụng
    await app.init();
  });

  // Test suite cho endpoint đăng ký
  describe('POST /auth/register', () => {
    // Test case: đăng ký thành công
    it('should register a new user', () => {
      // Sử dụng supertest để gửi HTTP request
      return request(app.getHttpServer()) // Lấy HTTP server từ ứng dụng
        .post('/auth/register') // Gọi endpoint register
        .send({
          // Gửi dữ liệu đăng ký hợp lệ
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(201); // Kiểm tra status code là 201 (Created)
    });

    // Test case: đăng ký thất bại do dữ liệu không hợp lệ
    it('should fail with invalid data', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          // Gửi dữ liệu không hợp lệ
          email: 'invalid-email', // Email sai format
          password: '123', // Password quá ngắn
        })
        .expect(400); // Kiểm tra status code là 400 (Bad Request)
    });
  });

  // Test suite cho endpoint đăng nhập
  describe('POST /auth/login', () => {
    // Test case: đăng nhập thành công
    it('should login successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          // Gửi credentials
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(200) // Kiểm tra status code là 200 (OK)
        .expect((res) => {
          // Kiểm tra response có chứa access_token
          expect(res.body).toHaveProperty('access_token');
        });
    });
  });

  // Dọn dẹp sau khi tất cả test hoàn thành
  afterAll(async () => {
    await app.close(); // Đóng ứng dụng để giải phóng resources
  });
});
