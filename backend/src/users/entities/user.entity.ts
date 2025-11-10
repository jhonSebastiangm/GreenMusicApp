import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Song } from '../../songs/entities/song.entity';
import { SongPlay } from '../../song-plays/entities/song-play.entity';
import { Redemption } from '../../redemptions/entities/redemption.entity';

export enum UserRole {
  USER = 'user',
  ARTIST = 'artist',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  firebase_uid: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @Index()
  role: UserRole;

  @Column({ default: 0 })
  points_balance: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Song, (song) => song.artist)
  songs: Song[];

  @OneToMany(() => SongPlay, (songPlay) => songPlay.user)
  songPlays: SongPlay[];

  @OneToMany(() => Redemption, (redemption) => redemption.user)
  redemptions: Redemption[];
}

