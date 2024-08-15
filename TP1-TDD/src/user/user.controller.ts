import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JWTAccessAuthGuard } from 'src/auth/auth.jwtAccessGuard';
import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Patch,
  Put,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateInfoBasicUserDto } from './dto/editUser.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { HobbiesDto } from 'src/auth/dto/hobbies.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JWTAccessAuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @Put('photo')
  async updatePhoto(
    @Request() req: any,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.updatePhoto(req['payload'].sub, image);
  }

  @UseGuards(JWTAccessAuthGuard)
  @Get('photo')
  async getPhoto(@Request() req: any, @Res() res: Response) {
    const photoBuffer = await this.userService.getPhoto(req['payload'].sub);
    res.set('Content-Type', 'image/jpeg');
    res.send(photoBuffer);
  }

  @UseGuards(JWTAccessAuthGuard)
  @Patch('')
  async editMyProfile(
    @Request() req: any,
    @Body() infoBasicUser: UpdateInfoBasicUserDto,
  ) {
    const { email } = infoBasicUser;
    if (email) {
      const aUser = await this.userService.findUserByMail(email);
      if (aUser) {
        throw new ConflictException('The mail is already in use');
      }
    }
    return this.userService.updateBasicInfoUser(
      req['payload'].sub,
      infoBasicUser,
    );
  }

  @UseGuards(JWTAccessAuthGuard)
  @Get('hobbies')
  async getHobbies(@Request() req: any) {
    const aUser = await this.userService.getUserWithHobbies(req['payload'].sub);
    if (!aUser) throw new NotFoundException('User not found');
    return this.userService.getHobbies(aUser);
  }

  @UseGuards(JWTAccessAuthGuard)
  @Put('hobbies')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateHobbies(@Request() req: any, @Body() body: HobbiesDto) {
    const aUser = await this.userService.getUserWithHobbies(req['payload'].sub);
    if (!aUser) throw new NotFoundException('User not found');
    this.userService.updateHobbies(req['payload'].sub, body, aUser);
  }

  @UseGuards(JWTAccessAuthGuard)
  @Get('/followers')
  async getMyFollowers(@Request() request: any) {
    const followers = await this.userService.getFollowers(
      request['payload'].sub,
    );
    if (!followers) throw new NotFoundException('No followers found.');
    return {
      username: request['payload'].email,
      followers: followers.map((follower) => ({
        username: follower.email,
      })),
    };
  }

  @UseGuards(JWTAccessAuthGuard)
  @Get('/followed')
  async getMyFollowed(@Request() request: any) {
    const followed = await this.userService.getFollowed(request['payload'].sub);
    if (!followed) throw new NotFoundException('No followers found.');
    return {
      username: request['payload'].email,
      followed: followed.map((follower) => ({
        username: follower.email,
      })),
    };
  }

  @UseGuards(JWTAccessAuthGuard)
  @Get('/profile')
  async getMyProfile(@Request() request: any) {
    const profile = await this.userService.getProfile(request['payload'].sub);
    if (!profile) throw new NotFoundException('Profile not found.');

    return {
      username: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      birthdate: profile.birthdate,
      gender: profile.gender.description,
      hobbies: profile.hobbies,
      followers_count: profile.followers.length,
      followed_count: profile.followed.length,
    };
  }
}
