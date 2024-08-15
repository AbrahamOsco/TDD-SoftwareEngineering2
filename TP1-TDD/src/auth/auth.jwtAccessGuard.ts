import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_ACCESS_TOKEN_SECRET } from './constants';
import { extractTokenFromHeader } from './auth.guard.service';

@Injectable()
export class JWTAccessAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = extractTokenFromHeader(request);
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: JWT_ACCESS_TOKEN_SECRET,
      });
      request['payload'] = payload;
    } catch {
      console.log('Vencio el Access Token: JWT-> ', accessToken);
      throw new UnauthorizedException();
    }
    return true;
  }
}
