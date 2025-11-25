# 🚀 Prueba Rápida - Green Music

Guía para probar la aplicación en 5 minutos.

## ⚡ Inicio Rápido

### Opción 1: Todo Automático (Windows)

```powershell
# Desde la raíz del proyecto
.\scripts\start-all.ps1
```

Esto iniciará:
- ✅ Backend en `http://localhost:3000`
- ✅ Admin Panel en `http://localhost:3001`
- ✅ Mobile App (Expo DevTools)

### Opción 2: Manual

Abre 3 terminales:

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Admin:**
```bash
cd admin
npm run dev
```

**Terminal 3 - Mobile:**
```bash
cd mobile
npm start
```

---

## 📱 Probar en Celular (Recomendado)

### Paso 1: Instalar Expo Go

- **Android:** [Play Store - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS:** [App Store - Expo Go](https://apps.apple.com/app/expo-go/id982107779)

### Paso 2: Conectar

1. Asegúrate de que tu celular esté en la **misma red WiFi** que tu PC
2. Ejecuta `npm start` en la carpeta `mobile/`
3. Escanea el **QR code** con Expo Go (Android) o Cámara (iOS)

### Paso 3: Probar

Usa estos usuarios de prueba (crea primero en Firebase Auth):

```
Email: admin@test.com
Password: Admin123!
Rol: Admin

Email: user@test.com
Password: User123!
Rol: Usuario

Email: artist@test.com
Password: Artist123!
Rol: Artista
```

---

## 💻 Probar en Emulador

### Android Emulator

1. **Instalar Android Studio:**
   - Descarga: https://developer.android.com/studio
   - Instala Android SDK y Emulator

2. **Crear Emulador:**
   - Abre Android Studio
   - Tools > Device Manager
   - Create Device
   - Elige un dispositivo (ej: Pixel 5)
   - Descarga una imagen del sistema (ej: API 33)

3. **Iniciar:**
   ```bash
   cd mobile
   npm start
   # Presiona 'a' para Android
   ```

### iOS Simulator (Solo Mac)

```bash
cd mobile
npm start
# Presiona 'i' para iOS
```

---

## 📦 Generar APK para Instalar

### Método 1: EAS Build (Recomendado)

```bash
cd mobile

# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar
eas build:configure

# Generar APK
eas build -p android --profile preview
```

El APK se generará en la nube y recibirás un link para descargarlo.

### Método 2: Script Automático

```powershell
cd mobile
.\scripts\generar-apk.ps1
```

---

## 🧪 Datos de Prueba

### Crear Usuarios en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Authentication > Users
3. Add User para cada uno:

**Admin:**
- Email: `admin@test.com`
- Password: `Admin123!`

**Usuario:**
- Email: `user@test.com`
- Password: `User123!`

**Artista:**
- Email: `artist@test.com`
- Password: `Artist123!`

### Insertar Datos en Base de Datos

```bash
# Ejecutar script de datos de prueba
psql -U postgres -d green_music -f scripts/datos-prueba.sql
```

**Nota:** Después de crear los usuarios en Firebase, actualiza los `firebase_uid` en la base de datos:

```sql
-- Obtener el UID de Firebase Console y actualizar:
UPDATE users 
SET firebase_uid = 'TU_UID_DE_FIREBASE' 
WHERE email = 'admin@test.com';
```

### Productos de Prueba

Ya están creados en el script:
- 🎽 Camiseta EcoBeats (200 puntos)
- 🌳 Planta un Árbol (100 puntos)
- 🎫 Entrada a Concierto (500 puntos)
- 🥤 Copa Reutilizable (150 puntos)

---

## ✅ Checklist de Prueba

### Backend
- [ ] Backend corriendo en `http://localhost:3000`
- [ ] Puedo acceder a `http://localhost:3000/config/points-per-play`

### Admin Panel
- [ ] Admin corriendo en `http://localhost:3001`
- [ ] Puedo iniciar sesión con `admin@test.com`
- [ ] Veo el dashboard
- [ ] Puedo crear/editar productos
- [ ] Puedo aprobar canciones

### Mobile App
- [ ] App se abre en Expo Go o emulador
- [ ] Puedo registrarme
- [ ] Puedo iniciar sesión
- [ ] Veo la pantalla Home
- [ ] Puedo subir una canción
- [ ] Puedo reproducir canciones
- [ ] Los puntos se asignan correctamente
- [ ] Puedo ver el catálogo
- [ ] Puedo canjear productos

---

## 🎯 Flujo de Prueba Completo

1. **Crear Usuario Admin en Firebase**
   - Email: `admin@test.com`
   - Password: `Admin123!`

2. **Insertar Datos de Prueba**
   ```bash
   psql -U postgres -d green_music -f scripts/datos-prueba.sql
   ```

3. **Actualizar firebase_uid en BD**
   - Obtén el UID de Firebase Console
   - Actualiza en PostgreSQL

4. **Iniciar Servicios**
   ```powershell
   .\scripts\start-all.ps1
   ```

5. **Probar Admin Panel**
   - Abre `http://localhost:3001`
   - Login con `admin@test.com`
   - Crea productos
   - Configura puntos

6. **Probar Mobile App**
   - Abre en Expo Go o emulador
   - Registra un usuario nuevo
   - Sube una canción
   - En admin, aprueba la canción
   - En mobile, reproduce la canción
   - Verifica que ganaste puntos
   - Canjea un producto

---

## 🐛 Problemas Comunes

### "Network request failed" en Mobile

**Solución:**
- Verifica que el backend esté corriendo
- Si usas dispositivo físico, cambia la URL en `mobile/.env`:
  ```
  EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000
  ```
  Para obtener tu IP: `ipconfig` (Windows) o `ifconfig` (Mac/Linux)

### "CORS policy" error

**Solución:**
- Verifica `CORS_ORIGIN` en `backend/.env`
- Debe incluir: `http://localhost:19006,http://localhost:3001`

### Emulador no detecta la app

**Solución:**
- Verifica que el emulador esté corriendo
- Ejecuta: `adb devices` para ver dispositivos conectados
- Reinicia Expo: `npm start -- --clear`

### No puedo iniciar sesión

**Solución:**
- Verifica que el usuario exista en Firebase Auth
- Verifica que el `firebase_uid` en BD coincida con Firebase
- Revisa los logs del backend para errores

---

## 📞 Soporte

Si tienes problemas:
1. Revisa `GUIA_INTEGRACION_COMPLETA.md` para configuración detallada
2. Revisa la sección Troubleshooting
3. Verifica los logs de cada servicio

---

## 🎉 ¡Listo para Probar!

Con estos pasos deberías tener todo funcionando. ¡Disfruta probando Green Music! 🎵

