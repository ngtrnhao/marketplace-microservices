import { IsVietnamesePhoneNumber } from 'src/common/validators/phone.validator';
import { validate } from 'class-validator';

class TestDto {
  @IsVietnamesePhoneNumber()
  phoneNumber: string;
}

describe('IsVietnamesePhoneNumber', () => {
  it('should pass for valid Vietnamese phone number', async () => {
    const dto = new TestDto();
    dto.phoneNumber = '0912345678';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
  it('should fail for invalid phone numbers', async () => {
    const dto = new TestDto();
    dto.phoneNumber = '12345';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
