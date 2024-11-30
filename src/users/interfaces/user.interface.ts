export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
  avatar?: string;
  bio?: string;
  phoneNumber?: string;
  isActive: boolean;
  lastLogin?: Date;
  refeshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
