import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SongPlay } from '../../song-plays/entities/song-play.entity';

export enum SongStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'artist_id' })
  @Index()
  artistId: string;

  @ManyToOne(() => User, (user) => user.songs)
  @JoinColumn({ name: 'artist_id' })
  artist: User;

  @Column({ name: 'audio_url' })
  audio_url: string;

  @Column({ name: 'cover_url', nullable: true })
  cover_url: string;

  @Column({ name: 'points_per_play', default: 10 })
  points_per_play: number;

  @Column({
    type: 'enum',
    enum: SongStatus,
    default: SongStatus.PENDING,
  })
  @Index()
  status: SongStatus;

  @Column()
  duration: number; // en segundos

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => SongPlay, (songPlay) => songPlay.song)
  songPlays: SongPlay[];
}

