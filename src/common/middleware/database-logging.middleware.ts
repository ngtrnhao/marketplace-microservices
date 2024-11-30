import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

@Injectable()
export class DatabaseLoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    // Log database connection status
    console.log(
      `Database Connection Status: ${mongoose.connection.readyState}`,
    );

    // Log query information if available
    if (req.query) {
      console.log('Query Parameters:', req.query);
    }

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log({
        type: 'MongoDB Operation',
        duration: `${duration}ms`,
        path: req.path,
        method: req.method,
        status: res.statusCode,
        connectionState: mongoose.connection.readyState,
        activeConnections: mongoose.connections.length,
      });
    });

    next();
  }
}
