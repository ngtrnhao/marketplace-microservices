import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  Matches,
} from 'class-validator';
import { IsAllowedDomain } from '../../common/validators/email-domain.validator';

export class RegisterDto {
  @IsString({ message: 'Tên phải là chuỗi ký tự ' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @MinLength(2, { message: 'Tên phải có ít nhất 2 ký tự ' })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsAllowedDomain(['gmail.com', 'example.com'], {
    message: 'Chỉ chấp nhận email từ gmail.com hoặc example.com',
  })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số hoặc ký tự đặc biệt',
  })
  password: string;
}
