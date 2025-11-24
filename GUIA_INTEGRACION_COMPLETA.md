# Guía Completa de Integración - Green Music

Esta guía te llevará paso a paso para configurar y probar toda la aplicación.

## 📋 Índice

1. [Prerequisitos](#prerequisitos)
2. [Configurar Firebase](#1-configurar-firebase)
3. [Configurar Base de Datos PostgreSQL](#2-configurar-base-de-datos-postgresql)
4. [Configurar Backend (NestJS)](#3-configurar-backend-nestjs)
5. [Configurar Admin Panel (Next.js)](#4-configurar-admin-panel-nextjs)
6. [Configurar App Móvil (React Native + Expo)](#5-configurar-app-móvil-react-native--expo)
7. [Probar la Aplicación](#6-probar-la-aplicación)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Node.js 18+** ([Descargar](https://nodejs.org/))
- ✅ **PostgreSQL 14+** ([Descargar](https://www.postgresql.org/download/))
- ✅ **Git** ([Descargar](https://git-scm.com/))
- ✅ **Cuenta de Google** (para Firebase)
- ✅ **Expo CLI** (opcional, se instala con npm)

Verificar instalaciones:
```bash
node --version    # Debe ser 18 o superior
npm --version
psql --version
git --version
```

---

## 1. Configurar Firebase

### Paso 1.1: Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en **"Agregar proyecto"** o **"Create a project"**
3. Nombre del proyecto: `green-music` (o el que prefieras)
4. Desactiva Google Analytics (opcional, puedes activarlo después)
5. Click en **"Crear proyecto"**

### Paso 1.2: Habilitar Authentication

1. En el menú lateral, ve a **"Authentication"**
2. Click en **"Comenzar"** o **"Get started"**
3. Ve a la pestaña **"Sign-in method"**
4. Click en **"Email/Password"**
5. Activa el primer toggle (Email/Password)
6. Click en **"Guardar"**

### Paso 1.3: Habilitar Storage

1. En el menú lateral, ve a **"Storage"**
2. Click en **"Comenzar"** o **"Get started"**
3. Selecciona **"Start in test mode"** (por ahora)
4. Selecciona la ubicación del Storage (elige la más cercana)
5. Click en **"Listo"**

### Paso 1.4: Configurar Reglas de Storage

1. En Storage, ve a la pestaña **"Rules"**
2. Reemplaza las reglas con:

```javascript
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

3. Click en **"Publicar"**

### Paso 1.5: Obtener Credenciales para Backend

1. Ve a **Configuración del proyecto** (ícono de engranaje)
2. Ve a la pestaña **"Cuentas de servicio"**
3. Click en **"Generar nueva clave privada"**
4. Se descargará un archivo JSON - **GUÁRDALO SEGURO**, lo necesitarás
5. Abre el archivo JSON y copia:
   - `project_id`
   - `client_email`
   - `private_key` (toda la cadena, incluyendo `\n`)

### Paso 1.6: Obtener Credenciales para Frontend (Mobile y Admin)

1. En **Configuración del proyecto**, ve a **"Tus aplicaciones"**
2. Click en el ícono **`</>`** (Web)
3. Registra la app con nombre: `Green Music Web`
4. Copia las credenciales que aparecen (las necesitarás):
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

**Nota:** Si ya tienes una app web, puedes usar esas credenciales.

---

## 2. Configurar Base de Datos PostgreSQL

### Paso 2.1: Crear Base de Datos

Abre una terminal y ejecuta:

```bash
# Windows (si PostgreSQL está en el PATH)
psql -U postgres

# O usando pgAdmin o cualquier cliente PostgreSQL
```

Dentro de psql, ejecuta:

```sql
CREATE DATABASE green_music;
\q
```

### Paso 2.2: Ejecutar Script SQL

```bash
# Desde la raíz del proyecto
psql -U postgres -d green_music -f docs/MODELO_BD.sql
```

Si te pide contraseña, ingrésala.

**Verificar que funcionó:**
```bash
psql -U postgres -d green_music -c "\dt"
```

Deberías ver las tablas: `users`, `songs`, `products`, `song_plays`, `redemptions`, `app_config`

---

## 3. Configurar Backend (NestJS)

### Paso 3.1: Instalar Dependencias

```bash
cd backend
npm install
```

### Paso 3.2: Crear Archivo .env

Crea un archivo `.env` en la carpeta `backend/` con este contenido:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=tu_contraseña_postgres
DATABASE_NAME=green_music

# Firebase (del archivo JSON que descargaste)
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu-clave-privada-completa\n-----END PRIVATE KEY-----\n"

# Server
PORT=3000
NODE_ENV=development

# CORS (permite conexiones desde mobile y admin)
CORS_ORIGIN=http://localhost:19006,http://localhost:3001,http://localhost:8081
```

**Importante:**
- Reemplaza `tu_contraseña_postgres` con tu contraseña de PostgreSQL
- Reemplaza los valores de Firebase con los que obtuviste
- El `FIREBASE_PRIVATE_KEY` debe estar entre comillas y mantener los `\n`

### Paso 3.3: Probar Backend

```bash
npm run start:dev
```

Deberías ver:
```
Application is running on: http://localhost:3000
```

**Probar que funciona:**
Abre tu navegador en: `http://localhost:3000` (debería dar error 404, pero significa que el servidor está corriendo)

O prueba con:
```bash
curl http://localhost:3000/config/points-per-play
```

---

## 4. Configurar Admin Panel (Next.js)

### Paso 4.1: Instalar Dependencias

```bash
cd ../admin
npm install
```

### Paso 4.2: Crear Archivo .env.local

Crea un archivo `.env.local` en la carpeta `admin/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

Reemplaza todos los valores con las credenciales que obtuviste en el Paso 1.6.

### Paso 4.3: Probar Admin Panel

```bash
npm run dev
```

Deberías ver:
```
- ready started server on 0.0.0.0:3001
```

Abre tu navegador en: `http://localhost:3001`

---

## 5. Configurar App Móvil (React Native + Expo)

### Paso 5.1: Instalar Dependencias

```bash
cd ../mobile
npm install
```

### Paso 5.2: Instalar Expo CLI (si no lo tienes)

```bash
npm install -g expo-cli
# O usar: npx expo-cli
```

### Paso 5.3: Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `mobile/`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=tu-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

**Nota:** Para probar en dispositivo físico o emulador Android, cambia:
- Android Emulator: `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`
- iOS Simulator: `EXPO_PUBLIC_API_URL=http://localhost:3000`
- Dispositivo físico: `EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000` (ej: `http://192.168.1.100:3000`)

### Paso 5.4: Actualizar app.config.js

Edita `mobile/app.config.js` para usar las variables de entorno:

```javascript
export default {
  expo: {
    name: "Green Music",
    slug: "green-music",
    version: "1.0.0",
    // ... resto de la configuración
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
    }
  }
};
```

### Paso 5.5: Probar App Móvil

```bash
npm start
```

Esto abrirá Expo DevTools. Tienes opciones:

1. **Escanear QR con Expo Go** (app en tu teléfono)
2. **Presionar `a`** para abrir en Android Emulator
3. **Presionar `i`** para abrir en iOS Simulator
4. **Presionar `w`** para abrir en navegador web

---

## 6. Probar la Aplicación

### Paso 6.1: Crear Usuario Admin

1. **Abre la app móvil** (Expo Go o emulador)
2. **Regístrate** con un email (ej: `admin@test.com`)
3. **Obtén tu email** del registro

4. **En PostgreSQL**, ejecuta:

```sql
psql -U postgres -d green_music

UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';

\q
```

### Paso 6.2: Probar Admin Panel

1. Abre `http://localhost:3001`
2. Inicia sesión con el email que registraste
3. Deberías ver el Dashboard
4. Ve a **"Configuración"** y establece puntos por reproducción (ej: 10)
5. Ve a **"Productos"** y crea algunos productos de prueba

### Paso 6.3: Probar App Móvil

1. En la app móvil, inicia sesión
2. Ve a **"Home"** - deberías ver la lista de canciones (vacía por ahora)
3. Ve a **"Subir"** y sube una canción de prueba
4. Ve al **Admin Panel** → **"Canciones"** → Aprueba la canción (cambia estado a "Activa")
5. Vuelve a la app → **"Home"** → Deberías ver tu canción
6. Reproduce la canción completa
7. Ve a **"Perfil"** → Deberías ver puntos ganados
8. Ve a **"Catálogo"** → Deberías ver los productos que creaste
9. Canjea un producto

---

## Troubleshooting

### Error: "Cannot connect to database"

**Solución:**
- Verifica que PostgreSQL esté corriendo
- Verifica credenciales en `.env`
- Verifica que la base de datos `green_music` exista

```bash
# Verificar PostgreSQL
psql -U postgres -c "SELECT version();"
```

### Error: "Firebase: Error (auth/invalid-api-key)"

**Solución:**
- Verifica que las credenciales de Firebase estén correctas
- Verifica que Authentication esté habilitado en Firebase Console
- Verifica que no haya espacios extra en las variables de entorno

### Error: "CORS policy"

**Solución:**
- Verifica `CORS_ORIGIN` en `backend/.env`
- Debe incluir todas las URLs desde donde accedes:
  - `http://localhost:19006` (Expo)
  - `http://localhost:3001` (Admin)
  - `http://localhost:8081` (Expo alternativo)

### Error: "Network request failed" en Mobile

**Solución:**
- Si usas emulador Android: `http://10.0.2.2:3000`
- Si usas iOS Simulator: `http://localhost:3000`
- Si usas dispositivo físico: `http://TU_IP_LOCAL:3000`
- Verifica que el backend esté corriendo
- Verifica que el dispositivo/emulador esté en la misma red

### Error: "Storage permission denied"

**Solución:**
- Verifica las reglas de Storage en Firebase Console
- Asegúrate de que el usuario esté autenticado
- Verifica que las reglas estén publicadas

### Error: "User not found" al iniciar sesión

**Solución:**
- El usuario se crea automáticamente en la BD al registrarse
- Verifica que el registro se haya completado
- Revisa los logs del backend para ver errores

### El backend no inicia

**Solución:**
```bash
# Verificar que el puerto 3000 no esté en uso
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Verificar logs
cd backend
npm run start:dev
# Revisa los errores en la consola
```

### La app móvil no se conecta al backend

**Solución:**
1. Verifica que el backend esté corriendo
2. Verifica la URL en `.env` de mobile
3. Prueba hacer una petición manual:
```bash
curl http://localhost:3000/config/points-per-play
```

---

## ✅ Checklist de Verificación

Marca cada paso cuando lo completes:

- [ ] Firebase configurado (Auth + Storage)
- [ ] Base de datos PostgreSQL creada y script ejecutado
- [ ] Backend corriendo en `http://localhost:3000`
- [ ] Admin Panel corriendo en `http://localhost:3001`
- [ ] App móvil corriendo en Expo
- [ ] Usuario admin creado
- [ ] Puedo iniciar sesión en admin panel
- [ ] Puedo iniciar sesión en app móvil
- [ ] Puedo crear productos en admin
- [ ] Puedo subir canciones desde la app
- [ ] Puedo aprobar canciones en admin
- [ ] Puedo reproducir canciones en la app
- [ ] Los puntos se asignan correctamente
- [ ] Puedo canjear productos

---

## 🎉 ¡Listo!

Si completaste todos los pasos, tu aplicación está funcionando. Ahora puedes:

- Agregar más productos desde el admin
- Subir más canciones
- Invitar usuarios a probar la app
- Personalizar la configuración

Para desplegar en producción, sigue las instrucciones en `docs/INSTRUCCIONES_DESPLIEGUE.md`.

