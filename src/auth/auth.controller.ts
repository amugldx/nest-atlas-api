import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  GetCurrentUser,
  GetCurrentUserId,
  Public,
} from 'src/common/decorators';
import { RtGuard } from 'src/common/guards';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Auth Routes')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'User Registeration' })
  @ApiBody({ type: AuthDto })
  async signup(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    const tokens = await this.authService.signup(dto);
    if (tokens) {
      this.setCookies('AtlasJwtAt', tokens.access_token, 15, response);
      this.setCookies('AtlasJwtRt', tokens.refresh_token, 21600, response);
      this.setAtlasCookie(response);
      return true;
    }
    return false;
  }

  @Public()
  @Post('signup/ad')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Admin Registeration' })
  @ApiBody({ type: AuthDto })
  async signupAd(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    const tokens = await this.authService.signupAd(dto);
    if (tokens) {
      this.setCookies('AtlasJwtAt', tokens.access_token, 15, response);
      this.setCookies('AtlasJwtRt', tokens.refresh_token, 21600, response);
      this.setAtlasCookie(response);
      return true;
    }
    return false;
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
  async signinEmail(
    @Body() dto: Partial<AuthDto>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    const tokens = await this.authService.signinEmail(dto);
    if (tokens) {
      this.setCookies('AtlasJwtAt', tokens.access_token, 15, response);
      this.setCookies('AtlasJwtRt', tokens.refresh_token, 21600, response);
      this.setAtlasCookie(response);
      return true;
    }
    return false;
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
  async signinUsername(
    @Body() dto: Partial<AuthDto>,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    const tokens = await this.authService.signinUsername(dto);
    if (tokens) {
      this.setCookies('AtlasJwtAt', tokens.access_token, 15, response);
      this.setCookies('AtlasJwtRt', tokens.refresh_token, 21600, response);
      this.setAtlasCookie(response);
      return true;
    }
    return false;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User loged out' })
  async logout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    const user = await this.authService.logout(userId);
    if (user) {
      this.removeCookies(response);
      return true;
    }
    return false;
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'New tokens assigned' })
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<boolean> {
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    if (tokens) {
      this.setCookies('AtlasJwtAt', tokens.access_token, 15, response);
      this.setCookies('AtlasJwtRt', tokens.refresh_token, 21600, response);
      this.setAtlasCookie(response);
      return true;
    }
    return true;
  }

  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'User Deleted' })
  async deleteUser(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.deleteUser(userId);
    if (user) {
      this.removeCookies(response);
      return true;
    }
    return false;
  }

  setCookies(name: string, value: string, minutes: number, response: Response) {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);

    response.cookie(name, value, {
      httpOnly: true,
      domain: this.configService.get('FRONTEND_DOMAIN'),
      expires: date,
    });
  }

  removeCookies(response: Response) {
    const date = new Date();
    response.cookie('AtlasJwtAt', '', {
      httpOnly: true,
      domain: this.configService.get('FRONTEND_DOMAIN'),
    });
    response.cookie('AtlasJwtRt', '', {
      httpOnly: true,
      domain: this.configService.get('FRONTEND_DOMAIN'),
    });
    response.cookie('AtlasLogged', '', {
      domain: this.configService.get('FRONTEND_DOMAIN'),
      expires: date,
    });
  }

  setAtlasCookie(response: Response) {
    const date = new Date();
    date.setTime(date.getTime() + 15 * 60 * 1000);
    response.cookie('AtlasLogged', true, {
      domain: this.configService.get('FRONTEND_DOMAIN'),
      expires: date,
    });
  }
}
