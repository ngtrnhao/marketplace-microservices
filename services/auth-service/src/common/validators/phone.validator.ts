import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isVietnamesePhoneNumber', async: false })
export class IsVietnamesePhoneNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(phoneNumber: string) {
    if (!phoneNumber) return false;

    // Loại bỏ khoảng trắng và dấu gạch ngang
    phoneNumber = phoneNumber.replace(/[\s-]/g, '');

    // Kiểm tra số điện thoại Việt Nam
    // Bắt đầu bằng: 0, +84, 84
    // Theo sau bởi 9 chữ số
    const phoneRegex = /^(0|\+?84)?([3|5|7|8|9])[0-9]{8}$/;

    return phoneRegex.test(phoneNumber);
  }

  defaultMessage() {
    return 'Số điện thoại không hợp lệ';
  }
}

export function IsVietnamesePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsVietnamesePhoneNumberConstraint,
    });
  };
}
