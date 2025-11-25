-- Datos de Prueba para Green Music
-- Ejecutar después de crear las tablas con MODELO_BD.sql

-- Insertar usuario admin de prueba
-- NOTA: Necesitas crear este usuario primero en Firebase Auth con email: admin@test.com, password: Admin123!
INSERT INTO users (id, firebase_uid, email, name, role, points_balance, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'firebase-uid-admin-test',
    'admin@test.com',
    'Admin Test',
    'admin',
    1000,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insertar usuario normal de prueba
-- NOTA: Necesitas crear este usuario primero en Firebase Auth con email: user@test.com, password: User123!
INSERT INTO users (id, firebase_uid, email, name, role, points_balance, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    'firebase-uid-user-test',
    'user@test.com',
    'Usuario Test',
    'user',
    500,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insertar artista de prueba
-- NOTA: Necesitas crear este usuario primero en Firebase Auth con email: artist@test.com, password: Artist123!
INSERT INTO users (id, firebase_uid, email, name, role, points_balance, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    'firebase-uid-artist-test',
    'artist@test.com',
    'Artista Test',
    'artist',
    300,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insertar productos de prueba
INSERT INTO products (id, title, description, image_url, points_required, stock, category, status, created_at, updated_at)
VALUES 
(
    '00000000-0000-0000-0000-000000000101',
    'Camiseta EcoBeats',
    'Camiseta oficial de Green Music, 100% algodón orgánico',
    'https://via.placeholder.com/300x300?text=Camiseta+EcoBeats',
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
    'Por cada canjeo, plantaremos un árbol en tu nombre',
    'https://via.placeholder.com/300x300?text=Plantar+Arbol',
    100,
    NULL,
    'Ecológico',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '00000000-0000-0000-0000-000000000103',
    'Entrada a Concierto',
    'Entrada VIP para el próximo concierto de Green Music',
    'https://via.placeholder.com/300x300?text=Entrada+Concierto',
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
    'Copa de acero inoxidable con logo de Green Music',
    'https://via.placeholder.com/300x300?text=Copa+Reutilizable',
    150,
    100,
    'Accesorios',
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO NOTHING;

-- Actualizar configuración de puntos
UPDATE app_config 
SET value = '10', updated_at = CURRENT_TIMESTAMP 
WHERE key = 'points_per_play';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Datos de prueba insertados correctamente!';
    RAISE NOTICE '';
    RAISE NOTICE '👤 Usuarios de prueba creados:';
    RAISE NOTICE '   - admin@test.com (Admin) - Password: Admin123!';
    RAISE NOTICE '   - user@test.com (Usuario) - Password: User123!';
    RAISE NOTICE '   - artist@test.com (Artista) - Password: Artist123!';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANTE: Debes crear estos usuarios en Firebase Auth primero!';
    RAISE NOTICE '';
    RAISE NOTICE '🛍️  Productos de prueba: 4 productos creados';
    RAISE NOTICE '⚙️  Configuración: 10 puntos por reproducción';
END $$;

