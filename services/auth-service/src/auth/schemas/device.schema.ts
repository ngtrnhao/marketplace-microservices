import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IDevice,
  IDeviceInfo,
  ILocationInfo,
  ISecurityInfo,
} from '../interfaces/';

export type DeviceDocument = Device & Document;

@Schema({ timestamps: true })
export class Device implements IDevice {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  deviceId: string;

  @Prop({ type: Object })
  deviceInfo: IDeviceInfo;

  @Prop({ type: Object })
  location: ILocationInfo;

  @Prop({ type: Object })
  security: ISecurityInfo;

  @Prop()
  lastLoginAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  // Timestamps tự động được thêm vào
  createdAt?: Date;
  updatedAt?: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);

// Thêm indexes
DeviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });
DeviceSchema.index({ lastLoginAt: 1 });
DeviceSchema.index({ 'security.trustScore': 1 });
