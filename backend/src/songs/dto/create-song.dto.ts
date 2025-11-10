import { IsString, IsUrl, IsNumber, IsOptional } from 'class-validator';

export class CreateSongDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  audio_url: string;

  @IsUrl()
  @IsOptional()
  cover_url?: string;

  @IsNumber()
  @IsOptional()
  points_per_play?: number;

  @IsNumber()
  duration: number; // en segundos
}

