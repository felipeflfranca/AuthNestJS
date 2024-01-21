import { AuthRequest } from './AuthRequest';

export interface AuthJwtRefreshRequest extends AuthRequest {
  body: { refresh: string };
}
