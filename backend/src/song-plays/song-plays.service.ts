import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SongPlay } from './entities/song-play.entity';
import { CreateSongPlayDto } from './dto/create-song-play.dto';
import { UsersService } from '../users/users.service';
import { SongsService } from '../songs/songs.service';
import { ConfigService } from '../config/config.service';

@Injectable()
export class SongPlaysService {
  constructor(
    @InjectRepository(SongPlay)
    private songPlaysRepository: Repository<SongPlay>,
    private usersService: UsersService,
    private songsService: SongsService,
    private configService: ConfigService,
  ) {}

  async create(createSongPlayDto: CreateSongPlayDto): Promise<SongPlay> {
    const song = await this.songsService.findOne(createSongPlayDto.songId);
    const user = await this.usersService.findOne(createSongPlayDto.userId);

    // Obtener puntos por reproducción (de la canción o configuración global)
    let pointsToEarn = song.points_per_play;
    if (!pointsToEarn || pointsToEarn === 0) {
      const configPoints = await this.configService.getPointsPerPlay();
      pointsToEarn = configPoints;
    }

    // Crear registro de reproducción
    const songPlay = this.songPlaysRepository.create({
      userId: createSongPlayDto.userId,
      songId: createSongPlayDto.songId,
      points_earned: pointsToEarn,
      completed: createSongPlayDto.completed || false,
    });

    const savedPlay = await this.songPlaysRepository.save(songPlay);

    // Si la canción se reprodujo completamente, asignar puntos
    if (createSongPlayDto.completed) {
      await this.usersService.updatePointsBalance(user.id, pointsToEarn);
    }

    return savedPlay;
  }

  async findAll(): Promise<SongPlay[]> {
    return await this.songPlaysRepository.find({
      relations: ['user', 'song'],
      order: { played_at: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<SongPlay[]> {
    return await this.songPlaysRepository.find({
      where: { userId },
      relations: ['song'],
      order: { played_at: 'DESC' },
    });
  }

  async findBySong(songId: string): Promise<SongPlay[]> {
    return await this.songPlaysRepository.find({
      where: { songId },
      relations: ['user'],
      order: { played_at: 'DESC' },
    });
  }
}

