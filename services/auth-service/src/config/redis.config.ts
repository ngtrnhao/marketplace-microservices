import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT, 10) || 6379, // 10 là radix ,Radix (hay base) là cơ số của hệ đếm/Radix = 10 nghĩa là hệ thập phân (0-9)
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB, 10) || 0,
}));
