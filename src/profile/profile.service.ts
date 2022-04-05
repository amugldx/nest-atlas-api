import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ProfileDto } from './dtos/profile.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(
    private cloudinary: CloudinaryService,
    private prisma: PrismaService,
  ) {}

  async uploadPicture(file: Express.Multer.File, userId: number) {
    const picture = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type');
    });
    console.log(picture);
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

  async uploadData(dto: ProfileDto, userId: number) {
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

    const profile = await this.prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });
    return profile;
  }

  async getProfile(userId: number) {
    return await this.prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });
  }
}
