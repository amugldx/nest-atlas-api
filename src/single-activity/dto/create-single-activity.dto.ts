import { ApiProperty } from '@nestjs/swagger';
import { ActivityCategory } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateSingleActivityDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: Date, description: 'time' })
  time: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'title' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'description' })
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: ActivityCategory, description: 'Activity category' })
  category: ActivityCategory;
}
