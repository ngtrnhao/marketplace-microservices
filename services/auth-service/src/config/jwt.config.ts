import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '15m',
  },
};

export const jwtRefreshConfig: JwtModuleOptions = {
  secret: process.env.JWT_REFRESH_SERCRET,
  signOptions: {
    expiresIn: '7d',
  },
};
