import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { addHours } from 'date-fns';

export interface Session {
  id: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class SessionService {
  // Lưu trữ sessions trong Map với key là sessionId và value là Session
  private sessions: Map<string, Session> = new Map();

  // Tạo session mới cho user
  async createSession(userId: string): Promise<Session> {
    const session = {
      id: uuid(),
      userId,
      createdAt: new Date(),
      expiresAt: addHours(new Date(), 24),
    };
    this.sessions.set(session.id, session);
    return session;
  }

  // Lấy thông tin session theo ID
  async getSession(sessionId: string): Promise<Session | null> {
    return this.sessions.get(sessionId) || null;
  }

  // Kiểm tra tính hợp lệ của session
  async validateSession(sessionId: string): Promise<boolean> {
    const session = await this.getSession(sessionId);
    if (!session) return false;

    // Kiểm tra session có hết hạn chưa
    if (new Date() > session.expiresAt) {
      await this.deleteSession(sessionId);
      return false;
    }
    return true;
  }
  // Xóa session
  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }
}
