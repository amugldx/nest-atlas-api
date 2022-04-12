import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { SingleActivityService } from './single-activity.service';
import { CreateSingleActivityDto } from './dto/create-single-activity.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { Activities, SingleActivity } from '@prisma/client';

@ApiTags('Single Activity routes')
@Controller('single-activity')
export class SingleActivityController {
  constructor(private readonly singleActivityService: SingleActivityService) {}

  @Public()
  @Post(':id')
  create(
    @Param('id', ParseIntPipe) activityId: number,
    @Body() dto: CreateSingleActivityDto,
  ): Promise<
    | void
    | (Activities & {
        activity: SingleActivity[];
      })
  > {
    return this.singleActivityService.create(dto, activityId);
  }

  @Get()
  findAll() {
    return this.singleActivityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.singleActivityService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateSingleActivityDto>,
  ) {
    return this.singleActivityService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.singleActivityService.remove(+id);
  }
}
