export interface User {
  id: string;
  firebase_uid: string;
  email: string;
  name: string;
  role: 'user' | 'artist' | 'admin';
  points_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: string;
  title: string;
  description?: string;
  artist_id: string;
  artist?: User;
  audio_url: string;
  cover_url?: string;
  points_per_play: number;
  status: 'active' | 'inactive' | 'pending';
  duration: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  points_required: number;
  stock: number;
  category?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface SongPlay {
  id: string;
  user_id: string;
  song_id: string;
  points_earned: number;
  played_at: string;
  completed: boolean;
}

export interface Redemption {
  id: string;
  user_id: string;
  product_id: string;
  points_used: number;
  status: 'pending' | 'processed' | 'shipped' | 'completed';
  created_at: string;
  updated_at: string;
  product?: Product;
}

