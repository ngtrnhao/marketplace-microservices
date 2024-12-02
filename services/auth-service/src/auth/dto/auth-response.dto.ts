import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthResponseDto {
  @Expose()
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'ID người dùng',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'John Doe',
    description: 'Tên người dùng',
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: 'jonh@example.com',
    description: 'Email người dùng',
  })
  email: string;

  @Expose()
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    description: 'Access token',
  })
  accesToken: string;
}
