import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('points-per-play')
  async getPointsPerPlay() {
    const points = await this.configService.getPointsPerPlay();
    return { points_per_play: points };
  }

  @Put('points-per-play')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async setPointsPerPlay(@Body('points_per_play') points: number) {
    const config = await this.configService.setPointsPerPlay(points);
    return {
      points_per_play: parseInt(config.value, 10),
    };
  }
}

