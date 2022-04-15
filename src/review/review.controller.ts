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
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetCurrentUserId } from 'src/common/decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Review Routes')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':hotelId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Review created' })
  @ApiBody({ type: CreateReviewDto })
  @ApiBearerAuth()
  create(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @Body() dto: CreateReviewDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.reviewService.create(dto, userId, hotelId);
  }

  @Get(':hotelId')
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'All reviews recieved' })
  @ApiBearerAuth()
  findAll(@Param('hotelId', ParseIntPipe) hotelId: number) {
    return this.reviewService.findAll(hotelId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.FOUND)
  @ApiFoundResponse({ description: 'Review recieved' })
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @Patch(':hotelId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Review updated' })
  @ApiBody({ type: CreateReviewDto })
  @ApiBearerAuth()
  update(
    @Param('hotelId', ParseIntPipe) hotelId: number,
    @Body() dto: Partial<CreateReviewDto>,
    @GetCurrentUserId() userId: number,
  ) {
    return this.reviewService.update(dto, userId, hotelId);
  }

  @Delete(':reviewId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Review deleted' })
  @ApiBearerAuth()
  remove(@Param('reviewId', ParseIntPipe) reviewId: number) {
    return this.reviewService.remove(reviewId);
  }
}
