import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { Activities, Hotel, SingleActivity } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SingleActivityService } from '../single-activity/single-activity.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private prisma: PrismaService,
    private singleActivity: SingleActivityService,
  ) {}

  async create(hotelId: number): Promise<
    | void
    | (Hotel & {
        activities: Activities;
      })
  > {
    await this.getHotel(hotelId);
    const activities = await this.prisma.hotel
      .update({
        where: {
          id: hotelId,
        },
        data: {
          activities: {
            create: {},
          },
        },
        include: {
          activities: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to create activites', 400);
        }
      });
    return activities;
  }

  async findAll(): Promise<
    | void
    | (Activities & {
        activity: SingleActivity[];
      })[]
  > {
    const allActivities = await this.prisma.activities
      .findMany({
        include: {
          activity: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Activities not found');
        }
      });
    return allActivities;
  }

  async findOne(activitiesId: number): Promise<void | Activities> {
    const activites = this.prisma.activities
      .findUnique({
        where: {
          id: activitiesId,
        },
        include: {
          activity: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Activites with given id not found');
        }
      });
    return activites;
  }

  async getHotel(hotelId: number): Promise<void | Hotel> {
    const hotel = await this.prisma.hotel
      .findUnique({
        where: {
          id: hotelId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Unable to find hotel');
        }
      });
    return hotel;
  }

  async removeAllActivities(hotelId: number) {
    const activities = await this.prisma.activities.findUnique({
      where: {
        hotelId: hotelId,
      },
      include: {
        activity: true,
      },
    });
    activities.activity.forEach(async (activity) => {
      await this.singleActivity.removeCascade(activity.imageId);
    });
  }
}
