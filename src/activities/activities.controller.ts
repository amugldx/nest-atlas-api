import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { ApiBearerAuth, ApiFoundResponse, ApiTags } from '@nestjs/swagger';
import { Activities, SingleActivity } from '@prisma/client';

@ApiTags('Activities Routes')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'All activities recieved' })
  @ApiBearerAuth()
  @Get()
  findAll(): Promise<
    | void
    | (Activities & {
        activity: SingleActivity[];
      })[]
  > {
    return this.activitiesService.findAll();
  }

  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'Single activity recieved' })
  @ApiBearerAuth()
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) activitiesId: number,
  ): Promise<void | Activities> {
    return this.activitiesService.findOne(activitiesId);
  }
}
