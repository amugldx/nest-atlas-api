import { IsNotEmpty, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ type: Boolean, description: 'boolean value' })
  bookmark: boolean;
}
