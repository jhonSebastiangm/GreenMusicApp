import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song, SongStatus } from './entities/song.entity';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
  ) {}

  async create(createSongDto: CreateSongDto, artistId: string): Promise<Song> {
    const song = this.songsRepository.create({
      ...createSongDto,
      artistId,
    });
    return await this.songsRepository.save(song);
  }

  async findAll(status?: SongStatus): Promise<Song[]> {
    const where = status ? { status } : {};
    return await this.songsRepository.find({
      where,
      relations: ['artist'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Song> {
    const song = await this.songsRepository.findOne({
      where: { id },
      relations: ['artist', 'songPlays'],
    });

    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    return song;
  }

  async findByArtist(artistId: string): Promise<Song[]> {
    return await this.songsRepository.find({
      where: { artistId },
      relations: ['artist'],
      order: { created_at: 'DESC' },
    });
  }

  async update(
    id: string,
    updateSongDto: UpdateSongDto,
    user: User,
  ): Promise<Song> {
    const song = await this.findOne(id);

    if (song.artistId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only edit your own songs');
    }

    Object.assign(song, updateSongDto);
    return await this.songsRepository.save(song);
  }

  async updateStatus(id: string, status: SongStatus): Promise<Song> {
    const song = await this.findOne(id);
    song.status = status;
    return await this.songsRepository.save(song);
  }

  async remove(id: string, user: User): Promise<void> {
    const song = await this.findOne(id);

    if (song.artistId !== user.id && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only delete your own songs');
    }

    await this.songsRepository.remove(song);
  }
}

