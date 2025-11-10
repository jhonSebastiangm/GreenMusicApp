# Green Music (EcoBeats) - Aplicación Completa

Aplicación móvil de música con sistema de puntos y recompensas ecológicas.

## Estructura del Proyecto

```
green-music/
├── backend/          # API NestJS
├── mobile/           # App React Native + Expo
├── admin/            # Panel Admin Next.js
└── docs/             # Documentación
```

## Stack Tecnológico

- **Backend**: NestJS + TypeScript + PostgreSQL
- **Mobile**: React Native + Expo + TypeScript
- **Admin Panel**: Next.js + TypeScript
- **Auth**: Firebase Auth
- **Storage**: Firebase Storage
- **Database**: PostgreSQL

## Configuración Inicial

### 1. Base de Datos PostgreSQL

Ejecutar el script SQL para crear las tablas:

```bash
psql -U postgres -d green_music -f docs/MODELO_BD.sql
```

### 2. Backend (NestJS)

```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno en .env
npm run start:dev
```

Variables de entorno necesarias:
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_NAME`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `PORT` (default: 3000)
- `CORS_ORIGIN`

### 3. Mobile App (React Native + Expo)

```bash
cd mobile
npm install
# Configurar variables de entorno en .env
npm start
```

Variables de entorno necesarias:
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

### 4. Admin Panel (Next.js)

```bash
cd admin
npm install
# Configurar variables de entorno en .env.local
npm run dev
```

Variables de entorno necesarias:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Funcionalidades

### Usuario Normal / Artista
- Registro e inicio de sesión con Firebase Auth
- Escuchar canciones
- Ganar puntos por cada canción escuchada
- Subir canciones (MP3, portada, descripción)
- Ver saldo de puntos
- Ver catálogo de productos para canjear
- Canjear puntos por productos

### Administrador
- Panel web de administración
- Gestionar productos (CRUD)
- Gestionar usuarios y roles
- Aprobar/rechazar canciones
- Configurar puntos por reproducción

## Documentación

Ver `docs/DISEÑO_TECNICO.md` para más detalles sobre la arquitectura y diseño.

## Despliegue

### Backend
- Plataformas recomendadas: Heroku, Railway, AWS
- Base de datos: Heroku Postgres, AWS RDS, Supabase

### Mobile App
- Expo EAS Build para iOS y Android
- App Stores: Apple App Store y Google Play Store

### Admin Panel
- Vercel, Netlify, o AWS Amplify
- Deploy automático desde Git

## Licencia

Proyecto privado - Todos los derechos reservados

