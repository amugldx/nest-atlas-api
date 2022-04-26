import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { ApiBody, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Hotel, Amenity, Role } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminGuard } from '../common/guards/roles.guard';

@ApiTags('Amnities Routes')
@UseGuards(AdminGuard)
@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Amenity Created' })
  @ApiBody({
    type: CreateAmenityDto,
    description: 'Recieves hotel id as id paramerter',
  })
  @Post(':id')
  create(
    @Param('id', ParseIntPipe) hotelId: number,
    @Body() dto: CreateAmenityDto,
  ): Promise<
    | void
    | (Hotel & {
        amenities: Amenity;
      })
  > {
    return this.amenitiesService.create(dto, hotelId);
  }

  @Roles(Role.admin)
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Amenity Updated' })
  @ApiBody({
    type: CreateAmenityDto,
    description: 'Recieves hotel id as parameter',
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAmenityDto,
  ): Promise<
    | void
    | (Hotel & {
        amenities: Amenity;
      })
  > {
    return this.amenitiesService.update(id, dto);
  }
}
