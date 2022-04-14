import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SingleActivityService } from './single-activity.service';
import { CreateSingleActivityDto } from './dto/create-single-activity.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { Activities, SingleActivity } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiFoundResponse } from '@nestjs/swagger';

@ApiTags('Single Activity routes')
@Controller('single-activity')
export class SingleActivityController {
  constructor(private readonly singleActivityService: SingleActivityService) {}

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Picture Uploaded' })
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
    @Param('id', ParseIntPipe) activityId: number,
  ): Promise<void | SingleActivity> {
    return this.singleActivityService.uploadPicture(file, activityId);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Activity Created' })
  @ApiBody({ type: CreateSingleActivityDto })
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

  @Public()
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'All activities found' })
  @Get()
  findAll() {
    return this.singleActivityService.findAll();
  }

  @Public()
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'Activity Found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.singleActivityService.findOne(+id);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Activity updated' })
  @ApiBody({ type: CreateSingleActivityDto })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) activitiesId: number,
    @Body() dto: Partial<CreateSingleActivityDto>,
  ) {
    return this.singleActivityService.update(activitiesId, dto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Activity deleted' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.singleActivityService.remove(+id);
  }
}
