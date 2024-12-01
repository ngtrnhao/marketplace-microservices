import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';
import { IsVietnamesePhoneNumber } from '../../common/validators/phone.validator';

export class CreateUserDto {
  @IsString({ message: 'Tên phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự' })
  @MaxLength(50, { message: 'Tên không được vượt quá 50 ký tự' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số hoặc ký tự đặc biệt',
  })
  password: string;

  @IsOptional()
  @IsString({ message: 'Bio phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Bio không được vượt quá 500 ký tự' })
  bio?: string;

  @IsOptional()
  @IsVietnamesePhoneNumber({ message: 'Số điện thoại không hợp lệ' })
  phoneNumber?: string;
}
