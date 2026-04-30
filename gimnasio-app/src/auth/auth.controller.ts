import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.email, loginDto.password);
    } catch (error) {
      if (error instanceof Error && error.message === 'not_found') {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      if (error instanceof Error && error.message === 'invalid_credentials') {
        throw new UnauthorizedException('Credenciales inválidas');
      }
      throw error;
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      return await this.authService.refreshTokens(refreshTokenDto.refreshToken);
    } catch (error) {
      if (error instanceof Error && error.message === 'invalid_token') {
        throw new UnauthorizedException('Token de refresh inválido o expirado');
      }
      if (error instanceof Error && error.message === 'not_found') {
        throw new UnauthorizedException('Token de refresh inválido o expirado');
      }
      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any) {
    try {
      const userId = req.user.id;
      await this.authService.logout(userId);
    } catch (error) {
      if (error instanceof Error && error.message === 'not_found') {
        throw new BadRequestException('Sesión no válida');
      }
      throw error;
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      if (error instanceof Error && error.message === 'conflict') {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }
}