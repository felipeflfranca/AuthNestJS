import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserPayload } from './models/UserPayload';
import { UserToken } from './models/UserToken';
import { UserPayloadJwtRefresh } from './models/UserPayloadJwtRefresh';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthJwtRefreshRequest } from './models/AuthJwtRefreshRequest';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  async login(user: User): Promise<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const payloadWithJwtRefresh: UserPayloadJwtRefresh = {
      sub: user.id,
      refresh: true,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payloadWithJwtRefresh, {
        expiresIn: '1d',
      }),
    };
  }

  async refreshToken(req: AuthJwtRefreshRequest): Promise<any> {
    const { user, body } = req;

    if (!user.id) {
      throw new UnauthorizedException('No permission for this request.');
    }

    await this.addToBlackListToken(body.refresh);

    const { id, email, name } = await this.userService.findOne(user.id);

    const payload: UserPayload = {
      sub: id,
      email: email,
      name: name,
    };

    const payloadWithJwtRefresh: UserPayloadJwtRefresh = {
      sub: id,
      refresh: true,
    };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payloadWithJwtRefresh, {
        expiresIn: '2h',
      }),
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedException(
      'Email address or password provided is incorrect.',
    );
  }

  private async addToBlackListToken(token: string) {
    try {
      const decodedToken = this.jwtService.decode(token);

      await this.prisma.blackList.create({
        data: { token, expiresIn: new Date(decodedToken.exp * 1000) },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new UnauthorizedException('Invalid token.');
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
