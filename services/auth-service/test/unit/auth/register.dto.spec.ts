import { validate } from 'class-validator';
import { RegisterDto } from '../../../src/auth/dto/register.dto';

describe('RegisterDto', () => {
  it('should validate valid registration data', async () => {
    const dto = new RegisterDto();
    dto.name = 'Test User';
    dto.email = 'test@example.com';
    dto.password = 'Password123!';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid email', async () => {
    const dto = new RegisterDto();
    dto.name = 'Test User';
    dto.email = 'invalid-email';
    dto.password = 'Password123!';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail with short password', async () => {
    const dto = new RegisterDto();
    dto.name = 'Test User';
    dto.email = 'test@example.com';
    dto.password = '123';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
