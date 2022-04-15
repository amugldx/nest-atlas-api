import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateReviewDto, userId: number, hotelId: number) {
    const hotel = await this.prisma.hotel
      .update({
        where: {
          id: hotelId,
        },
        data: {
          Review: {
            create: {
              message: dto.message,
              rating: dto.rating,
              time: dto.time,
              userId,
            },
          },
        },
        include: {
          Review: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to create review', 400);
        }
      });
    if (hotel) {
      return hotel.Review;
    }
  }

  async findAll(hotelId: number) {
    const allReviews = await this.prisma.review
      .findMany({
        where: {
          hotelId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Unable to find all reviews');
        }
      });
    return allReviews;
  }

  async findOne(reviewId: number) {
    const singleReview = await this.prisma.review
      .findUnique({
        where: {
          id: reviewId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Unable to find review with given id');
        }
      });
    return singleReview;
  }

  async update(dto: Partial<CreateReviewDto>, userId: number, hotelId: number) {
    const updatedReview = await this.prisma.hotel
      .update({
        where: {
          id: hotelId,
        },
        data: {
          Review: {
            update: {
              message: dto.message,
              rating: dto.rating,
              time: dto.time,
            },
          },
        },
        include: {
          Review: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException(error, 400);
        }
      });
    if (updatedReview) {
      return updatedReview.Review;
    }
  }

  async remove(reviewId: number) {
    await this.prisma.review
      .delete({
        where: {
          id: reviewId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to delete review', 400);
        }
      });
    return true;
  }
}
