import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HotelService } from '../hotel/hotel.service';
import { Bookmark, Hotel, User } from '@prisma/client';

@Injectable()
export class BookmarksService {
  constructor(
    private prisma: PrismaService,
    private hotelService: HotelService,
  ) {}

  async create(
    dto: CreateBookmarkDto,
    userId: number,
    hotelId: number,
  ): Promise<void | Bookmark> {
    await this.hotelService.findOne(hotelId);
    const bookmark = await this.prisma.bookmark
      .create({
        data: {
          bookmark: dto.bookmark,
          userId: userId,
          hotelId: hotelId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to create new bookmark', 400);
        }
      });
    return bookmark;
  }

  async findAll(): Promise<void | Bookmark[]> {
    const allBookmarks = await this.prisma.bookmark
      .findMany({})
      .catch((error) => {
        if (error) throw new NotFoundException('Unable to find bookmarks');
      });
    return allBookmarks;
  }

  async remove(bookmarkId: number): Promise<boolean> {
    await this.findUnique(bookmarkId);
    await this.prisma.bookmark
      .delete({
        where: {
          id: bookmarkId,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException('Unable to to delete bookmark', 400);
        }
      });
    return true;
  }

  async findUnique(id: number): Promise<void | Bookmark> {
    const foundBookmark = await this.prisma.bookmark
      .findUnique({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Unable to find bookmark');
        }
      });
    return foundBookmark;
  }
}
