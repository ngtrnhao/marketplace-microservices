import { Test, TestingModule } from '@nestjs/testing'; // Module testing của NestJS
import { INestApplication, ValidationPipe } from '@nestjs/common'; // Types và Pipes
import * as request from 'supertest'; // Thư viện để test HTTP requests
import { AppModule } from '../../src/app.module'; // Root module của ứng dụng
import { ValidationFilter } from '../../src/common/filters/validation.filter';
import { LoggerService } from '../../src/common/services/logger.service';
import { ErrorCodes, ErrorMessages } from 'src/common/constants/error-code';

// Test suite cho AuthController (end-to-end testing)
describe('AuthController (e2e)', () => {
  // Biến để lưu instance của ứng dụng NestJS
  let app: INestApplication;
  let logger: LoggerService;

  // Setup trước mỗi test case
  beforeEach(async () => {
    // Tạo mock logger
    logger = {
      error: jest.fn(),
      warn: jest.fn(),
      log: jest.fn(),
      debug: jest.fn(),
    } as any;

    // Tạo module testing với AppModule (toàn bộ ứng dụng)
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Import toàn bộ AppModule để test e2e
      providers: [
        {
          provide: LoggerService,
          useValue: logger,
        },
      ],
    }).compile();

    // Khởi tạo ứng dụng NestJS
    app = moduleFixture.createNestApplication();

    // Thêm global validation pipe để validate DTOs
    app.useGlobalPipes(new ValidationPipe());

    // Truyền logger vào ValidationFilter
    app.useGlobalFilters(new ValidationFilter(logger));

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
    it('should return tokens and session id on successful login', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body).toHaveProperty('sessionId');
        });
    });

    // Test case: đăng nhập thất bại do dữ liệu không hợp lệ
    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  // Test suite cho endpoint refresh token
  describe('POST /auth/refresh', () => {
    it('should refresh tokens successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: 'valid.refresh.token',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accessToken');
          expect(res.body).toHaveProperty('refreshToken');
          expect(res.body).toHaveProperty('sessionId');
        });
    });

    it('should fail with invalid refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/refresh')
        .send({
          refreshToken: 'invalid.token',
        })
        .expect(401);
    });
  });

  // Test suite cho JWT Authentication
  describe('JWT Authentication (e2e)', () => {
    let validToken: string;

    beforeEach(async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        });
      validToken = loginRes.body.accessToken;
    });

    it('should protect routes with valid JWT', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
    });

    it('should reject expired tokens', async () => {
      // Wait for token to expire
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe(
            ErrorMessages[ErrorCodes.TOKEN_EXPIRED],
          );
        });
    });
  });

  // Dọn dẹp sau khi tất cả test hoàn thành
  afterAll(async () => {
    await app.close(); // Đóng ứng dụng để giải phóng resources
  });
});
