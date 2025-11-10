-- Green Music (EcoBeats) - Modelo de Base de Datos PostgreSQL

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE user_role AS ENUM ('user', 'artist', 'admin');
CREATE TYPE song_status AS ENUM ('active', 'inactive', 'pending');
CREATE TYPE product_status AS ENUM ('active', 'inactive');
CREATE TYPE redemption_status AS ENUM ('pending', 'processed', 'shipped', 'completed');

-- Tabla: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'user',
    points_balance INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para users
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Tabla: songs
CREATE TABLE songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    audio_url VARCHAR(500) NOT NULL,
    cover_url VARCHAR(500),
    points_per_play INTEGER NOT NULL DEFAULT 10,
    status song_status NOT NULL DEFAULT 'pending',
    duration INTEGER NOT NULL, -- duración en segundos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para songs
CREATE INDEX idx_songs_artist_id ON songs(artist_id);
CREATE INDEX idx_songs_status ON songs(status);
CREATE INDEX idx_songs_created_at ON songs(created_at DESC);

-- Tabla: song_plays
CREATE TABLE song_plays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    points_earned INTEGER NOT NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN NOT NULL DEFAULT false
);

-- Índices para song_plays
CREATE INDEX idx_song_plays_user_id ON song_plays(user_id);
CREATE INDEX idx_song_plays_song_id ON song_plays(song_id);
CREATE INDEX idx_song_plays_played_at ON song_plays(played_at DESC);
CREATE INDEX idx_song_plays_user_song ON song_plays(user_id, song_id);

-- Tabla: products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    points_required INTEGER NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100),
    status product_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para products
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);

-- Tabla: redemptions
CREATE TABLE redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    points_used INTEGER NOT NULL,
    status redemption_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para redemptions
CREATE INDEX idx_redemptions_user_id ON redemptions(user_id);
CREATE INDEX idx_redemptions_product_id ON redemptions(product_id);
CREATE INDEX idx_redemptions_status ON redemptions(status);

-- Tabla: app_config
CREATE TABLE app_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value VARCHAR(500) NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuración inicial
INSERT INTO app_config (key, value, description) VALUES
('points_per_play', '10', 'Puntos otorgados por cada reproducción completa de canción'),
('default_song_points', '10', 'Puntos por defecto para nuevas canciones');

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_redemptions_updated_at BEFORE UPDATE ON redemptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_config_updated_at BEFORE UPDATE ON app_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Vistas útiles
CREATE VIEW user_points_summary AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.points_balance,
    COUNT(DISTINCT sp.id) as total_plays,
    SUM(sp.points_earned) as total_points_earned,
    COUNT(DISTINCT r.id) as total_redemptions,
    SUM(r.points_used) as total_points_redeemed
FROM users u
LEFT JOIN song_plays sp ON u.id = sp.user_id
LEFT JOIN redemptions r ON u.id = r.user_id
GROUP BY u.id, u.email, u.name, u.points_balance;

CREATE VIEW song_statistics AS
SELECT 
    s.id,
    s.title,
    s.artist_id,
    u.name as artist_name,
    COUNT(sp.id) as total_plays,
    COUNT(DISTINCT sp.user_id) as unique_listeners,
    SUM(sp.points_earned) as total_points_distributed
FROM songs s
LEFT JOIN song_plays sp ON s.id = sp.song_id
LEFT JOIN users u ON s.artist_id = u.id
GROUP BY s.id, s.title, s.artist_id, u.name;

