import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators';

@ApiTags('Booking Routes')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Booking created' })
  @ApiBody({ type: CreateBookingDto })
  @ApiBearerAuth()
  create(
    @Param('id', ParseIntPipe) hotelId: number,
    @Body() dto: CreateBookingDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.bookingService.create(dto, userId, hotelId);
  }

  @Get()
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'Bookings recieved' })
  @ApiBearerAuth()
  @Get()
  findAll(@GetCurrentUserId() userId: number) {
    return this.bookingService.findAll(userId);
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'Booking recieved' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':hotelId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Booking created' })
  @ApiBody({ type: CreateBookingDto })
  @ApiBearerAuth()
  update(
    @Param('hotelId') hotelId: number,
    @Body() dto: CreateBookingDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.bookingService.update(dto, userId, hotelId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Booking deleted' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
