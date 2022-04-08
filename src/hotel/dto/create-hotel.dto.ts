import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHotelDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'name' })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'location' })
  location: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'description' })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'temperature' })
  temperature: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'address' })
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Number, description: 'price' })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: Boolean, description: 'featured' })
  featured: boolean;
}
