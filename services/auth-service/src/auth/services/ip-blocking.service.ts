import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockedIP } from '../schemas/blocked-ip.schema';

@Injectable()
export class IpBlockingService {
  constructor(
    // Inject Mongoose model để tương tác với collection BlockedIP
    @InjectModel(BlockedIP.name) private blockedIpModel: Model<BlockedIP>,
  ) {}

  // Chặn một IP trong 24 giờ
  async blockIp(ip: string, reason: string) {
    const blockDuration = 24 * 60 * 60 * 1000; // 24 giờ tính bằng milliseconds
    await this.blockedIpModel.create({
      ip, // IP cần block
      reason, // Lý do block
      blockedUntil: new Date(Date.now() + blockDuration), // Thời điểm hết hạn block
    });
  }

  // Kiểm tra một IP có đang bị chặn không
  async isIpBlocked(ip: string): Promise<boolean> {
    const blockedIp = await this.blockedIpModel.findOne({
      ip,
      blockedUntil: { $gt: new Date() }, // Chỉ lấy các block còn hiệu lực
    });
    return !!blockedIp; // Convert sang boolean
  }
}
