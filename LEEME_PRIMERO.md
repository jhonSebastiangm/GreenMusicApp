# 🎵 Green Music - ¡Listo para Probar!

## 🚀 Inicio Rápido (5 minutos)

### 1️⃣ Instalar Dependencias (YA HECHO ✅)
```bash
# Ya están instaladas, pero si necesitas reinstalar:
cd backend && npm install
cd ../admin && npm install  
cd ../mobile && npm install
```

### 2️⃣ Configurar Firebase (5 min)

**IMPORTANTE:** Necesitas crear un proyecto en Firebase primero.

1. Ve a https://console.firebase.google.com/
2. Crea un proyecto nuevo
3. Habilita **Authentication** (Email/Password)
4. Habilita **Storage**
5. Obtén las credenciales (ver `GUIA_INTEGRACION_COMPLETA.md` sección 1)

### 3️⃣ Configurar Base de Datos (2 min)

```bash
# Crear base de datos
createdb green_music

# Ejecutar script SQL
psql -U postgres -d green_music -f docs/MODELO_BD.sql

# Insertar datos de prueba
psql -U postgres -d green_music -f scripts/datos-prueba.sql
```

### 4️⃣ Editar Archivos .env

Edita estos archivos con tus credenciales:

- `backend/.env` - Firebase Admin SDK + PostgreSQL
- `admin/.env.local` - Firebase Web credentials
- `mobile/.env` - Firebase Web credentials + API URL

### 5️⃣ Crear Usuarios en Firebase

Crea estos usuarios en Firebase Auth:
- `admin@test.com` / `Admin123!`
- `user@test.com` / `User123!`
- `artist@test.com` / `Artist123!`

Luego actualiza los `firebase_uid` en la BD (ver `scripts/crear-usuarios-firebase.md`)

### 6️⃣ Iniciar Todo

**Windows:**
```powershell
.\scripts\start-all.ps1
```

**Manual (3 terminales):**
```bash
# Terminal 1
cd backend && npm run start:dev

# Terminal 2  
cd admin && npm run dev

# Terminal 3
cd mobile && npm start
```

---

## 📱 Probar en Celular

### Opción 1: Expo Go (Más Fácil)

1. Instala **Expo Go** en tu celular:
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

2. Asegúrate de estar en la misma WiFi que tu PC

3. Ejecuta `npm start` en `mobile/`

4. Escanea el QR code con Expo Go

### Opción 2: Generar APK

```bash
cd mobile
.\scripts\generar-apk.ps1
```

Sigue las instrucciones para generar el APK.

---

## 💻 Probar en Emulador

### Android

1. Instala [Android Studio](https://developer.android.com/studio)
2. Crea un emulador (AVD)
3. Ejecuta: `cd mobile && npm start`
4. Presiona `a` para Android

### iOS (Solo Mac)

```bash
cd mobile && npm start
# Presiona 'i' para iOS
```

---

## 🧪 Datos de Prueba

Ya están creados en `scripts/datos-prueba.sql`:

- ✅ 3 usuarios (admin, user, artist)
- ✅ 4 productos de recompensa
- ✅ Configuración de puntos (10 por reproducción)

**Usuarios:**
- `admin@test.com` / `Admin123!` (Admin)
- `user@test.com` / `User123!` (Usuario)
- `artist@test.com` / `Artist123!` (Artista)

**Productos:**
- 🎽 Camiseta EcoBeats (200 puntos)
- 🌳 Planta un Árbol (100 puntos)
- 🎫 Entrada a Concierto (500 puntos)
- 🥤 Copa Reutilizable (150 puntos)

---

## 📚 Documentación

- **`PRUEBA_RAPIDA.md`** - Guía rápida de prueba
- **`GUIA_INTEGRACION_COMPLETA.md`** - Guía detallada paso a paso
- **`QUICK_START.md`** - Inicio rápido original
- **`docs/INSTRUCCIONES_DESPLIEGUE.md`** - Para producción

---

## ✅ Checklist

Antes de probar, verifica:

- [ ] Firebase configurado (Auth + Storage)
- [ ] Base de datos PostgreSQL creada
- [ ] Script SQL ejecutado
- [ ] Archivos .env editados con credenciales
- [ ] Usuarios creados en Firebase Auth
- [ ] firebase_uid actualizados en BD
- [ ] Backend corriendo (puerto 3000)
- [ ] Admin corriendo (puerto 3001)
- [ ] Mobile iniciado (Expo)

---

## 🎯 Flujo de Prueba

1. **Inicia sesión** en admin panel con `admin@test.com`
2. **Crea productos** desde el admin
3. **Inicia sesión** en mobile app con `user@test.com`
4. **Sube una canción** desde mobile
5. **Aprueba la canción** desde admin
6. **Reproduce la canción** en mobile
7. **Verifica puntos** ganados
8. **Canjea un producto**

---

## 🐛 Problemas?

Ver sección **Troubleshooting** en `PRUEBA_RAPIDA.md` o `GUIA_INTEGRACION_COMPLETA.md`

---

## 🎉 ¡Listo!

Todo está configurado. Solo necesitas:
1. Configurar Firebase (5 min)
2. Configurar PostgreSQL (2 min)
3. Editar archivos .env (2 min)
4. Crear usuarios en Firebase (2 min)
5. ¡Probar!

**Total: ~15 minutos para tener todo funcionando**

---

## 📞 ¿Necesitas Ayuda?

1. Lee `GUIA_INTEGRACION_COMPLETA.md` para detalles
2. Revisa `PRUEBA_RAPIDA.md` para problemas comunes
3. Verifica los logs de cada servicio

¡Disfruta probando Green Music! 🎵🌱

