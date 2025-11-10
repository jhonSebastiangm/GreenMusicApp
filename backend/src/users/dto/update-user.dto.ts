import { IsEmail, IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsNumber()
  @IsOptional()
  points_balance?: number;
}

