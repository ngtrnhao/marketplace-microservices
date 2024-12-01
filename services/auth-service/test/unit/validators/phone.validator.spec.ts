import { validate } from 'class-validator';
import { IsVietnamesePhoneNumber } from '../../../src/common/validators/phone.validator';

class TestDto {
  @IsVietnamesePhoneNumber()
  phoneNumber: string;
}

describe('IsVietnamesePhoneNumber', () => {
  it('should pass for valid Vietnamese phone number', async () => {
    const validNumbers = [
      '0912345678',
      '0323456789',
      '0843456789',
      '0983456789',
      '+84912345678',
    ];

    for (const number of validNumbers) {
      const dto = new TestDto();
      dto.phoneNumber = number;
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    }
  });
});
