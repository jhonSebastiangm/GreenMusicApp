import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { SongPlaysService } from './song-plays.service';
import { CreateSongPlayDto } from './dto/create-song-play.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@Controller('song-plays')
@UseGuards(FirebaseAuthGuard)
export class SongPlaysController {
  constructor(private readonly songPlaysService: SongPlaysService) {}

  @Post()
  async create(
    @Body() createSongPlayDto: CreateSongPlayDto,
    @CurrentUser() user: User,
  ) {
    // Asegurar que el usuario solo registre sus propias reproducciones
    createSongPlayDto.userId = user.id;
    return await this.songPlaysService.create(createSongPlayDto);
  }

  @Post('songs/:songId/play-complete')
  async registerPlayComplete(
    @Param('songId', ParseUUIDPipe) songId: string,
    @CurrentUser() user: User,
  ) {
    const createSongPlayDto: CreateSongPlayDto = {
      userId: user.id,
      songId,
      completed: true,
    };
    return await this.songPlaysService.create(createSongPlayDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return await this.songPlaysService.findAll();
  }

  @Get('my-plays')
  async getMyPlays(@CurrentUser() user: User) {
    return await this.songPlaysService.findByUser(user.id);
  }

  @Get('songs/:songId')
  async findBySong(@Param('songId', ParseUUIDPipe) songId: string) {
    return await this.songPlaysService.findBySong(songId);
  }
}

