// NestJS
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private prismaService: PrismaService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActivate = await super.canActivate(context);

    if (typeof canActivate === 'boolean') {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];

      const isTokenBlacklisted = await this.prismaService.blackList.findUnique({
        where: { token },
      });

      if (!!isTokenBlacklisted) {
        throw new UnauthorizedException('Invalid token.');
      }

      return canActivate;
    }

    return false;
  }
}
