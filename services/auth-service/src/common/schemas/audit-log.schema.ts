import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  action: string;

  @Prop({ required: true })
  ip: string;
  // Thông tin về trình duyệt/thiết bị
  // Không bắt buộc vì có thể không lấy được trong một số trường hợp
  @Prop()
  userAgent: string;

  // Chi tiết bổ sung về hành động
  // Kiểu Record<string, any> cho phép lưu trữ bất kỳ dữ liệu JSON nào
  // Ví dụ:
  // {
  //   errorMessage: 'Invalid password',
  //   attemptCount: 3,
  //   browser: 'Chrome',
  //   os: 'Windows'
  // }
  @Prop({ type: Object })
  details: Record<string, any>;

  @Prop({ required: true })
  timestamps: true;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
//dùng để ghi log theo dõi hoạt động của user ( đăng nhập)
