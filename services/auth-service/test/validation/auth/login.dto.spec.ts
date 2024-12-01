import { validate } from 'class-validator';
import { LoginDto } from '../../../src/auth/dto/login.dto';

describe('LoginDto', () => {
  it('should validate valid login data', async () => {
    const dto = new LoginDto();
    dto.email = 'test@example.com';
    dto.password = 'Password123!';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
