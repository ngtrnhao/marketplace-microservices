export interface TokenPayload {
  sub: string; //UserID
  userId: string;
  email: string; //User email
  role: string; //User role
  type: 'access' | 'refresh';
  sessionId?: string;
  iat?: number;
  exp?: number;
}
