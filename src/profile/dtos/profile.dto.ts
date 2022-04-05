import { IsNotEmpty, IsString } from 'class-validator';

export class ProfileDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  about: string;

  @IsNotEmpty()
  @IsString()
  location: string;
}
