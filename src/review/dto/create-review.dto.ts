import { ApiProperty } from '@nestjs/swagger';
import { Rating } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'message' })
  message: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: Date, description: 'time' })
  time: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: Rating, description: 'Rating' })
  rating: Rating;
}
