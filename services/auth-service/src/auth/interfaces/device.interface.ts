export interface IDeviceInfo {
  browser: string;
  os: string;
  deviceType: string;
  screenResolution: string;
  language: string;
}
export interface ILocationInfo {
  ip: string;
  country: string;
  city: string;
  timezone: string;
  isVPN: boolean;
}
export interface ISecurityInfo {
  trustScore: number;
  isTrusted: boolean;
  failedAttempts: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastFailedLogin: Date;
}
export interface IDevice {
  userId: string;
  deviceId: string;
  deviceInfo: IDeviceInfo;
  location: ILocationInfo;
  security: ISecurityInfo;
  lastLoginAt: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
