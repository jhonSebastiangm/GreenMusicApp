# Green Music Backend API

API REST construida con NestJS para Green Music.

## Instalación

```bash
npm install
```

## Configuración

Copiar `.env.example` a `.env` y configurar las variables de entorno:

```bash
cp .env.example .env
```

## Ejecutar

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Endpoints

### Auth
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrarse
- `GET /auth/me` - Obtener usuario actual

### Songs
- `GET /songs` - Listar canciones
- `GET /songs/:id` - Obtener canción
- `POST /songs` - Crear canción
- `PATCH /songs/:id` - Actualizar canción
- `DELETE /songs/:id` - Eliminar canción
- `POST /song-plays/songs/:id/play-complete` - Registrar reproducción completa

### Users
- `GET /users/me` - Obtener perfil
- `GET /users/me/points` - Obtener puntos
- `GET /users/me/history` - Obtener historial
- `GET /users` - Listar usuarios (admin)
- `PUT /users/:id` - Actualizar usuario (admin)

### Products
- `GET /products` - Listar productos
- `GET /products/:id` - Obtener producto
- `POST /products` - Crear producto (admin)
- `PATCH /products/:id` - Actualizar producto (admin)
- `DELETE /products/:id` - Eliminar producto (admin)

### Redemptions
- `POST /redemptions` - Crear redención
- `GET /redemptions/my-redemptions` - Mis redenciones
- `GET /redemptions` - Listar redenciones (admin)

### Config
- `GET /config/points-per-play` - Obtener puntos por reproducción
- `PUT /config/points-per-play` - Actualizar puntos (admin)

## Autenticación

Todos los endpoints (excepto login/register) requieren un token de Firebase Auth en el header:

```
Authorization: Bearer <token>
```

## Base de Datos

La aplicación usa TypeORM con PostgreSQL. En desarrollo, `synchronize: true` está habilitado para crear las tablas automáticamente.

En producción, usar migraciones:

```bash
npm run migration:generate -- -n MigrationName
npm run migration:run
```
