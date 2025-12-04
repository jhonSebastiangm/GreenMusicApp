import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { Song } from './entities/song.entity';
import { UsersModule } from '../users/users.module';
import { SongPlaysModule } from '../song-plays/song-plays.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
    UsersModule, // Ya está importado, también sirve para FirebaseAuthGuard
    forwardRef(() => SongPlaysModule),
    AuthModule, // Para FirebaseAuthGuard (FirebaseService)
  ],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService],
})
export class SongsModule {}

