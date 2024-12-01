import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsVietnamesePhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isVietnamesePhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' &&
            /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(value)
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} phải là số điện thoại Việt Nam hợp lệ (VD: 0912345678 hoặc 84912345678)`;
        },
      },
    });
  };
}
