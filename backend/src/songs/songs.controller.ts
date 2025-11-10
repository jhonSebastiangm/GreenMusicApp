import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { SongStatus } from './entities/song.entity';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async create(
    @Body() createSongDto: CreateSongDto,
    @CurrentUser() user: User,
  ) {
    return await this.songsService.create(createSongDto, user.id);
  }

  @Get()
  async findAll(@Query('status') status?: SongStatus) {
    if (status) {
      return await this.songsService.findAll(status);
    }
    return await this.songsService.findAll(SongStatus.ACTIVE);
  }

  @Get('my-songs')
  @UseGuards(FirebaseAuthGuard)
  async getMySongs(@CurrentUser() user: User) {
    return await this.songsService.findByArtist(user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.songsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSongDto: UpdateSongDto,
    @CurrentUser() user: User,
  ) {
    return await this.songsService.update(id, updateSongDto, user);
  }

  @Patch(':id/status')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: SongStatus,
  ) {
    return await this.songsService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    await this.songsService.remove(id, user);
    return { message: 'Song deleted successfully' };
  }
}

