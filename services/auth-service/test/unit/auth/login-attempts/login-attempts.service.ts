import { Injectable } from '@nestjs/common';
import { addMinutes } from 'date-fns';

interface LoginAttempt {
  count: number;
  lastAttempt: Date;
  lockedUntil?: Date;
}

@Injectable()
export class LoginAttemptsService {
  private readonly attempts = new Map<string, LoginAttempt>();
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCK_TIME = 15; // minutes

  async trackAttempt(email: string, success: boolean): Promise<void> {
    const attempt = this.attempts.get(email) || {
      count: 0,
      lastAttempt: new Date(),
    };

    if (success) {
      this.attempts.delete(email);
      return;
    }

    attempt.count += 1;
    attempt.lastAttempt = new Date();

    if (attempt.count >= this.MAX_ATTEMPTS) {
      attempt.lockedUntil = addMinutes(new Date(), this.LOCK_TIME);
    }

    this.attempts.set(email, attempt);
  }

  async isLocked(email: string): Promise<boolean> {
    const attempt = this.attempts.get(email);
    if (!attempt?.lockedUntil) return false;
    return new Date() < attempt.lockedUntil;
  }

  async getRemainingAttempts(email: string): Promise<number> {
    const attempt = this.attempts.get(email);
    if (!attempt) return this.MAX_ATTEMPTS;
    return Math.max(0, this.MAX_ATTEMPTS - attempt.count);
  }
}
