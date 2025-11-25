# 🚀 Instrucciones de Ejecución - Green Music

## ⚡ Inicio Rápido (1 Click)

### Opción 1: Doble Click (Windows)
1. **Doble click en:** `EJECUTAR_AQUI.bat`
2. ¡Listo! Se abrirán 3 ventanas con los servicios

### Opción 2: PowerShell
```powershell
.\EJECUTAR_AQUI.ps1
```

### Opción 3: Script Directo
```powershell
.\scripts\iniciar-todo.ps1
```

---

## 📋 Lo que se Inicia Automáticamente

1. **Backend (NestJS)**
   - Puerto: `3000`
   - URL: `http://localhost:3000`
   - Ventana: PowerShell con logs

2. **Admin Panel (Next.js)**
   - Puerto: `3001`
   - URL: `http://localhost:3001`
   - Ventana: PowerShell con logs

3. **Mobile App (Expo)**
   - Puerto: `8081`
   - Abre: Expo DevTools en navegador
   - Ventana: PowerShell con QR code

---

## ⚙️ Configuración Necesaria (Primera Vez)

### 1. Firebase (5 minutos)

1. Ve a https://console.firebase.google.com/
2. Crea proyecto: `green-music-project`
3. Habilita **Authentication** (Email/Password)
4. Habilita **Storage**
5. Obtén credenciales:
   - **Para Backend:** Firebase Console > Configuración > Cuentas de servicio > Generar nueva clave
   - **Para Admin/Mobile:** Firebase Console > Configuración > Tus aplicaciones > Web app

6. Edita los archivos `.env`:
   - `backend/.env` - Agrega Firebase Admin SDK credentials
   - `admin/.env.local` - Agrega Firebase Web credentials
   - `mobile/.env` - Agrega Firebase Web credentials

### 2. PostgreSQL (2 minutos)

```bash
# Crear base de datos
createdb green_music

# Ejecutar script SQL
psql -U postgres -d green_music -f docs/MODELO_BD.sql

# Insertar datos de prueba (opcional)
psql -U postgres -d green_music -f scripts/datos-prueba.sql
```

### 3. Editar .env

Edita estos archivos con tus credenciales:

**backend/.env:**
```env
DATABASE_PASSWORD=tu_contraseña_postgres
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=tu-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="tu-clave-privada"
```

**admin/.env.local y mobile/.env:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
# ... resto de credenciales
```

---

## 🎯 Después de Configurar

1. **Ejecuta:** `EJECUTAR_AQUI.bat` o `.\EJECUTAR_AQUI.ps1`
2. **Espera** a que se abran las 3 ventanas
3. **Abre en navegador:**
   - Admin: `http://localhost:3001`
   - Backend API: `http://localhost:3000/config/points-per-play`
4. **En móvil:**
   - Instala Expo Go
   - Escanea QR code de la ventana de Mobile

---

## 🐛 Si Algo No Funciona

### Backend no inicia
- Verifica `backend/.env` tiene credenciales correctas
- Verifica PostgreSQL está corriendo
- Revisa la ventana del Backend para errores

### Admin no inicia
- Verifica `admin/.env.local` tiene credenciales correctas
- Revisa la ventana del Admin para errores

### Mobile no carga
- Verifica `mobile/.env` tiene credenciales correctas
- Verifica que el backend esté corriendo
- Revisa la ventana de Mobile para errores

### Ver logs
```powershell
.\scripts\revisar-logs.ps1
```

---

## 📱 Probar en Celular

1. Instala **Expo Go**:
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. Asegúrate de estar en la **misma WiFi** que tu PC

3. Escanea el **QR code** que aparece en la ventana de Mobile

4. Si no funciona, cambia en `mobile/.env`:
   ```
   EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:3000
   ```
   (Obtén tu IP con `ipconfig`)

---

## ✅ Checklist

Antes de ejecutar, verifica:

- [ ] Firebase configurado (Auth + Storage)
- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `green_music` creada
- [ ] Script SQL ejecutado
- [ ] Archivos `.env` editados con credenciales reales
- [ ] Node.js 18+ instalado

---

## 🎉 ¡Listo!

Con estos pasos, solo necesitas:
1. Configurar Firebase y PostgreSQL (una vez)
2. Editar archivos `.env` (una vez)
3. Ejecutar `EJECUTAR_AQUI.bat` (cada vez que quieras probar)

¡Disfruta probando Green Music! 🎵🌱

