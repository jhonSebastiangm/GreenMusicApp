# Instrucciones de Despliegue - Green Music

## Prerequisitos

1. Cuenta en Firebase (para Auth y Storage)
2. Base de datos PostgreSQL (Heroku Postgres, AWS RDS, o Supabase)
3. Cuenta en Vercel/Netlify (para Admin Panel)
4. Cuenta en Expo (para Mobile App)

## 1. Configuración de Firebase

### 1.1 Crear Proyecto Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear un nuevo proyecto
3. Habilitar Authentication (Email/Password)
4. Habilitar Storage
5. Configurar reglas de Storage:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /songs/{songId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /covers/{coverId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 1.2 Obtener Credenciales

1. Ir a Project Settings > Service Accounts
2. Generar nueva clave privada (para backend)
3. Copiar las credenciales del proyecto (para frontend)

## 2. Configuración de Base de Datos PostgreSQL

### 2.1 Crear Base de Datos

```sql
CREATE DATABASE green_music;
```

### 2.2 Ejecutar Script SQL

```bash
psql -U postgres -d green_music -f docs/MODELO_BD.sql
```

### 2.3 Opciones de Hosting

**Opción 1: Heroku Postgres**
- Crear app en Heroku
- Agregar addon Heroku Postgres
- Obtener DATABASE_URL

**Opción 2: AWS RDS**
- Crear instancia RDS PostgreSQL
- Configurar seguridad (VPC, Security Groups)
- Obtener endpoint y credenciales

**Opción 3: Supabase**
- Crear proyecto en Supabase
- Obtener connection string
- Ejecutar script SQL en SQL Editor

## 3. Despliegue del Backend (NestJS)

### 3.1 Preparar Backend

```bash
cd backend
npm install
npm run build
```

### 3.2 Configurar Variables de Entorno

Crear archivo `.env` en producción:

```env
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USER=your-db-user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=green_music

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"

PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-admin-domain.com,https://your-mobile-app.com
```

### 3.3 Opciones de Despliegue

**Opción 1: Heroku**

```bash
heroku create green-music-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set FIREBASE_PROJECT_ID=...
heroku config:set FIREBASE_CLIENT_EMAIL=...
heroku config:set FIREBASE_PRIVATE_KEY="..."
git push heroku main
```

**Opción 2: Railway**

1. Conectar repositorio en Railway
2. Configurar variables de entorno
3. Deploy automático

**Opción 3: AWS EC2**

1. Crear instancia EC2
2. Instalar Node.js y PostgreSQL client
3. Clonar repositorio
4. Configurar PM2 para proceso
5. Configurar Nginx como reverse proxy

## 4. Despliegue del Admin Panel (Next.js)

### 4.1 Configurar Variables de Entorno

En Vercel/Netlify, configurar:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 4.2 Desplegar en Vercel

```bash
cd admin
npm install
vercel
```

O conectar repositorio en Vercel para deploy automático.

### 4.3 Configurar Dominio

1. Agregar dominio personalizado en Vercel
2. Configurar DNS
3. Actualizar CORS en backend con nuevo dominio

## 5. Despliegue de Mobile App (React Native + Expo)

### 5.1 Configurar Variables de Entorno

Crear archivo `app.config.js`:

```javascript
export default {
  expo: {
    name: "Green Music",
    slug: "green-music",
    version: "1.0.0",
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    },
  },
};
```

### 5.2 Build para Producción

**iOS:**

```bash
expo build:ios
```

O usar EAS Build:

```bash
eas build --platform ios
```

**Android:**

```bash
expo build:android
```

O usar EAS Build:

```bash
eas build --platform android
```

### 5.3 Subir a App Stores

**Apple App Store:**
1. Crear app en App Store Connect
2. Subir build con Transporter
3. Configurar metadata y screenshots
4. Enviar para revisión

**Google Play Store:**
1. Crear app en Google Play Console
2. Subir APK/AAB
3. Configurar listing
4. Enviar para revisión

## 6. Configuración Post-Despliegue

### 6.1 Crear Usuario Admin

1. Registrarse en la app móvil
2. En la base de datos, actualizar rol del usuario:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### 6.2 Configurar Puntos Iniciales

1. Iniciar sesión en Admin Panel
2. Ir a Configuración
3. Establecer puntos por reproducción

### 6.3 Configurar Productos Iniciales

1. Iniciar sesión en Admin Panel
2. Ir a Productos
3. Agregar productos de recompensa

## 7. Monitoreo y Mantenimiento

### 7.1 Logs

- Backend: Revisar logs en plataforma de hosting
- Admin: Revisar logs en Vercel
- Mobile: Revisar crashes en Firebase Crashlytics

### 7.2 Base de Datos

- Configurar backups automáticos
- Monitorear uso de espacio
- Optimizar queries lentas

### 7.3 Seguridad

- Rotar credenciales regularmente
- Monitorear acceso no autorizado
- Actualizar dependencias
- Configurar rate limiting

## 8. Costos Estimados

### Desarrollo
- Firebase: Gratis (Spark plan)
- PostgreSQL: Gratis (Supabase free tier) o $7/mes (Heroku)
- Backend: Gratis (Heroku hobby) o $5/mes (Railway)
- Admin: Gratis (Vercel)
- Total: $0-12/mes

### Producción
- Firebase: $25-100/mes (Blaze plan, pago por uso)
- PostgreSQL: $15-50/mes (dependiendo del tamaño)
- Backend: $25-100/mes (dependiendo del tráfico)
- Admin: Gratis (Vercel)
- App Stores: $99/año (Apple) + $25 una vez (Google)
- Total: $65-275/mes + fees de app stores

## 9. Troubleshooting

### Error de CORS
- Verificar CORS_ORIGIN en backend
- Incluir todos los dominios necesarios

### Error de Autenticación
- Verificar credenciales de Firebase
- Verificar que el usuario tenga rol admin

### Error de Base de Datos
- Verificar conexión a PostgreSQL
- Verificar que las tablas existan
- Verificar credenciales

### Error de Storage
- Verificar reglas de Firebase Storage
- Verificar permisos de autenticación
- Verificar límites de cuota

