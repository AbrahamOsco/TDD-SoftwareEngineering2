import {
  Controller,
  Get,
  Res,
  HttpException,
  Param,
  Put,
  UseGuards,
  Request,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import {
  GetProfileDto,
  GetProfileFollowedDto,
  GetProfilesDto,
  GetProfileFollowersDto,
} from './dto';
import { ApiTags } from '@nestjs/swagger';
import { JWTAccessAuthGuard } from 'src/auth/auth.jwtAccessGuard';
import { Response } from 'express';

@ApiTags('profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JWTAccessAuthGuard)
  @Get()
  async users(): Promise<GetProfilesDto> {
    const profiles = await this.profilesService.getProfiles();

    if (!profiles || !profiles.length)
      throw new HttpException('No profiles found.', 404);

    return {
      count: profiles.length,
      users: profiles.map((user) => ({
        username: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      })),
    };
  }

  @UseGuards(JWTAccessAuthGuard)
  @Get('/:username')
  async findUserById(
    @Param('username') username: string,
  ): Promise<GetProfileDto> {
    const profile = await this.profilesService.getProfileByUsername(username);

    if (!profile) throw new HttpException('Profile not found.', 404);

    return {
      username: profile.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      followers_count: profile.followers.length,
      followed_count: profile.followed.length,
    };
  }

  @UseGuards(JWTAccessAuthGuard)
  @Get(':username/followers')
  async getFollowers(
    @Param('username') username: string,
  ): Promise<GetProfileFollowersDto> {
    const followers = await this.profilesService.getProfileFollowers(username);

    if (!followers) throw new HttpException('No followers found.', 404);

    return {
      username: username,
      followers: followers.map((follower) => ({
        username: follower.email,
      })),
    };
  }

  @UseGuards(JWTAccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':username/followers')
  async follow(@Request() request: any, @Param('username') username: string) {
    const myId = request['payload'].sub;
    try {
      await this.profilesService.follow(username, myId);
    } catch (PrismaClientKnownRequestError) {
      throw new HttpException('Profile not found.', 404);
    }
  }

  @UseGuards(JWTAccessAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':username/followers')
  async unfollow(@Request() request: any, @Param('username') username: string) {
    const myId = request['payload'].sub;
    try {
      await this.profilesService.unfollow(username, myId);
    } catch (PrismaClientKnownRequestError) {
      throw new HttpException('Profile not found.', 404);
    }
  }

  @UseGuards(JWTAccessAuthGuard)
  @Get(':username/followed')
  async getFollowed(
    @Param('username') username: string,
  ): Promise<GetProfileFollowedDto> {
    const followed = await this.profilesService.getProfileFollowed(username);

    if (!followed) throw new HttpException('No followed profiles found.', 404);

    return {
      username: username,
      followed: followed.map((followed) => ({
        username: followed.email,
      })),
    };
  }

  @UseGuards(JWTAccessAuthGuard)
  @Get(':username/photo')
  async getPhoto(@Param('username') username: string, @Res() res: Response) {
    const photoBuffer = await this.profilesService.getPhoto(username);
    res.set('Content-Type', 'image/jpeg');
    res.send(photoBuffer);
  }
}
