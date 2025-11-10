# Green Music Admin Panel

Panel de administración web construido con Next.js.

## Instalación

```bash
npm install
```

## Configuración

Configurar variables de entorno en `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Ejecutar

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## Despliegue

El panel admin está optimizado para desplegar en Vercel:

```bash
vercel
```

## Funcionalidades

- Login de administrador
- Dashboard con estadísticas
- Gestión de productos (CRUD)
- Gestión de usuarios y roles
- Aprobación de canciones
- Configuración de puntos por reproducción

## Rutas

- `/login` - Página de login
- `/dashboard` - Dashboard principal
- `/dashboard/products` - Gestión de productos
- `/dashboard/users` - Gestión de usuarios
- `/dashboard/songs` - Gestión de canciones
- `/dashboard/config` - Configuración

