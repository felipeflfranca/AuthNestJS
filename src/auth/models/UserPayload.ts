import { UserPayloadJwtRefresh } from './UserPayloadJwtRefresh';

export interface UserPayload extends UserPayloadJwtRefresh {
  email: string;
  name: string;
}
