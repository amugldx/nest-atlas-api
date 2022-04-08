import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateAmenityDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean, description: 'wifi' })
  wifi: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean, description: 'hotel resturant' })
  hotelResturant: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean, description: 'swimming pool' })
  swimmingPlool: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean, description: 'inn bar' })
  innBar: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean, description: 'parking spot' })
  parkingSpot: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean, description: 'night club' })
  nightClub: boolean;
}
