import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_REFRESH_TOKEN_SECRET } from './constants';
import { UserService } from 'src/user/user.service';
import { extractTokenFromHeader } from './auth.guard.service';

@Injectable()
export class JWTRefreshAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const aRefreshToken = extractTokenFromHeader(request);
    try {
      const payload = await this.jwtService.verifyAsync(aRefreshToken, {
        secret: JWT_REFRESH_TOKEN_SECRET,
      });
      const aUser = await this.userService.findUserById(payload.sub);
      if (!aUser || aUser.refresh_token != aRefreshToken) {
        throw new UnauthorizedException();
      }
      payload.email = aUser.email;
      request['payload'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
