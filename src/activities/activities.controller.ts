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
import { ApiFoundResponse, ApiTags } from '@nestjs/swagger';
import { Activities, SingleActivity } from '@prisma/client';

@ApiTags('Activities Routes')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Public()
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'All activities recieved' })
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
  @ApiFoundResponse({ description: 'Single activity recieved' })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) activitiesId: number,
  ): Promise<void | Activities> {
    return this.activitiesService.findOne(activitiesId);
  }
}
