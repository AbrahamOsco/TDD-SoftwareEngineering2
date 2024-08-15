import { Injectable } from '@nestjs/common';
import { Hobby, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProfilesService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  async getProfileByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { email: username },
      include: { followers: true, followed: true },
    });
  }

  async getProfiles(): Promise<User[] | null> {
    return this.userService.getUsers({});
  }

  async getProfileFollowers(username: string): Promise<User[] | null> {
    return this.prisma.user
      .findUnique({ where: { email: username } })
      .followers();
  }

  async follow(username: string, myId: number): Promise<User> {
    return this.prisma.user.update({
      where: { email: username },
      data: { followers: { connect: [{ id: myId }] } },
    });
  }

  async unfollow(username: string, myId: number): Promise<User> {
    return this.prisma.user.update({
      where: { email: username },
      data: { followers: { disconnect: [{ id: myId }] } },
    });
  }

  async getProfileFollowed(username: string): Promise<User[] | null> {
    return this.prisma.user
      .findUnique({ where: { email: username } })
      .followed();
  }

  async getProfileHobbies(username: string): Promise<Hobby[] | null> {
    return this.prisma.user
      .findUnique({ where: { email: username } })
      .hobbies();
  }

  async getPhoto(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: username },
      select: { profile_picture: true },
    });
    return user?.profile_picture ?? null;
  }
}
