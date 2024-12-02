import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { join } from 'path';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    const logDir = join(process.cwd(), 'logs');

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      defaultMeta: { service: 'auth-service' },
      transports: [
        new winston.transports.File({
          filename: join(logDir, 'error.log'),
          level: 'error',
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: join(logDir, 'combined.log'),
          maxsize: 5242880,
          maxFiles: 5,
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.simple(),
        }),
      );
    }
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error({
      message,
      trace,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  warn(message: string, context?: string) {
    this.logger.warn({
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  info(message: string, context?: string) {
    this.logger.info({
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  debug(message: string, context?: string) {
    this.logger.debug({
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  }
}
