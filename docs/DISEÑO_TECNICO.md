# Green Music (EcoBeats) - Diseño Técnico

## 1. Arquitectura General

### 1.1 Stack Tecnológico
- **Frontend Móvil**: React Native + TypeScript + Expo
- **Backend API**: NestJS + TypeScript
- **Base de Datos**: PostgreSQL
- **Autenticación**: Firebase Auth
- **Storage**: Firebase Storage (archivos MP3 y portadas)
- **Panel Admin**: Next.js + TypeScript

### 1.2 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE MÓVIL (React Native + Expo)      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │  Home    │  │  Player  │  │  Perfil  │   │
│  │ Register │  │  Songs   │  │  Audio   │  │  Points  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────┐  ┌──────────┐                               │
│  │ Upload   │  │ Catalog  │                               │
│  │  Song    │  │ Products │                               │
│  └──────────┘  └──────────┘                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP/HTTPS
                           │
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE SERVICES                        │
│  ┌──────────────┐        ┌──────────────┐                 │
│  │ Firebase Auth│        │Firebase Storage│                │
│  │ (Autenticación)       │ (MP3 + Images)│                │
│  └──────────────┘        └──────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                           │
                           │
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (NestJS)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │  Songs   │  │  Users   │  │ Products │   │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────┐  ┌──────────┐                               │
│  │ SongPlays│  │  Points  │                               │
│  │  Module  │  │  Service │                               │
│  └──────────┘  └──────────┘                               │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ ORM (TypeORM)
                           │
┌─────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  users   │  │  songs   │  │ products │  │song_plays│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────┐                                              │
│  │redemptions│                                             │
│  └──────────┘                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              PANEL ADMIN WEB (Next.js)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │ Products │  │  Users   │  │  Songs   │   │
│  │  Admin   │  │   CRUD   │  │   CRUD   │  │   CRUD   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────┐                                              │
│  │  Config  │                                              │
│  │  Points  │                                              │
│  └──────────┘                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Flujo de Datos

#### Flujo de Autenticación
1. Usuario inicia sesión en móvil con Firebase Auth
2. Firebase Auth genera token JWT
3. Token se envía al backend NestJS en cada request
4. Backend valida token con Firebase Admin SDK
5. Backend autoriza/deniega request según rol

#### Flujo de Reproducción de Canción
1. Usuario selecciona canción en móvil
2. App móvil solicita URL de Firebase Storage al backend
3. Backend retorna URL firmada de la canción
4. Expo AV reproduce el audio
5. Cuando la canción termina, móvil notifica al backend
6. Backend registra en `song_plays`
7. Backend calcula y asigna puntos al usuario
8. Backend actualiza saldo de puntos del usuario

#### Flujo de Subida de Canción
1. Usuario selecciona archivo MP3 y portada
2. App móvil sube archivos a Firebase Storage
3. App móvil envía metadata al backend (título, descripción, etc)
4. Backend guarda registro en BD con URLs de Firebase Storage
5. Canción queda en estado "pending" hasta aprobación admin

#### Flujo de Redención de Puntos
1. Usuario navega catálogo de productos
2. Usuario selecciona producto para canjear
3. App móvil envía request de redención al backend
4. Backend valida puntos suficientes
5. Backend crea registro en `redemptions`
6. Backend descuenta puntos del usuario
7. Backend notifica al admin para procesar envío

## 2. Modelo de Datos

### 2.1 Tablas PostgreSQL

#### users
- id: UUID (PK)
- firebase_uid: VARCHAR (unique, índice)
- email: VARCHAR (unique)
- name: VARCHAR
- role: ENUM ('user', 'artist', 'admin')
- points_balance: INTEGER (default 0)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

#### songs
- id: UUID (PK)
- title: VARCHAR
- description: TEXT
- artist_id: UUID (FK -> users.id)
- audio_url: VARCHAR (URL Firebase Storage)
- cover_url: VARCHAR (URL Firebase Storage)
- points_per_play: INTEGER (default: valor configurado)
- status: ENUM ('active', 'inactive', 'pending')
- duration: INTEGER (segundos)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

#### song_plays
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- song_id: UUID (FK -> songs.id)
- points_earned: INTEGER
- played_at: TIMESTAMP
- completed: BOOLEAN (true si se reprodujo completa)

#### products
- id: UUID (PK)
- title: VARCHAR
- description: TEXT
- image_url: VARCHAR
- points_required: INTEGER
- stock: INTEGER
- category: VARCHAR
- status: ENUM ('active', 'inactive')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

#### redemptions
- id: UUID (PK)
- user_id: UUID (FK -> users.id)
- product_id: UUID (FK -> products.id)
- points_used: INTEGER
- status: ENUM ('pending', 'processed', 'shipped', 'completed')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP

