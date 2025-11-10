import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from './entities/user.entity';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @Get('me/points')
  async getMyPoints(@CurrentUser() user: User) {
    const updatedUser = await this.usersService.findOne(user.id);
    return {
      points_balance: updatedUser.points_balance,
    };
  }

  @Get('me/history')
  async getMyHistory(@CurrentUser() user: User) {
    const userWithHistory = await this.usersService.findOne(user.id);
    return {
      songPlays: userWithHistory.songPlays || [],
      redemptions: userWithHistory.redemptions || [],
    };
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Put(':id/role')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('role') role: UserRole,
  ): Promise<User> {
    return await this.usersService.updateRole(id, role);
  }
}

