import { Injectable, HttpException } from '@nestjs/common';
import { CreateSingleActivityDto } from './dto/create-single-activity.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Activities, SingleActivity } from '@prisma/client';

@Injectable()
export class SingleActivityService {
  constructor(
    private prisma: PrismaService,
    private activities: ActivitiesService,
    private cloudinary: CloudinaryService,
  ) {}

  async create(
    dto: CreateSingleActivityDto,
    activitiesId: number,
  ): Promise<
    | void
    | (Activities & {
        activity: SingleActivity[];
      })
  > {
    await this.activities.findOne(activitiesId);
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

  findAll() {
    return `This action returns all singleActivity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} singleActivity`;
  }

  update(id: number, dto: Partial<CreateSingleActivityDto>) {
    return `This action updates a #${id} singleActivity`;
  }

  remove(id: number) {
    return `This action removes a #${id} singleActivity`;
  }
}
