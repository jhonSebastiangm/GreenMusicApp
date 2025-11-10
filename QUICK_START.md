# Quick Start - Green Music

Guía rápida para ejecutar el proyecto localmente.

## Prerequisitos

- Node.js 18+ instalado
- PostgreSQL instalado y corriendo
- Cuenta de Firebase configurada
- Expo CLI instalado (`npm install -g expo-cli`)

## 1. Clonar y Configurar

```bash
# Clonar repositorio
git clone <repository-url>
cd green-music
```

## 2. Configurar Base de Datos

```bash
# Crear base de datos
createdb green_music

# Ejecutar script SQL
psql -U postgres -d green_music -f docs/MODELO_BD.sql
```

## 3. Configurar Backend

```bash
cd backend
npm install

# Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar en desarrollo
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`

## 4. Configurar Mobile App

```bash
cd mobile
npm install

# Configurar variables de entorno en app.config.js
# O crear archivo .env con:
# EXPO_PUBLIC_API_URL=http://localhost:3000
# EXPO_PUBLIC_FIREBASE_API_KEY=...
# (resto de variables de Firebase)

# Ejecutar
npm start
```

Abrir en emulador o dispositivo físico con Expo Go.

## 5. Configurar Admin Panel

```bash
cd admin
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar
npm run dev
```

El admin panel estará disponible en `http://localhost:3001`

## 6. Configurar Firebase

1. Crear proyecto en Firebase Console
2. Habilitar Authentication (Email/Password)
3. Habilitar Storage
4. Configurar reglas de Storage (ver `docs/INSTRUCCIONES_DESPLIEGUE.md`)
5. Obtener credenciales y configurar en:
   - Backend: `.env`
   - Mobile: `app.config.js` o `.env`
   - Admin: `.env.local`

## 7. Crear Usuario Admin

1. Registrarse en la app móvil
2. En PostgreSQL, ejecutar:

```sql
UPDATE users SET role = 'admin' WHERE email = 'tu-email@example.com';
```

3. Iniciar sesión en el admin panel con ese usuario

## 8. Probar la Aplicación

### Mobile App
1. Abrir app en Expo Go
2. Registrarse o iniciar sesión
3. Explorar canciones
4. Reproducir una canción
5. Ver puntos ganados
6. Subir una canción
7. Ver catálogo de productos

### Admin Panel
1. Iniciar sesión como admin
2. Ver dashboard
3. Gestionar productos
4. Aprobar canciones pendientes
5. Gestionar usuarios
6. Configurar puntos por reproducción

## Troubleshooting

### Error de CORS
- Verificar `CORS_ORIGIN` en backend `.env`
- Incluir `http://localhost:19006` (Expo) y `http://localhost:3001` (Admin)

### Error de Base de Datos
- Verificar que PostgreSQL esté corriendo
- Verificar credenciales en `.env`
- Verificar que las tablas existan

### Error de Firebase
- Verificar credenciales en todos los proyectos
- Verificar que Authentication esté habilitado
- Verificar que Storage esté habilitado
- Verificar reglas de Storage

### Error de Autenticación
- Verificar que el usuario exista en Firebase
- Verificar que el token sea válido
- Verificar logs del backend

## Comandos Útiles

### Backend
```bash
npm run start:dev    # Desarrollo
npm run build        # Build
npm run start:prod   # Producción
npm run lint         # Linter
```

### Mobile
```bash
npm start            # Iniciar Expo
npm run ios          # iOS
npm run android      # Android
```

### Admin
```bash
npm run dev          # Desarrollo
npm run build        # Build
npm start            # Producción
npm run lint         # Linter
```

## Siguiente Paso

Una vez que todo funcione localmente, seguir las instrucciones en `docs/INSTRUCCIONES_DESPLIEGUE.md` para desplegar en producción.

