import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from 'src/common/decorators';
import { ActivitiesService } from './activities.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Activities Routes')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Public()
  @HttpCode(HttpStatus.FOUND)
  @ApiCreatedResponse({ description: 'All activities recieved' })
  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }
}
