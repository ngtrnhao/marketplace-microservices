import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from '../schemas/audit-log.schema';
import { IpBlockingService } from './ip-blocking.service';

@Injectable()
export class SuspiciousActivityService {
  constructor(
    // Inject các dependencies cần thiết
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
    private readonly ipBlockingService: IpBlockingService,
  ) {}

  // Phát hiện hoạt động đăng nhập đáng ngờ
  async detectSuspiciousLogin(data: {
    userId: string; // ID của user
    ip: string; // IP đang thực hiện đăng nhập
    userAgent: string; // Thông tin thiết bị
  }) {
    // Đếm số lần đăng nhập thất bại trong 30 phút gần đây
    const recentFailedAttempts = await this.auditLogModel.countDocuments({
      userId: data.userId,
      action: 'login_failed',
      ip: data.ip,
      timestamp: { $gte: new Date(Date.now() - 30 * 60 * 1000) }, // 30 phút
    });

    // Nếu vượt quá 5 lần, block IP
    if (recentFailedAttempts >= 5) {
      await this.ipBlockingService.blockIp(
        data.ip,
        'Quá nhiều lần đăng nhập thất bại',
      );
      return true;
    }

    return false;
  }
}
