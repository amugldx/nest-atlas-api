import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCurrentUserId } from 'src/common/decorators';
import { ApiFoundResponse } from '@nestjs/swagger';

@ApiTags('Bookmarks routes')
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post(':hotelId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Bookmark created' })
  @ApiBody({ type: CreateBookmarkDto })
  create(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @GetCurrentUserId() userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarksService.create(dto, userId, hotelId);
  }

  @Get()
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'Bookmark recieved' })
  findAll() {
    return this.bookmarksService.findAll();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Bookmark deleted' })
  remove(@Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarksService.remove(bookmarkId);
  }
}
