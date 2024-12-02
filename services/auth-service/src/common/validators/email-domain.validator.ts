import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsAllowedDomain(
  allowedDomains: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAllowedDomain',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [allowedDomains],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return false;
          const [domains] = args.constraints;
          const domain = value.split('@')[1];
          return domains.includes(domain);
        },
      },
    });
  };
}
