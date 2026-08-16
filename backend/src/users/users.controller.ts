import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  avatar?: string | null;
}

class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @IsString()
  @MinLength(8)
  newPassword!: string;
}

@UseGuards(JwtAuthGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@Req() request: { user: { sub: string } }) {
    return this.usersService.getProfile(request.user.sub);
  }

  @Patch('me')
  update(
    @Req() request: { user: { sub: string } },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(request.user.sub, dto);
  }

  @Patch('me/password')
  changePassword(
    @Req() request: { user: { sub: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      request.user.sub,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
