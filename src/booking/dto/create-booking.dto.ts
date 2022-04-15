import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: Date, description: 'starting date' })
  startingDate: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ type: Date, description: 'ending date' })
  endingDate: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'rooms' })
  rooms: number;
}
