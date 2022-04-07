import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HotelService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHotelDto) {
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
        },
        update: {},
      })
      .catch((error) => {
        throw new ForbiddenException(error);
      });
    return hotel;
  }

  async findAll() {
    const hotels = await this.prisma.hotel.findMany();
    if (!hotels) {
      throw new NotFoundException('Hotels not found');
    }
    return hotels;
  }

  async findOne(id: number) {
    const hotel = await this.prisma.hotel.findUnique({
      where: {
        id: id,
      },
    });
    if (!hotel) {
      return new NotFoundException('Hotel not found');
    }
    return hotel;
  }

  async update(id: number, dto: Partial<CreateHotelDto>) {
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
        },
      })
      .catch((error) => {
        throw new ForbiddenException(error);
      });
    return updatedHotel;
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.hotel.delete({
      where: {
        id: id,
      },
    });
  }
}
