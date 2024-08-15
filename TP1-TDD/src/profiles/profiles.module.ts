import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma.service';
import { ProfilesController } from './profiles.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, UserService, PrismaService],
})
export class ProfilesModule {}
