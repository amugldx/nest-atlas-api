import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'firstname' })
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'lastname' })
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'about' })
  about: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: String, description: 'location' })
  location: string;
}
