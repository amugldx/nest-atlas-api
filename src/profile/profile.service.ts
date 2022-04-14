import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProfileDto } from './dtos/profile.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Profile } from '@prisma/client';
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
  ): Promise<Profile> {
    await this.getUser(userId);
    const imageExists = await this.getProfile(userId);
    if (imageExists.pictureId !== null) {
      await this.cloudinary.deleteImage(imageExists.pictureId);
    }
    const picture = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type');
    });
    const profile = await this.prisma.user
      .update({
        where: {
          id: userId,
        },
        data: {
          profile: {
            update: {
              picture: picture.secure_url,
              pictureId: picture.public_id,
            },
          },
        },
        include: {
          profile: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to upload picture', 400);
        }
      });
    if (profile) {
      return profile.profile;
    }
  }

  async createProfile(dto: ProfileDto, userId: number): Promise<Profile> {
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
              pictureId: null,
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
    if (userWithProfile) {
      return userWithProfile.profile;
    }
  }

  async updateProfile(dto: ProfileDto, userId: number): Promise<Profile> {
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
    if (userWithProfile) {
      return userWithProfile.profile;
    }
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

  async deleteProfile(userId: number) {
    await this.getUser(userId);
    const imageUrl = await this.prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });
    if (imageUrl.pictureId !== null) {
      await this.cloudinary.deleteImage(imageUrl.pictureId);
    }
  }
}
