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
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { Activities, Amenity, Hotel } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Hotel Routes')
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post(':id/picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
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

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Hotel Created' })
  @ApiBody({ type: CreateHotelDto })
  @Post()
  create(@Body() dto: CreateHotelDto): Promise<Hotel> {
    return this.hotelService.create(dto);
  }

  @Public()
  @HttpCode(HttpStatus.FOUND)
  @ApiCreatedResponse({ description: 'All hotels recieved' })
  @Get()
  findAll(): Promise<
    (Hotel & {
      amenities: Amenity;
    })[]
  > {
    return this.hotelService.findAll();
  }

  @Public()
  @HttpCode(HttpStatus.FOUND)
  @ApiCreatedResponse({ description: 'hotel with given id recieved' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<
    Hotel & {
      activities: Activities;
      amenities: Amenity;
    }
  > {
    return this.hotelService.findOne(id);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'hotel with given id updated' })
  @ApiBody({ type: CreateHotelDto })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateHotelDto>,
  ): Promise<Hotel> {
    return this.hotelService.update(id, dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'hotel with given id deleted' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void | Hotel> {
    return this.hotelService.remove(id);
  }
}
