import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { BasicAuthGuard } from './basic-auth.guard';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { JWTRefreshAuthGuard } from './auth.jwtRefreshGuard';
import { UserService } from 'src/user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(BasicAuthGuard)
  @Post('login')
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const aUser = await this.userService.findUserByMail(registerDto.email);
    if (aUser) {
      throw new ConflictException('User with this email already exists');
    }
    return this.authService.register(registerDto);
  }

  @UseGuards(JWTRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/refresh')
  async refreshToken(@Request() aRequest: any) {
    const aUser = await this.userService.findUserById(aRequest['payload'].sub);
    if (!aUser) {
      throw new NotFoundException('User doesn`t exists');
    }
    return await this.authService.getNewTokens(aUser.id, aUser.email);
  }
}
