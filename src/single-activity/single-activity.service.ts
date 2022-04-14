import {
  Injectable,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateSingleActivityDto } from './dto/create-single-activity.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Activities, SingleActivity } from '@prisma/client';

@Injectable()
export class SingleActivityService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async uploadPicture(
    file: Express.Multer.File,
    activityId: number,
  ): Promise<void | SingleActivity> {
    await this.findOne(activityId);
    const imageExists = await this.findOne(activityId);
    if (imageExists && imageExists.imageId) {
      await this.cloudinary.deleteImage(imageExists.imageId);
    }
    const picture = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type');
    });
    const activity = await this.prisma.singleActivity
      .update({
        where: {
          id: activityId,
        },
        data: {
          imageId: picture.public_id,
          imageUrl: picture.secure_url,
        },
      })
      .catch((error) => {
        if (error) throw new HttpException('Unable to upload picture', 400);
      });
    return activity;
  }

  async create(
    dto: CreateSingleActivityDto,
    activitiesId: number,
  ): Promise<
    | void
    | (Activities & {
        activity: SingleActivity[];
      })
  > {
    await this.prisma.activities
      .findUnique({
        where: {
          id: activitiesId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Activities not found');
        }
      });
    const singleActivity = await this.prisma.activities
      .update({
        where: {
          id: activitiesId,
        },
        data: {
          activity: {
            create: {
              time: dto.time,
              description: dto.description,
              category: dto.category,
              title: dto.title,
              imageId: null,
              imageUrl: null,
            },
          },
        },
        include: {
          activity: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to create new activity', 400);
        }
      });
    return singleActivity;
  }

  async findAll() {
    const allActivites = await this.prisma.singleActivity
      .findMany()
      .catch((error) => {
        if (error) {
          throw new NotFoundException('There are no activites at the moment');
        }
      });
    return allActivites;
  }

  async findOne(activityId: number) {
    const singleActivity = await this.prisma.singleActivity
      .findUnique({
        where: {
          id: activityId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Unable to find the given activity');
        }
      });
    return singleActivity;
  }

  async update(activityId: number, dto: Partial<CreateSingleActivityDto>) {
    await this.findOne(activityId);
    const updatedActivity = await this.prisma.singleActivity
      .update({
        where: {
          id: activityId,
        },
        data: {
          time: dto.time,
          title: dto.title,
          description: dto.description,
          category: dto.category,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to update given activity', 400);
        }
      });
    return updatedActivity;
  }

  async removeCascade(imageId) {
    await this.cloudinary.deleteImage(imageId);
    return true;
  }

  async remove(activityId: number) {
    await this.findOne(activityId);
    const imageUrl = await this.prisma.singleActivity.findUnique({
      where: {
        id: activityId,
      },
    });
    if (imageUrl && imageUrl.imageId) {
      await this.cloudinary.deleteImage(imageUrl.imageId);
    }
    await this.prisma.singleActivity
      .delete({
        where: {
          id: activityId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to delete given activity', 400);
        }
      });
    return true;
  }
}
