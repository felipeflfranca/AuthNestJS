export interface UserPayloadJwtRefresh {
  sub: string;
  refresh?: boolean;
  iat?: number;
  exp?: number;
}
