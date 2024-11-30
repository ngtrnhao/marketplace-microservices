import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class DatabaseProvider implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('MONGODB_URI'),
      retryAttempts: 3,
      retryDelay: 1000,
      retryWrites: true,
      w: 'majority',
      minPoolSize: this.configService.get<number>('MONGODB_MIN_POOL_SIZE', 5),
      maxPoolSize: this.configService.get<number>('MONGODB_MAX_POOL_SIZE', 10),
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      replicaSet: 'atlas-cluster',
      readPreference: 'primaryPreferred',
      ssl: true,
      autoIndex: true,
      connectTimeoutMS: 10000,
      heartbeatFrequencyMS: 10000,
      maxIdleTimeMS: 45000,
    };
  }
}
