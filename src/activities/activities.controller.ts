import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { ActivitiesService } from './activities.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Activities, SingleActivity } from '@prisma/client';

@ApiTags('Activities Routes')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Public()
  @HttpCode(HttpStatus.FOUND)
  @ApiCreatedResponse({ description: 'All activities recieved' })
  @Get()
  findAll(): Promise<
    | void
    | (Activities & {
        activity: SingleActivity[];
      })[]
  > {
    return this.activitiesService.findAll();
  }

  @Public()
  @HttpCode(HttpStatus.FOUND)
  @ApiCreatedResponse({ description: 'Single activity recieved' })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) activitiesId: number,
  ): Promise<void | Activities> {
    return this.activitiesService.findOne(activitiesId);
  }
}
