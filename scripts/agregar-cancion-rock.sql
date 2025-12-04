-- ============================================
-- AGREGAR CANCIÓN DE ROCK FUERTE
-- ============================================
-- Script para agregar una canción de rock que suene muy fuerte
-- ============================================

-- Canción de Rock Dura
INSERT INTO songs (id, title, description, artist_id, audio_url, cover_url, points_per_play, status, duration, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000206',
    'Rock Verde',
    'Rock potente con mensaje ecológico. Guitarras distorsionadas y ritmo contundente que suena muy fuerte.',
    '00000000-0000-0000-0000-000000000003', -- Artista Demo (ajustar si es necesario)
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', -- URL de ejemplo - REEMPLAZAR con URL real de tu canción de rock fuerte
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    15, -- Más puntos por ser especial
    'active',
    240, -- 4 minutos (ajustar según duración real)
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    audio_url = EXCLUDED.audio_url,
    cover_url = EXCLUDED.cover_url,
    points_per_play = EXCLUDED.points_per_play,
    status = EXCLUDED.status,
    duration = EXCLUDED.duration,
    updated_at = CURRENT_TIMESTAMP;

-- Verificar que se insertó correctamente
SELECT 
    id,
    title,
    description,
    points_per_play,
    status,
    duration
FROM songs 
WHERE id = '00000000-0000-0000-0000-000000000206';

