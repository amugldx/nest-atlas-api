import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Activities, Amenity, Bookmark, Hotel } from '@prisma/client';
import { ActivitiesService } from '../activities/activities.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { HttpException } from '@nestjs/common';

@Injectable()
export class HotelService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private activiesService: ActivitiesService,
  ) {}

  async uploadPicture(
    file: Express.Multer.File,
    hotelId: number,
  ): Promise<void | Hotel> {
    await this.findOne(hotelId);
    const imageExists = await this.findOne(hotelId);
    if (imageExists.imageId !== null) {
      await this.cloudinary.deleteImage(imageExists.imageId);
    }
    const picture = await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type');
    });
    const hotel = await this.prisma.hotel
      .update({
        where: {
          id: hotelId,
        },
        data: {
          imageId: picture.public_id,
          imageUrl: picture.secure_url,
        },
      })
      .catch((error) => {
        if (error) throw new HttpException('Unable to upload picture', 400);
      });
    return hotel;
  }

  async create(dto: CreateHotelDto): Promise<Hotel> {
    const hotel = await this.prisma.hotel
      .upsert({
        where: {
          address: dto.address,
        },
        create: {
          name: dto.name,
          description: dto.description,
          address: dto.address,
          location: dto.location,
          price: dto.price,
          temperature: dto.temperature,
          featured: dto.featured,
          imageId: null,
          imageUrl: null,
        },
        update: {},
      })
      .catch((error) => {
        throw new ForbiddenException(error);
      });
    await this.activiesService.create(hotel.id);
    return hotel;
  }

  async findAll(): Promise<
    (Hotel & {
      amenities: Amenity;
    })[]
  > {
    const hotels = await this.prisma.hotel.findMany({
      include: {
        amenities: true,
        activities: true,
        bookmark: true,
      },
    });
    if (!hotels) {
      throw new NotFoundException('Hotels not found');
    }
    return hotels;
  }

  async findOne(id: number): Promise<
    Hotel & {
      activities: Activities;
      amenities: Amenity;
      bookmark: Bookmark[];
    }
  > {
    const hotel = await this.prisma.hotel.findUnique({
      where: {
        id: id,
      },
      include: {
        activities: true,
        amenities: true,
        bookmark: true,
      },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    return hotel;
  }

  async update(id: number, dto: Partial<CreateHotelDto>): Promise<Hotel> {
    await this.findOne(id);
    const updatedHotel = this.prisma.hotel
      .update({
        where: {
          id: id,
        },
        data: {
          name: dto.name,
          description: dto.description,
          address: dto.address,
          location: dto.location,
          price: dto.price,
          temperature: dto.temperature,
          featured: dto.featured,
        },
      })
      .catch((error) => {
        throw new ForbiddenException(error);
      });
    return updatedHotel;
  }

  async remove(id: number): Promise<boolean> {
    const hotelExists = await this.findOne(id);
    if (!hotelExists) {
      throw new NotFoundException('Hotel does not exists');
    }
    await this.activiesService.removeAllActivities(id);
    if (hotelExists.imageId !== null) {
      await this.cloudinary.deleteImage(hotelExists.imageId);
    }
    await this.prisma.hotel
      .delete({
        where: {
          id: id,
        },
      })
      .catch((error) => {
        if (error) {
          throw new NotFoundException('Hotel does not exists');
        }
      });
    return true;
  }
}
