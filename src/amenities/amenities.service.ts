import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Hotel, Amenity } from '@prisma/client';

@Injectable()
export class AmenitiesService {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateAmenityDto,
    hotelId,
  ): Promise<
    | void
    | (Hotel & {
        amenities: Amenity;
      })
  > {
    await this.getHotel(hotelId);
    const amenity = await this.prisma.hotel
      .update({
        where: {
          id: hotelId,
        },
        data: {
          amenities: {
            create: {
              wifi: dto.wifi,
              hotelResturant: dto.hotelResturant,
              innBar: dto.innBar,
              nightClub: dto.nightClub,
              parkingSpot: dto.parkingSpot,
              swimmingPool: dto.swimmingPlool,
            },
          },
        },
        include: {
          amenities: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException("Can't create already created amenity", 400);
        }
      });
    return amenity;
  }

  async update(
    id: number,
    dto: Partial<CreateAmenityDto>,
  ): Promise<
    | void
    | (Hotel & {
        amenities: Amenity;
      })
  > {
    await this.getHotel(id);
    const updatedHotelWithAminity = await this.prisma.hotel
      .update({
        where: {
          id: id,
        },
        data: {
          amenities: {
            update: {
              wifi: dto.wifi,
              hotelResturant: dto.hotelResturant,
              innBar: dto.innBar,
              nightClub: dto.nightClub,
              parkingSpot: dto.parkingSpot,
              swimmingPool: dto.swimmingPlool,
            },
          },
        },
        include: {
          amenities: true,
        },
      })
      .catch((error) => {
        if (error) {
          throw new HttpException(error, 400);
        }
      });
    return updatedHotelWithAminity;
  }

  async getHotel(hotelId: number) {
    const hotel = await this.prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    return hotel;
  }
}
