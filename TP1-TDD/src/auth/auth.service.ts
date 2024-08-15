/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET,
} from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByMail(email);
    if (user) {
      const isPasswordValid = await bcrypt.compare(pass, user.password);

      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async getNewTokens(userId: number, email: string) {
    return this.getTokensAndUpdateRefreshToken(userId, email);
  }

  async login(aUser: User) {
    const { accessToken, refreshToken } =
      await this.getTokensAndUpdateRefreshToken(aUser.id, aUser.email);
    return { accessToken, refreshToken };
  }

  async getTokensAndUpdateRefreshToken(userId: number, aEmail: string) {
    const payload = { sub: userId, email: aEmail };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_ACCESS_TOKEN_SECRET,
      expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: JWT_REFRESH_TOKEN_SECRET,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
    await this.userService.updateRefreshTokenOfUser(userId, refreshToken);
    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return await this.userService.createUser({
      ...registerDto,
      password: hashedPassword,
    });
  }
}
