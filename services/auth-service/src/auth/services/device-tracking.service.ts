import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device } from '../schemas/device.schema';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DeviceTrackingService {
  constructor(
    // Inject Mongoose model để tương tác với collection Device
    @InjectModel(Device.name) private deviceModel: Model<Device>,
  ) {}

  // Theo dõi thiết bị đăng nhập mới
  async trackLogin(userId: string, userAgent: string) {
    const deviceId = uuidv4(); // Tạo ID thiết bị ngẫu nhiên
    await this.deviceModel.create({
      userId, // ID của user
      deviceId, // ID của thiết bị
      userAgent, // Thông tin trình duyệt/thiết bị
      lastLoginAt: new Date(), // Thời điểm đăng nhập
    });
    return deviceId;
  }

  // Lấy danh sách thiết bị đang hoạt động của user
  async getDevice(userId: string) {
    return this.deviceModel.find({ userId, isActive: true });
  }
}
