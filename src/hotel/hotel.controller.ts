import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';
import { Activities, Amenity, Bookmark, Hotel, Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFoundResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/common/guards';

@ApiTags('Hotel Routes')
@UseGuards(AdminGuard)
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Picture Uploaded' })
  @Post(':id/picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) hotelId: number,
  ): Promise<void | Hotel> {
    return this.hotelService.uploadPicture(file, hotelId);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Hotel Created' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateHotelDto })
  @Post()
  create(@Body() dto: CreateHotelDto): Promise<Hotel> {
    return this.hotelService.create(dto);
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'All hotels recieved' })
  @ApiBearerAuth()
  @Get()
  findAll(): Promise<
    (Hotel & {
      amenities: Amenity;
    })[]
  > {
    return this.hotelService.findAll();
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'hotel with given id recieved' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<
    Hotel & {
      activities: Activities;
      amenities: Amenity;
      bookmark: Bookmark[];
    }
  > {
    return this.hotelService.findOne(id);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'hotel with given id updated' })
  @ApiBody({ type: CreateHotelDto })
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateHotelDto>,
  ): Promise<Hotel> {
    return this.hotelService.update(id, dto);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'hotel with given id deleted' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.hotelService.remove(id);
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'hotel with given location recieved' })
  @ApiBearerAuth()
  @Get(':location')
  findHotelWithLocation(
    @Param('location') location: string,
  ): Promise<void | Hotel[]> {
    return this.hotelService.findHotelWithLocation(location);
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'Featured hotels recieved' })
  @ApiBearerAuth()
  @Get('featured')
  findHotelFeatured(): Promise<void | Hotel[]> {
    return this.hotelService.findHotelFeatured();
  }
}
