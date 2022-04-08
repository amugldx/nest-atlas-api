import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dtos/profile.dto';
import {
  ApiCreatedResponse,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
  ApiOkResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { Profile, User } from '@prisma/client';

@ApiTags('Profile Routes')
@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post('picture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: number,
  ): Promise<string> {
    return this.profileService.uploadPicture(file, userId);
  }

  @Post('create')
  @ApiCreatedResponse({ description: 'Profile data added' })
  @ApiBody({ type: ProfileDto })
  @ApiBearerAuth()
  createProfile(
    @Body() dto: ProfileDto,
    @GetCurrentUserId() userId: number,
  ): Promise<
    | void
    | (User & {
        profile: Profile;
      })
  > {
    return this.profileService.createProfile(dto, userId);
  }

  @Patch('update')
  @ApiCreatedResponse({ description: 'Profile data updated' })
  @ApiBody({ type: ProfileDto })
  @ApiBearerAuth()
  updateProfile(
    @Body() dto: ProfileDto,
    @GetCurrentUserId() userId: number,
  ): Promise<
    | void
    | (User & {
        profile: Profile;
      })
  > {
    return this.profileService.updateProfile(dto, userId);
  }

  @ApiOkResponse({ description: 'Data successfully featched' })
  @ApiBearerAuth()
  @Get('/me')
  getProfile(@GetCurrentUserId() userId: number): Promise<Profile> {
    return this.profileService.getProfile(userId);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Data successfully featched' })
  @ApiBearerAuth()
  getProfileById(@Param('id', ParseIntPipe) id: number): Promise<Profile> {
    return this.profileService.getProfile(id);
  }
}
