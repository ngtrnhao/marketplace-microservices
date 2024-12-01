import { validate } from 'class-validator';
import { RegisterDto } from '../../../src/auth/dto/register.dto';

describe('RegisterDto', () => {
  it('should validate valid registration data', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'Password123!';
    dto.name = 'Test User';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
