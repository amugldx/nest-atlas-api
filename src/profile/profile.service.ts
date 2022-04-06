import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProfileDto } from './dtos/profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(
    private cloudinary: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  async uploadPicture(
    file: Express.Multer.File,
    userId: number,
  ): Promise<string> {
    const picture = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type');
    });
    await this.getUser(userId);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            picture: picture.secure_url,
          },
        },
      },
    });
    return picture.secure_url;
  }

  async createProfile(dto: ProfileDto, userId: number): Promise<Profile> {
    await this.getUser(userId);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          create: {
            firstname: dto.firstname,
            lastname: dto.firstname,
            about: dto.about,
            location: dto.location,
            picture: null,
          },
        },
      },
    });

    const profile = await this.getProfile(userId);
    return profile;
  }

  async updateProfile(dto: ProfileDto, userId: number): Promise<Profile> {
    await this.getUser(userId);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profile: {
          update: {
            firstname: dto.firstname,
            lastname: dto.firstname,
            about: dto.about,
            location: dto.location,
          },
        },
      },
    });
    const profile = await this.getProfile(userId);
    return profile;
  }
  async getProfile(userId: number): Promise<Profile> {
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });
    if (!profile) {
      throw new NotFoundException('There is no profile with given data');
    }
    return profile;
  }

  async getUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('There is no user record with given data');
    }
    return user;
  }
}
