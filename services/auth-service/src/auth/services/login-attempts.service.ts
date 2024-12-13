import { Injectable } from '@nestjs/common';
import { addMinutes } from 'date-fns';

// Interface định nghĩa cấu trúc của một lần đăng nhập
interface LoginAttempt {
  count: number; // Số lần thử đăng nhập
  lastAttempt: Date; // Thời điểm thử đăng nhập gần nhất
  lockedUntil?: Date; // Thời điểm hết hạn khóa (nếu bị khóa)
}

@Injectable()
export class LoginAttemptsService {
  // Lưu trữ các lần đăng nhập theo email
  private readonly attempts = new Map<string, LoginAttempt>();
  private readonly MAX_ATTEMPTS = 5; // Số lần thử tối đa
  private readonly LOCK_TIME = 15; // Thời gian khóa (phút)

  // Theo dõi lần đăng nhập
  async trackAttempt(email: string, success: boolean): Promise<void> {
    // Lấy hoặc tạo mới thông tin đăng nhập
    const attempt = this.attempts.get(email) || {
      count: 0,
      lastAttempt: new Date(),
    };

    // Nếu đăng nhập thành công, xóa lịch sử
    if (success) {
      this.attempts.delete(email);
      return;
    }

    // Tăng số lần thử và cập nhật thời gian
    attempt.count += 1;
    attempt.lastAttempt = new Date();

    // Nếu vượt quá số lần cho phép, khóa tài khoản
    if (attempt.count >= this.MAX_ATTEMPTS) {
      attempt.lockedUntil = addMinutes(new Date(), this.LOCK_TIME);
    }

    this.attempts.set(email, attempt);
  }

  // Kiểm tra tài khoản có đang bị khóa không
  async isLocked(email: string): Promise<boolean> {
    const attempt = this.attempts.get(email);
    if (!attempt?.lockedUntil) return false;
    return new Date() < attempt.lockedUntil;
  }

  // Lấy số lần thử còn lại
  async getRemainingAttempts(email: string): Promise<number> {
    const attempt = this.attempts.get(email);
    if (!attempt) return this.MAX_ATTEMPTS;
    return Math.max(0, this.MAX_ATTEMPTS - attempt.count);
  }
}
