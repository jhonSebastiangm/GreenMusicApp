-- ============================================
-- DATOS DE PRUEBA COMPLETOS PARA GREEN MUSIC
-- ============================================
-- Este script inserta usuarios, canciones, productos y configuraciones
-- para tener una demo completa lista para presentación
--
-- IMPORTANTE: Los usuarios deben crearse primero en Firebase Auth
-- Luego actualiza los firebase_uid en este script o después de ejecutarlo
-- ============================================

-- Limpiar datos existentes (opcional, comentar si no quieres borrar)
-- TRUNCATE TABLE song_plays, redemptions, songs, products, users CASCADE;

-- ============================================
-- 1. USUARIOS DE PRUEBA
-- ============================================
-- NOTA: Crea estos usuarios primero en Firebase Console:
-- https://console.firebase.google.com/ > Authentication > Users > Add user

-- Usuario Admin
INSERT INTO users (id, firebase_uid, email, name, role, points_balance, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'firebase-uid-admin-test', -- ACTUALIZAR con UID real de Firebase
    'admin@test.com',
    'Admin Demo',
    'admin',
    1000,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE 
SET firebase_uid = EXCLUDED.firebase_uid,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    points_balance = EXCLUDED.points_balance;

-- Usuario Normal
INSERT INTO users (id, firebase_uid, email, name, role, points_balance, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'firebase-uid-user-test', -- ACTUALIZAR con UID real de Firebase
    'user@test.com',
    'Usuario Demo',
    'user',
    500,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE 
SET firebase_uid = EXCLUDED.firebase_uid,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    points_balance = EXCLUDED.points_balance;

-- Artista (para subir canciones)
INSERT INTO users (id, firebase_uid, email, name, role, points_balance, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'firebase-uid-artist-test', -- ACTUALIZAR con UID real de Firebase
    'artist@test.com',
    'Artista Demo',
    'artist',
    300,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO UPDATE 
SET firebase_uid = EXCLUDED.firebase_uid,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    points_balance = EXCLUDED.points_balance;

-- ============================================
-- 2. CANCIONES DE PRUEBA
-- ============================================
-- Usando URLs de audio de ejemplo (puedes reemplazarlas con tus propias URLs)
-- Para demo, usamos URLs públicas de música libre o placeholders

-- Canción 1: Música Ambiental
INSERT INTO songs (id, title, description, artist_id, audio_url, cover_url, points_per_play, status, duration, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000201',
    'Naturaleza Sonora',
    'Melodía relajante inspirada en la naturaleza. Perfecta para meditar y conectar con el medio ambiente.',
    '00000000-0000-0000-0000-000000000003', -- Artista Demo
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', -- URL de ejemplo
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    10,
    'active',
    180, -- 3 minutos
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Canción 2: Eco Beats
INSERT INTO songs (id, title, description, artist_id, audio_url, cover_url, points_per_play, status, duration, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000202',
    'Eco Beats',
    'Ritmo electrónico con mensaje ecológico. Música que inspira acción por el planeta.',
    '00000000-0000-0000-0000-000000000003', -- Artista Demo
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', -- URL de ejemplo
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500',
    10,
    'active',
    210, -- 3.5 minutos
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Canción 3: Verde Esperanza
INSERT INTO songs (id, title, description, artist_id, audio_url, cover_url, points_per_play, status, duration, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000203',
    'Verde Esperanza',
    'Canción acústica sobre la esperanza de un futuro más verde. Letras inspiradoras y melodía suave.',
    '00000000-0000-0000-0000-000000000003', -- Artista Demo
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', -- URL de ejemplo
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500',
    10,
    'active',
    195, -- 3.25 minutos
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Canción 4: Ritmo Sostenible
INSERT INTO songs (id, title, description, artist_id, audio_url, cover_url, points_per_play, status, duration, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000204',
    'Ritmo Sostenible',
    'Fusión de ritmos latinos con mensaje de sostenibilidad. Música que mueve y educa.',
    '00000000-0000-0000-0000-000000000003', -- Artista Demo
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', -- URL de ejemplo
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=500',
    15, -- Más puntos por ser especial
    'active',
    240, -- 4 minutos
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Canción 5: Océano Azul
INSERT INTO songs (id, title, description, artist_id, audio_url, cover_url, points_per_play, status, duration, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000205',
    'Océano Azul',
    'Homenaje a nuestros océanos. Melodía que evoca la inmensidad y belleza del mar.',
    '00000000-0000-0000-0000-000000000003', -- Artista Demo
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', -- URL de ejemplo
    'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=500',
    10,
    'active',
    165, -- 2.75 minutos
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Canción 6: Rock Verde (Canción de Rock Dura)
INSERT INTO songs (id, title, description, artist_id, audio_url, cover_url, points_per_play, status, duration, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000206',
    'Rock Verde',
    'Rock potente con mensaje ecológico. Guitarras distorsionadas y ritmo contundente que suena muy fuerte.',
    '00000000-0000-0000-0000-000000000003', -- Artista Demo
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', -- URL de ejemplo (reemplazar con URL real de rock)
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
    15, -- Más puntos por ser especial
    'active',
    240, -- 4 minutos
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. PRODUCTOS DE PRUEBA
-- ============================================

INSERT INTO products (id, title, description, image_url, points_required, stock, category, status, created_at, updated_at)
VALUES 
(
    '00000000-0000-0000-0000-000000000101',
    'Camiseta EcoBeats',
    'Camiseta oficial de Green Music, 100% algodón orgánico. Diseño exclusivo y sostenible.',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    200,
    50,
    'Ropa',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '00000000-0000-0000-0000-000000000102',
    'Planta un Árbol',
    'Por cada canjeo, plantaremos un árbol en tu nombre en una zona de reforestación. Certificado incluido.',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500',
    100,
    999999, -- Stock ilimitado (valor alto)
    'Ecológico',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '00000000-0000-0000-0000-000000000103',
    'Entrada a Concierto VIP',
    'Entrada VIP para el próximo concierto de Green Music. Incluye acceso a área exclusiva y meet & greet.',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500',
    500,
    20,
    'Eventos',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '00000000-0000-0000-0000-000000000104',
    'Copa Reutilizable',
    'Copa de acero inoxidable con logo de Green Music. Mantiene la temperatura y es 100% reciclable.',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    150,
    100,
    'Accesorios',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '00000000-0000-0000-0000-000000000105',
    'Bolsa de Tela Ecológica',
    'Bolsa de tela orgánica reutilizable. Perfecta para tus compras diarias y reducir el uso de plástico.',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    80,
    200,
    'Accesorios',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '00000000-0000-0000-0000-000000000106',
    'Kit de Semillas',
    'Kit completo de semillas orgánicas para iniciar tu huerto. Incluye guía de cultivo ecológico.',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500',
    120,
    75,
    'Ecológico',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    points_required = EXCLUDED.points_required,
    stock = EXCLUDED.stock,
    category = EXCLUDED.category,
    status = EXCLUDED.status;

-- ============================================
-- 4. REPRODUCCIONES DE PRUEBA (Historial)
-- ============================================
-- Simular algunas reproducciones para tener historial

INSERT INTO song_plays (id, user_id, song_id, points_earned, played_at, completed)
VALUES 
-- Usuario normal ha reproducido algunas canciones
(
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000002', -- Usuario Demo
    '00000000-0000-0000-0000-000000000201', -- Naturaleza Sonora
    10,
    CURRENT_TIMESTAMP - INTERVAL '2 days',
    true
),
(
    '00000000-0000-0000-0000-000000000302',
    '00000000-0000-0000-0000-000000000002', -- Usuario Demo
    '00000000-0000-0000-0000-000000000202', -- Eco Beats
    10,
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    true
),
(
    '00000000-0000-0000-0000-000000000303',
    '00000000-0000-0000-0000-000000000002', -- Usuario Demo
    '00000000-0000-0000-0000-000000000204', -- Ritmo Sostenible
    15,
    CURRENT_TIMESTAMP - INTERVAL '12 hours',
    true
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 5. REDENCIONES DE PRUEBA (Historial)
-- ============================================
-- Simular una redención para tener historial

INSERT INTO redemptions (id, user_id, product_id, points_used, status, created_at, updated_at)
VALUES 
(
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000002', -- Usuario Demo
    '00000000-0000-0000-0000-000000000102', -- Planta un Árbol
    100,
    'completed',
    CURRENT_TIMESTAMP - INTERVAL '3 days',
    CURRENT_TIMESTAMP - INTERVAL '2 days'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 6. CONFIGURACIÓN
-- ============================================

-- Asegurar que la configuración de puntos esté correcta
INSERT INTO app_config (key, value, description, updated_at)
VALUES 
('points_per_play', '10', 'Puntos otorgados por cada reproducción completa de canción', CURRENT_TIMESTAMP),
('default_song_points', '10', 'Puntos por defecto para nuevas canciones', CURRENT_TIMESTAMP)
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value,
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;

-- ============================================
-- 7. ACTUALIZAR PUNTOS DE USUARIOS
-- ============================================
-- Ajustar puntos basados en reproducciones y redenciones

UPDATE users 
SET points_balance = (
    SELECT COALESCE(SUM(points_earned), 0) - COALESCE(SUM(points_used), 0)
    FROM (
        SELECT points_earned, 0 as points_used
        FROM song_plays 
        WHERE user_id = users.id
        UNION ALL
        SELECT 0, points_used
        FROM redemptions 
        WHERE user_id = users.id
    ) AS balance
) + 500 -- Puntos iniciales base
WHERE id IN (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003'
);

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ DATOS DE PRUEBA INSERTADOS';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE '👤 USUARIOS:';
    RAISE NOTICE '   - admin@test.com (Admin) - 1000 puntos';
    RAISE NOTICE '   - user@test.com (Usuario) - 500+ puntos';
    RAISE NOTICE '   - artist@test.com (Artista) - 300 puntos';
    RAISE NOTICE '';
    RAISE NOTICE '🎵 CANCIONES: 5 canciones activas';
    RAISE NOTICE '   1. Naturaleza Sonora (3 min)';
    RAISE NOTICE '   2. Eco Beats (3.5 min)';
    RAISE NOTICE '   3. Verde Esperanza (3.25 min)';
    RAISE NOTICE '   4. Ritmo Sostenible (4 min) - 15 puntos';
    RAISE NOTICE '   5. Océano Azul (2.75 min)';
    RAISE NOTICE '';
    RAISE NOTICE '🛍️  PRODUCTOS: 6 productos disponibles';
    RAISE NOTICE '   1. Camiseta EcoBeats (200 puntos)';
    RAISE NOTICE '   2. Planta un Árbol (100 puntos)';
    RAISE NOTICE '   3. Entrada Concierto VIP (500 puntos)';
    RAISE NOTICE '   4. Copa Reutilizable (150 puntos)';
    RAISE NOTICE '   5. Bolsa de Tela (80 puntos)';
    RAISE NOTICE '   6. Kit de Semillas (120 puntos)';
    RAISE NOTICE '';
    RAISE NOTICE '📊 HISTORIAL:';
    RAISE NOTICE '   - 3 reproducciones de ejemplo';
    RAISE NOTICE '   - 1 redención de ejemplo';
    RAISE NOTICE '';
    RAISE NOTICE '⚙️  CONFIGURACIÓN:';
    RAISE NOTICE '   - 10 puntos por reproducción';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANTE:';
    RAISE NOTICE '   1. Crea los usuarios en Firebase Auth primero';
    RAISE NOTICE '   2. Actualiza los firebase_uid en la tabla users';
    RAISE NOTICE '   3. Las URLs de audio son de ejemplo - reemplázalas con tus propias';
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
END $$;






