import { Controller, Post, Get, Body, Res, Req, HttpCode, HttpStatus, UnauthorizedException, Headers, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto, 
    @Headers('x-tenant-id') tenantId: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginDto, tenantId);
    
    // Set HTTP-Only Cookie for Refresh Token
    if (res && res.cookie) {
      res.cookie('refresh_token', `${result.user.id}:${result.refresh_token}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    return {
      success: true,
      message: 'Login successful',
      data: {
        access_token: result.access_token,
        user: result.user,
      }
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Headers('x-tenant-id') tenantId: string
  ) {
    const result = await this.authService.register(registerDto, tenantId);
    
    return {
      success: true,
      message: 'Registration successful',
      data: result,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    // We expect cookie to have the format userId:token to look it up quickly
    const cookieToken = req.cookies?.['refresh_token'];
    if (!cookieToken || !cookieToken.includes(':')) {
      throw new UnauthorizedException({ message: 'Refresh token not found or invalid', errorCode: 'AUTH_004' });
    }

    const [userId, token] = cookieToken.split(':');
    if (!userId || !token) {
      throw new UnauthorizedException({ message: 'Refresh token invalid format', errorCode: 'AUTH_004' });
    }

    const result = await this.authService.refreshWithUserId(userId, token);

    if (res && res.cookie) {
      res.cookie('refresh_token', `${userId}:${result.refresh_token}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    return {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        access_token: result.access_token,
      }
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response
  ) {
    const userId = req.user.id;
    const cookieToken = req.cookies?.['refresh_token'];
    let token = null;

    if (cookieToken && cookieToken.includes(':')) {
      token = cookieToken.split(':')[1];
    }

    await this.authService.logout(userId, token);

    if (res && res.clearCookie) {
      res.clearCookie('refresh_token');
    }

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }

  @Post('google')
  async googleLogin(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.authService.ssoLogin('google', data, tenantId);
  }

  @Post('microsoft')
  async microsoftLogin(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    return this.authService.ssoLogin('microsoft', data, tenantId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/enable')
  async enable2FA(@Req() req: any) {
    return this.authService.enable2FA(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('devices')
  async getDevices(@Req() req: any) {
    return this.authService.getDevices(req.user.id);
  }
}

