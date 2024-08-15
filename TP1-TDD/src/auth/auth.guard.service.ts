import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export function extractTokenFromHeader(request: Request): string {
  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  if (type !== 'Bearer') {
    throw new UnauthorizedException();
  }
  return token;
}
