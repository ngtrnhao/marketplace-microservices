import { Test, TestingModule } from '@nestjs/testing';
import { LoginAttemptsService } from '../../../src/auth/services/login-attempts.service';

describe('LoginAttemptsService', () => {
  let service: LoginAttemptsService;

  beforeEach(async () => {
    //Tạo module test với service
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginAttemptsService],
    }).compile();
    //Lấy instance của service để test
    service = module.get<LoginAttemptsService>(LoginAttemptsService);
  });
  //Test case viết ở đây
  describe('trackAttempt', () => {
    it('should handle successful login', async () => {
      //Test logic
      //1. ARRAGE (Chuẩn bị dữ liệu test)
      const testEmail = 'test@example.com';
      //Tạo một số lần đăng nhập thất bại trước
      await service.trackAttempt(testEmail, false); //lần 1
      await service.trackAttempt(testEmail, false); //lần 2
      //2. ACT(hành động cần test)
      await service.trackAttempt(testEmail, true); //Đăng nhập thành công
      //3. ASSERT ( kiểm tra kết quả)
      const remainingAttempts = await service.getRemainingAttempts(testEmail);
      expect(remainingAttempts).toBe(5); //Reset về max attempts
    });
    it('should handle failed login', async () => {
      const testEmail = 'test@example.com';
      await service.trackAttempt(testEmail, false);
      const remainingAttempts = await service.getRemainingAttempts(testEmail);
      expect(remainingAttempts).toBe(4);
    });
    it('should lock account after max failed attempts ', async () => {
      const testEmail = ' test@example.com';
      for (let i = 0; i < 5; i++) {
        await service.trackAttempt(testEmail, false);
      }
      const isLocked = await service.isLocked(testEmail);
      expect(isLocked).toBe(true);

      const remainingAttempts = await service.getRemainingAttempts(testEmail);
      expect(remainingAttempts).toBe(0);
    });
  });
});
