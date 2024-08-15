import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { LocalStrategy } from './local.strategy';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private localStrategy: LocalStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [email, password] =
      this.extractUserNameAndPasswordFromHeader(request);
    request.user = await this.localStrategy.validate(email, password);
    return true;
  }

  private extractUserNameAndPasswordFromHeader(
    request: Request,
  ): [string, string] {
    const [type, tokenBasic] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Basic') {
      return ['', ''];
    }
    const stringComplete = Buffer.from(tokenBasic, 'base64').toString('utf-8');
    const [email, password] = stringComplete?.split(':') ?? [];
    return [email, password];
  }
}