#### app_config
- id: UUID (PK)
- key: VARCHAR (unique)
- value: VARCHAR
- description: TEXT
- updated_at: TIMESTAMP

### 2.2 Relaciones
- users (1) -> (N) songs (artista)
- users (1) -> (N) song_plays
- songs (1) -> (N) song_plays
- users (1) -> (N) redemptions
- products (1) -> (N) redemptions

### 2.3 Índices
- users.firebase_uid (unique index)
- users.email (unique index)
- songs.artist_id (index)
- songs.status (index)
- song_plays.user_id (index)
- song_plays.song_id (index)
- song_plays.played_at (index)
- products.status (index)
- redemptions.user_id (index)
- redemptions.status (index)

## 3. Endpoints API (NestJS)

### 3.1 Auth
- POST /auth/login (Firebase token validation)
- POST /auth/register (Create user from Firebase)
- GET /auth/me (Get current user)

### 3.2 Songs
- GET /songs (Lista de canciones activas)
- GET /songs/:id (Detalle de canción)
- POST /songs (Subir canción - requiere auth)
- PUT /songs/:id (Editar canción - solo artista o admin)
- DELETE /songs/:id (Eliminar canción - solo artista o admin)
- POST /songs/:id/play-complete (Registrar reproducción completa)
- GET /songs/my-songs (Mis canciones - artista)

### 3.3 Users
- GET /users/me (Perfil actual)
- GET /users/me/points (Saldo de puntos)
- GET /users/me/history (Historial de reproducciones)
- GET /users (Lista usuarios - solo admin)
- PUT /users/:id (Editar usuario - solo admin)
- PUT /users/:id/role (Cambiar rol - solo admin)

### 3.4 Products
- GET /products (Catálogo de productos activos)
- GET /products/:id (Detalle de producto)
- POST /products (Crear producto - solo admin)
- PUT /products/:id (Editar producto - solo admin)
- DELETE /products/:id (Eliminar producto - solo admin)

### 3.5 Redemptions
- POST /redemptions (Crear redención)
- GET /redemptions/my-redemptions (Mis redenciones)
- GET /redemptions (Todas las redenciones - solo admin)
- PUT /redemptions/:id/status (Actualizar estado - solo admin)

### 3.6 Config
- GET /config/points-per-play (Obtener puntos por reproducción)
- PUT /config/points-per-play (Actualizar puntos - solo admin)

## 4. Estructura de Carpetas

### 4.1 Backend (NestJS)
```
backend/
├── src/
│   ├── auth/
│   ├── songs/
│   ├── users/
│   ├── products/
│   ├── redemptions/
│   ├── song-plays/
│   ├── config/
│   ├── common/
│   │   ├── guards/
│   │   ├── decorators/
│   │   ├── filters/
│   │   └── interceptors/
│   └── main.ts
├── test/
├── .env
├── package.json
└── tsconfig.json
```

### 4.2 Mobile App (React Native + Expo)
```
mobile/
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   ├── Home/
│   │   ├── Player/
│   │   ├── Profile/
│   │   ├── Upload/
│   │   └── Catalog/
│   ├── components/
│   ├── services/
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── navigation/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── app.json
├── package.json
└── tsconfig.json
```

### 4.3 Admin Panel (Next.js)
```
admin/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── users/
│   │   ├── songs/
│   │   └── config/
│   ├── components/
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   └── types/
├── package.json
└── tsconfig.json
```

## 5. Seguridad

### 5.1 Autenticación
- Firebase Auth para autenticación de usuarios
- Firebase Admin SDK en backend para validar tokens
- JWT tokens en cada request HTTP
- Guards de NestJS para proteger endpoints

### 5.2 Autorización
- Roles: user, artist, admin
- Guards de roles en endpoints sensibles
- Validación de ownership (artista solo edita sus canciones)

### 5.3 Validaciones
- DTOs con class-validator en NestJS
- Validación de archivos (tamaño, tipo)
- Rate limiting en endpoints críticos

## 6. Consideraciones de Performance

### 6.1 Base de Datos
- Índices en foreign keys y campos de búsqueda
- Paginación en listados
- Queries optimizadas con relaciones

### 6.2 Firebase Storage
- URLs firmadas con expiración
- Compresión de imágenes
- CDN para distribución de audio

### 6.3 Caching
- Cache de configuración de puntos
- Cache de lista de canciones (con invalidación)

## 7. Deployment

### 7.1 Backend
- Plataforma: Heroku, Railway, o AWS
- Variables de entorno: DATABASE_URL, FIREBASE_CREDENTIALS, etc.

### 7.2 Mobile App
- Expo EAS Build para iOS y Android
- App Stores: Apple App Store y Google Play Store

### 7.3 Admin Panel
- Vercel, Netlify, o AWS Amplify
- Deploy automático desde Git

### 7.4 Base de Datos
- PostgreSQL en Heroku Postgres, AWS RDS, o Supabase

