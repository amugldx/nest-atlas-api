import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@ApiTags('Auth Routes')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User Registeration' })
  @ApiBody({ type: AuthDto })
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('signin/email')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User Login by email' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string' }, password: { type: 'string' } },
    },
  })
  signinEmail(@Body() dto: Partial<AuthDto>): Promise<Tokens> {
    return this.authService.signinEmail(dto);
  }

  @Public()
  @Post('signin/username')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User Login by username' })
  @ApiUnauthorizedResponse({ description: 'Invalid Credentials' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  signinUsername(@Body() dto: Partial<AuthDto>): Promise<Tokens> {
    return this.authService.signinUsername(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User loged out' })
  @ApiBearerAuth()
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'New tokens assigned' })
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User Deleted' })
  @ApiBearerAuth()
  deleteUser(@GetCurrentUserId() userId: number) {
    return this.authService.deleteUser(userId);
  }
}
