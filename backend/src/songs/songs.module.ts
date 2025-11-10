import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Song } from './entities/song.entity';
import { UsersModule } from '../users/users.module';
import { SongPlaysModule } from '../song-plays/song-plays.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
    UsersModule,
    SongPlaysModule,
  ],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService],
})
export class SongsModule {}

