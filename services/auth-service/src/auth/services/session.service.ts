import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
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
  private readonly redis: Redis;
  private readonly SESSION_PREFIX = 'session:';
  private readonly SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds

  constructor(private configService: ConfigService) {
    const redisConfig = this.configService.get('redis');
    this.redis = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      db: redisConfig.db,
    });
  }

  async createSession(userId: string): Promise<Session> {
    const session = {
      id: uuid(),
      userId,
      createdAt: new Date(),
      expiresAt: addHours(new Date(), 24),
    };

    const key = this.SESSION_PREFIX + session.id;
    await this.redis.set(key, JSON.stringify(session), 'EX', this.SESSION_TTL);

    return session;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const key = this.SESSION_PREFIX + sessionId;
    const data = await this.redis.get(key);
    if (!data) return null;

    return JSON.parse(data);
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = await this.getSession(sessionId);
    if (!session) return false;

    if (new Date() > new Date(session.expiresAt)) {
      await this.deleteSession(sessionId);
      return false;
    }
    return true;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const key = this.SESSION_PREFIX + sessionId;
    await this.redis.del(key);
  }

  // Phương thức để cleanup khi service shutdown
  async onApplicationShutdown() {
    await this.redis.quit();
  }
}
