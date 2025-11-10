import { IsString, IsUrl, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { SongStatus } from '../entities/song.entity';

export class UpdateSongDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  audio_url?: string;

  @IsUrl()
  @IsOptional()
  cover_url?: string;

  @IsNumber()
  @IsOptional()
  points_per_play?: number;

  @IsEnum(SongStatus)
  @IsOptional()
  status?: SongStatus;

  @IsNumber()
  @IsOptional()
  duration?: number;
}

