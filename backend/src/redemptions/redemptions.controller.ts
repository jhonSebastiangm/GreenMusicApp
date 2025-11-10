import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RedemptionsService } from './redemptions.service';
import { CreateRedemptionDto } from './dto/create-redemption.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { RedemptionStatus } from './entities/redemption.entity';

@Controller('redemptions')
@UseGuards(FirebaseAuthGuard)
export class RedemptionsController {
  constructor(private readonly redemptionsService: RedemptionsService) {}

  @Post()
  async create(
    @Body() createRedemptionDto: CreateRedemptionDto,
    @CurrentUser() user: User,
  ) {
    return await this.redemptionsService.create(createRedemptionDto, user.id);
  }

  @Get('my-redemptions')
  async getMyRedemptions(@CurrentUser() user: User) {
    return await this.redemptionsService.findByUser(user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return await this.redemptionsService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: RedemptionStatus,
  ) {
    return await this.redemptionsService.updateStatus(id, status);
  }
}

