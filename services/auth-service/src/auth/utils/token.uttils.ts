import { TokenPayload } from '../interfaces/token-payload.interface';

export class TokenUtils {
  static extractTokenFromHeader(authHeader: string): string | null {
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }

  static decodeToken(token: string): TokenPayload | null {
    try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64').toString('ascii');
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  }

  static validateTokenType(
    token: string,
    expectedType: 'access' | 'refresh',
  ): boolean {
    const payload = this.decodeToken(token);
    return payload?.type === expectedType;
  }
}
