# Green Music Mobile App

Aplicación móvil construida con React Native y Expo.

## Instalación

```bash
npm install
```

## Configuración

Configurar variables de entorno en un archivo `.env`:

```
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## Ejecutar

```bash
# Iniciar Expo
npm start

# Ejecutar en iOS
npm run ios

# Ejecutar en Android
npm run android
```

## Build

```bash
# Build para producción
expo build:android
expo build:ios
```

## Estructura

- `src/screens/` - Pantallas de la aplicación
- `src/components/` - Componentes reutilizables
- `src/services/` - Servicios API y Firebase
- `src/navigation/` - Configuración de navegación
- `src/context/` - Context providers (Auth)
- `src/types/` - Tipos TypeScript

## Funcionalidades

- Login/Registro con Firebase Auth
- Reproducción de audio con Expo AV
- Subida de canciones a Firebase Storage
- Sistema de puntos
- Catálogo de productos
- Perfil de usuario

