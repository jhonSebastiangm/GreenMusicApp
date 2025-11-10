# Estructura del Proyecto Green Music

## 📁 Estructura de Carpetas

```
green-music/
├── backend/                 # Backend API (NestJS)
│   ├── src/
│   │   ├── auth/           # Módulo de autenticación
│   │   ├── users/          # Módulo de usuarios
│   │   ├── songs/          # Módulo de canciones
│   │   ├── products/       # Módulo de productos
│   │   ├── redemptions/    # Módulo de canjeos
│   │   ├── song-plays/     # Módulo de reproducciones
│   │   ├── config/         # Módulo de configuración
│   │   ├── common/         # Utilidades comunes
│   │   │   ├── guards/     # Guards de autenticación
│   │   │   ├── decorators/ # Decoradores personalizados
│   │   │   └── filters/    # Filtros de excepciones
│   │   └── main.ts         # Punto de entrada
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── mobile/                  # App Móvil (React Native + Expo)
│   ├── src/
│   │   ├── screens/        # Pantallas de la app
│   │   │   ├── Auth/       # Login, Register
│   │   │   ├── Home/       # Lista de canciones
│   │   │   ├── Player/     # Reproductor de audio
│   │   │   ├── Profile/    # Perfil de usuario
│   │   │   ├── Upload/     # Subir canciones
│   │   │   └── Catalog/    # Catálogo de productos
│   │   ├── components/     # Componentes reutilizables
│   │   ├── services/       # Servicios API
│   │   ├── navigation/     # Configuración de navegación
│   │   ├── context/        # Context providers
│   │   └── types/          # Tipos TypeScript
│   ├── App.tsx
│   ├── package.json
│   └── app.json
│
├── admin/                   # Panel Admin (Next.js)
│   ├── src/
│   │   ├── app/            # Páginas Next.js
│   │   │   ├── login/      # Página de login
│   │   │   └── dashboard/  # Páginas del dashboard
│   │   │       ├── products/    # Gestión de productos
│   │   │       ├── users/       # Gestión de usuarios
│   │   │       ├── songs/       # Gestión de canciones
│   │   │       └── config/      # Configuración
│   │   ├── lib/            # Utilidades
│   │   │   ├── api.ts      # Cliente API
│   │   │   └── auth.ts     # Servicio de autenticación
│   │   ├── store/          # Estado global (Zustand)
│   │   └── types/          # Tipos TypeScript
│   ├── package.json
│   └── next.config.js
│
└── docs/                    # Documentación
    ├── DISEÑO_TECNICO.md
    ├── MODELO_BD.sql
    └── INSTRUCCIONES_DESPLIEGUE.md
```

## 🔧 Tecnologías Utilizadas

### Backend
- **NestJS**: Framework Node.js
- **TypeORM**: ORM para PostgreSQL
- **Firebase Admin SDK**: Validación de tokens
- **class-validator**: Validación de DTOs
- **PostgreSQL**: Base de datos

### Mobile
- **React Native**: Framework móvil
- **Expo**: Plataforma de desarrollo
- **Expo AV**: Reproducción de audio
- **Firebase Auth**: Autenticación
- **Firebase Storage**: Almacenamiento de archivos
- **React Navigation**: Navegación

### Admin Panel
- **Next.js**: Framework React
- **TypeScript**: Tipado estático
- **Zustand**: Estado global
- **Firebase Auth**: Autenticación
- **Axios**: Cliente HTTP

## 📊 Flujo de Datos

### Autenticación
1. Usuario inicia sesión en móvil/web con Firebase Auth
2. Firebase genera token JWT
3. Token se envía al backend en cada request
4. Backend valida token con Firebase Admin SDK
5. Backend autoriza/deniega request según rol

### Reproducción de Canción
1. Usuario selecciona canción
2. App solicita URL de Firebase Storage al backend
3. Backend retorna URL de la canción
4. Expo AV reproduce el audio
5. Al completar, móvil notifica al backend
6. Backend registra en `song_plays`
7. Backend calcula y asigna puntos
8. Backend actualiza saldo de puntos

### Subida de Canción
1. Usuario selecciona archivo MP3 y portada
2. App sube archivos a Firebase Storage
3. App envía metadata al backend
4. Backend guarda registro en BD
5. Canción queda en estado "pending"
6. Admin aprueba/rechaza desde panel web

### Redención de Puntos
1. Usuario navega catálogo
2. Usuario selecciona producto
3. App envía request de redención
4. Backend valida puntos suficientes
5. Backend crea registro en `redemptions`
6. Backend descuenta puntos
7. Admin procesa envío desde panel

## 🗄️ Base de Datos

### Tablas Principales
- **users**: Usuarios del sistema
- **songs**: Canciones
- **song_plays**: Reproducciones registradas
- **products**: Productos para canjear
- **redemptions**: Canjeos realizados
- **app_config**: Configuración de la app

### Relaciones
- users (1) -> (N) songs
- users (1) -> (N) song_plays
- songs (1) -> (N) song_plays
- users (1) -> (N) redemptions
- products (1) -> (N) redemptions

## 🔐 Seguridad

### Autenticación
- Firebase Auth para autenticación de usuarios
- Firebase Admin SDK para validar tokens en backend
- JWT tokens en cada request HTTP
- Guards de NestJS para proteger endpoints

### Autorización
- Roles: user, artist, admin
- Guards de roles en endpoints sensibles
- Validación de ownership (artista solo edita sus canciones)

### Validaciones
- DTOs con class-validator en NestJS
- Validación de archivos (tamaño, tipo)
- Rate limiting en endpoints críticos (recomendado)

## 🚀 Despliegue

### Backend
- Plataforma: Heroku, Railway, o AWS
- Base de datos: Heroku Postgres, AWS RDS, o Supabase
- Variables de entorno: DATABASE_URL, FIREBASE_CREDENTIALS

### Mobile App
- Expo EAS Build para iOS y Android
- App Stores: Apple App Store y Google Play Store

### Admin Panel
- Vercel, Netlify, o AWS Amplify
- Deploy automático desde Git

## 📝 Próximos Pasos

1. Configurar Firebase (Auth y Storage)
2. Crear base de datos PostgreSQL
3. Configurar variables de entorno
4. Desplegar backend
5. Desplegar admin panel
6. Build y subir app móvil a stores
7. Crear usuario admin
8. Configurar productos iniciales

