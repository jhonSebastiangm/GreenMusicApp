import { IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateSongPlayDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  songId: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}

