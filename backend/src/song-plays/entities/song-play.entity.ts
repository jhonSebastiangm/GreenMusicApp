import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Song } from '../../songs/entities/song.entity';

@Entity('song_plays')
@Index(['user_id', 'song_id'])
export class SongPlay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @ManyToOne(() => User, (user) => user.songPlays)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'song_id' })
  @Index()
  songId: string;

  @ManyToOne(() => Song, (song) => song.songPlays)
  @JoinColumn({ name: 'song_id' })
  song: Song;

  @Column({ name: 'points_earned' })
  points_earned: number;

  @CreateDateColumn({ name: 'played_at' })
  @Index()
  played_at: Date;

  @Column({ default: false })
  completed: boolean;
}

