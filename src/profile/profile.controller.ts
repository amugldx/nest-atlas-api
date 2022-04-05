import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dtos/profile.dto';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post('picture')
  @UseInterceptors(FileInterceptor('file'))
  uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
  ) {
    return this.profileService.uploadPicture(file, userId);
  }

  @Post('data')
  uploadData(@Body() dto: ProfileDto, @GetCurrentUserId() userId: number) {
    return this.profileService.uploadData(dto, userId);
  }

  @Get('')
  getProfile(@GetCurrentUserId() userId: number) {
    return this.profileService.getProfile(userId);
  }
}
