import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dtos/profile.dto';
import { Profile } from '@prisma/client';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post('picture')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
  ): Promise<string> {
    return this.profileService.uploadPicture(file, userId);
  }

  @Post('data')
  uploadData(
    @Body() dto: ProfileDto,
    @GetCurrentUserId() userId: number,
  ): Promise<Profile> {
    return this.profileService.uploadData(dto, userId);
  }

  @Get('/me')
  getProfile(@GetCurrentUserId() userId: number): Promise<Profile> {
    return this.profileService.getProfile(userId);
  }

  @Get('/:id')
  getProfileById(@Param('id') id: number) {
    return this.profileService.getProfile(id);
  }
}
