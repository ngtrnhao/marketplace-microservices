import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthResponseDto {
  @Expose()
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Access token',
  })
  accessToken: string;

  @Expose()
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token',
  })
  refreshToken: string;

  @Expose()
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Session ID',
  })
  sessionId: string;

  @Expose()
  @ApiProperty({
    example: 900,
    description: 'Thời gian hết hạn của access token (giây)',
  })
  expiresIn: number;
}
