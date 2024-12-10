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
  private sessions: Map<string, Session> = new Map();

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

  async getSession(sessionId: string): Promise<Session | null> {
    return this.sessions.get(sessionId) || null;
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = await this.getSession(sessionId);
    if (!session) return false;
    if (new Date() > session.expiresAt) {
      await this.deleteSession(sessionId);
      return false;
    }
    return true;
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }
}
