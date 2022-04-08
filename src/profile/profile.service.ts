import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProfileDto } from './dtos/profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Profile, User } from '@prisma/client';
import { HttpException } from '@nestjs/common';

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

  async createProfile(
    dto: ProfileDto,
    userId: number,
  ): Promise<
    | void
    | (User & {
        profile: Profile;
      })
  > {
    await this.getUser(userId);
    const userWithProfile = await this.prisma.user
      .update({
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
        include: {
          profile: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Cant create already existing profile', 400);
        }
      });
    return userWithProfile;
  }

  async updateProfile(
    dto: ProfileDto,
    userId: number,
  ): Promise<
    | void
    | (User & {
        profile: Profile;
      })
  > {
    await this.getUser(userId);
    const userWithProfile = await this.prisma.user
      .update({
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
        include: {
          profile: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException(error, 400);
        }
      });
    return userWithProfile;
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
