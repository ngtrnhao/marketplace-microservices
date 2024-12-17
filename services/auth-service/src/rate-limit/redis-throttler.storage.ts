import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

interface StorageRecord {
  totalHits: number;
  timeToExpire: number;
  throttlerName: string;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private redis: Redis;

  constructor(private configService: ConfigService) {
    const redisConfig = this.configService.get('redis');
    this.redis = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      db: redisConfig.db,
    });
  }

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<StorageRecord> {
    const multi = this.redis.multi();
    multi.incr(key);
    multi.expire(key, ttl);
    const results = await multi.exec();
    const totalHits = results[0][1] as number;

    const isBlocked = totalHits > limit;
    const timeToBlockExpire = isBlocked ? blockDuration * 1000 : 0;

    return {
      totalHits,
      timeToExpire: ttl * 1000, // Convert to milliseconds
      throttlerName,
      isBlocked,
      timeToBlockExpire,
    };
  }

  async get(key: string, throttlerName: string): Promise<StorageRecord> {
    const value = await this.redis.get(key);
    const totalHits = value ? parseInt(value, 10) : 0;
    const ttl = await this.redis.ttl(key);

    // Kiểm tra xem có đang bị block không
    const blockKey = `${key}:blocked`;
    const isBlocked = (await this.redis.exists(blockKey)) === 1;
    const timeToBlockExpire = isBlocked
      ? (await this.redis.ttl(blockKey)) * 1000
      : 0;

    return {
      totalHits,
      timeToExpire: ttl * 1000,
      throttlerName,
      isBlocked,
      timeToBlockExpire,
    };
  }

  async reset(key: string): Promise<void> {
    const multi = this.redis.multi();
    multi.del(key);
    multi.del(`${key}:blocked`);
    await multi.exec();
  }
}
