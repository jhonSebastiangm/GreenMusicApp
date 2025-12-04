import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongPlaysService } from './song-plays.service';
import { SongPlaysController } from './song-plays.controller';
import { SongPlay } from './entities/song-play.entity';
import { UsersModule } from '../users/users.module';
import { SongsModule } from '../songs/songs.module';
import { ConfigModule } from '../config/config.module';

import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SongPlay]),
    UsersModule, // Ya está importado, también sirve para FirebaseAuthGuard
    forwardRef(() => SongsModule),
    ConfigModule,
    AuthModule, // Para FirebaseAuthGuard (FirebaseService)
  ],
  controllers: [SongPlaysController],
  providers: [SongPlaysService],
  exports: [SongPlaysService],
})
export class SongPlaysModule {}

