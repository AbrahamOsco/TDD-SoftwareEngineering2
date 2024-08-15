import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UpdateInfoBasicUserDto } from './dto/editUser.dto';
import * as bcrypt from 'bcrypt';
import { HobbiesDto } from 'src/auth/dto/hobbies.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async updateBasicInfoUser(
    idUser: number,
    infoBasicUser: UpdateInfoBasicUserDto,
  ) {
    const userData: any = {};
    const { email, password, firstName, lastName, birthDate, genderId } =
      infoBasicUser;
    if (email) userData.email = email;
    if (password) userData.password = await bcrypt.hash(password, 10);
    if (firstName) userData.first_name = firstName;
    if (lastName) userData.last_name = lastName;
    if (birthDate) userData.birthdate = birthDate;
    if (genderId) userData.gender_id = genderId;
    return this.prismaService.user.update({
      where: { id: idUser },
      data: userData,
    });
  }

  async updateRefreshTokenOfUser(
    aUserId: number,
    newRefreshToken: string,
  ): Promise<User> {
    return this.prismaService.user.update({
      where: { id: aUserId },
      data: { refresh_token: newRefreshToken },
    });
  }

  async createUser(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, birthDate, genderId } =
      registerDto;
    const data: Prisma.UserCreateInput = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      birthdate: birthDate,
      gender: { connect: { id: genderId } },
    };
    return this.prismaService.user.create({ data });
  }

  async findUserByMail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async getUsers(params: Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany(params);
  }

  async deleteUser(email: string) {
    return this.prismaService.user.delete({
      where: { email },
    });
  }

  async updatePhoto(id: number, image: Express.Multer.File) {
    const user = await this.prismaService.user.update({
      where: { id },
      data: { profile_picture: { set: image.buffer } },
    });
    return user;
  }

  async updateHobbies(userId: number, hobbiesDto: HobbiesDto, aUser: any) {
    const idHobbiesPrev = aUser.hobbies.map((hobbie: { id: any }) => hobbie.id);
    const { hobbiesToDelete, hobbiesToAdd } = this.getHobbiesIdToDeletAndAdd(
      idHobbiesPrev,
      hobbiesDto.hobbies,
    );
    await this.addAnDeleteHobbies(userId, hobbiesToDelete, hobbiesToAdd);
  }

  async getPhoto(id: number): Promise<Buffer | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { profile_picture: true },
    });
    return user?.profile_picture ?? null;
  }

  private async addAnDeleteHobbies(
    userId: number,
    hobbiesToDelete: number[],
    hobbiesToAdd: number[],
  ) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        hobbies: {
          disconnect: hobbiesToDelete.map((hobbie) => ({ id: hobbie })),
        },
      },
    });

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        hobbies: {
          connect: hobbiesToAdd.map((hobbyId) => ({ id: hobbyId })),
        },
      },
    });
  }

  private getHobbiesIdToDeletAndAdd(
    idHobbiesPrev: number[],
    idHobbiesCurrent: number[],
  ) {
    const hobbiesToDelete = idHobbiesPrev.filter((idHobbyPrev) => {
      return !idHobbiesCurrent.includes(idHobbyPrev);
    });

    const hobbiesToAdd = idHobbiesCurrent.filter((idHobbyCurr) => {
      return !idHobbiesPrev.includes(idHobbyCurr);
    });
    return { hobbiesToDelete, hobbiesToAdd };
  }
  async getUserWithHobbies(userId: number) {
    const aUser = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { hobbies: true },
    });
    return aUser;
  }

  async getFollowers(userId: number): Promise<User[] | null> {
    return this.prismaService.user
      .findUnique({ where: { id: userId } })
      .followers();
  }

  async getFollowed(userId: number): Promise<User[] | null> {
    return this.prismaService.user
      .findUnique({ where: { id: userId } })
      .followed();
  }

  async getProfile(userId: number) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      include: { followers: true, followed: true, gender: true, hobbies: true },
    });
  }

  async getHobbies(aUser: any) {
    return aUser.hobbies;
  }
}
