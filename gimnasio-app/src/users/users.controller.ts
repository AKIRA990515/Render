import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ConflictException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof Error && error.message === 'conflict') {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      if (error instanceof Error && error.message === 'not_found') {
        throw new NotFoundException('Usuario no encontrado');
      }
      if (error instanceof Error && error.message === 'conflict') {
        throw new ConflictException('El email ya está registrado');
      }
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      await this.usersService.remove(id);
    } catch (error) {
      if (error instanceof Error && error.message === 'not_found') {
        throw new NotFoundException('Usuario no encontrado');
      }
      throw error;
    }
  }

  @Patch(':id/password')
  async changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    try {
      await this.usersService.changePassword(id, changePasswordDto.currentPassword, changePasswordDto.password);
      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      if (error instanceof Error && error.message === 'not_found') {
        throw new NotFoundException('Usuario no encontrado');
      }
      if (error instanceof Error && error.message === 'invalid_password') {
        throw new BadRequestException('La contraseña actual es incorrecta');
      }
      throw error;
    }
  }
}
