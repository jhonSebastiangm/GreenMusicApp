import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SongsModule } from './songs/songs.module';
import { ProductsModule } from './products/products.module';
import { RedemptionsModule } from './redemptions/redemptions.module';
import { SongPlaysModule } from './song-plays/song-plays.module';
import { ConfigModule as AppConfigModule } from './config/config.module';
import { User } from './users/entities/user.entity';
import { Song } from './songs/entities/song.entity';
import { Product } from './products/entities/product.entity';
import { Redemption } from './redemptions/entities/redemption.entity';
import { SongPlay } from './song-plays/entities/song-play.entity';
import { AppConfig } from './config/entities/app-config.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'green_music',
      entities: [User, Song, Product, Redemption, SongPlay, AppConfig],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    SongsModule,
    ProductsModule,
    RedemptionsModule,
    SongPlaysModule,
    AppConfigModule,
  ],
})
export class AppModule {}

