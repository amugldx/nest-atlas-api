import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Activities, Amenity, Hotel } from '@prisma/client';
import { AmenitiesService } from '../amenities/amenities.service';
import { ActivitiesService } from '../activities/activities.service';

@Injectable()
export class HotelService {
  constructor(
    private prisma: PrismaService,
    private amenitiesService: AmenitiesService,
    private activiesService: ActivitiesService,
  ) {}

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
    }
  > {
    const hotel = await this.prisma.hotel.findUnique({
      where: {
        id: id,
      },
      include: {
        activities: true,
        amenities: true,
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

  async remove(id: number): Promise<void | Hotel> {
    const hotelExists = await this.findOne(id);
    if (!hotelExists) {
      throw new NotFoundException('Hotel does not exists');
    }
    if (hotelExists.activities !== null) {
      await this.activiesService.remove(id);
    }
    if (hotelExists.amenities !== null) {
      await this.amenitiesService.remove(id);
    }
    const removedHotel = await this.prisma.hotel
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
    return removedHotel;
  }
}
