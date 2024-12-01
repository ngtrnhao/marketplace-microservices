import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IUser } from '../interfaces/user.interface';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User implements IUser {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ default: null })
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop({ default: null })
  phoneNumber?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLogin?: Date;

  @Prop()
  refreshToken?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  //Phương thức so sánh mật khẩu
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
export const UserSchema = SchemaFactory.createForClass(User);

//Indexs
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: 1 });
UserSchema.index({ 'profile.phoneNumber': 1 });

//Middleware trước khi lưu
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

//Loại bỏ password và refeshToken khi chuyển đổi sang JSON
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

UserSchema.set('toObject', { virtuals: true });

//Virtual fields
UserSchema.virtual('fullName').get(function () {
  return `${this.name}`;
});

UserSchema.virtual('isVerified').get(function () {
  return this.email && this.isActive;
});

UserSchema.virtual('lastLoginFormatted').get(function () {
  if (!this.lastLogin) return 'Chưa đăng nhập';
  return new Date(this.lastLogin).toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });
});

UserSchema.virtual('accountAge').get(function () {
  if (!this.createdAt) return 0;
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Số ngày
});
