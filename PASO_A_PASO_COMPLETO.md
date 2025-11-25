# 📋 PASO A PASO COMPLETO - Green Music

## ✅ PASO 1: Ejecutar los Servicios (YA HECHO)

Acabas de ejecutar el script. Deberías ver **3 ventanas de PowerShell** abiertas:

1. **Ventana 1:** Backend (NestJS) - Puerto 3000
2. **Ventana 2:** Admin Panel (Next.js) - Puerto 3001
3. **Ventana 3:** Mobile App (Expo) - Con QR code

---

## 🔍 PASO 2: Verificar que Todo Esté Corriendo

### En las Ventanas de PowerShell:

**Ventana Backend debería mostrar:**
```
[Nest] Starting...
Application is running on: http://localhost:3000
```

**Ventana Admin debería mostrar:**
```
- ready started server on 0.0.0.0:3001
```

**Ventana Mobile debería mostrar:**
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go
```

### Si hay errores:
- **Backend:** Busca errores de PostgreSQL o Firebase
- **Admin:** Busca errores de compilación
- **Mobile:** Busca errores de conexión

---

## 🌐 PASO 3: Probar en el Navegador

### Probar Admin Panel:

1. Abre tu navegador (Chrome, Edge, Firefox)
2. Ve a esta dirección: **`http://localhost:3001`**
3. Deberías ver la pantalla de **Login**

### Probar Backend API:

1. Abre: **`http://localhost:3000/config/points-per-play`**
2. Deberías ver: `{"points_per_play": 10}`

---

## 📱 PASO 4: Probar en el Celular (Opcional)

### Si quieres probar la app móvil:

1. **Instala Expo Go:**
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

2. **Abre Expo Go** en tu celular

3. **Escanea el QR code** que aparece en la **Ventana 3** (Mobile App)

4. **Asegúrate** de estar en la **misma WiFi** que tu PC

5. La app debería cargar en tu celular

---

## ⚙️ PASO 5: Configuración Inicial (Solo Primera Vez)

### Para que TODO funcione completamente, necesitas:

#### 5.1 Configurar Firebase (5 minutos)

1. Ve a: https://console.firebase.google.com/
2. Click en **"Agregar proyecto"** o **"Create a project"**
3. Nombre: `green-music` (o el que prefieras)
4. Click en **"Crear proyecto"**

5. **Habilitar Authentication:**
   - Menú lateral → **Authentication**
   - Click **"Comenzar"**
   - Pestaña **"Sign-in method"**
   - Click en **"Email/Password"**
   - Activa el toggle
   - Click **"Guardar"**

6. **Habilitar Storage:**
   - Menú lateral → **Storage**
   - Click **"Comenzar"**
   - Selecciona **"Start in test mode"**
   - Selecciona ubicación
   - Click **"Listo"**

7. **Obtener Credenciales:**

   **Para Backend:**
   - Configuración del proyecto → **Cuentas de servicio**
   - Click **"Generar nueva clave privada"**
   - Se descarga un JSON
   - Abre el JSON y copia:
     - `project_id`
     - `client_email`
     - `private_key`

   **Para Admin y Mobile:**
   - Configuración del proyecto → **Tus aplicaciones**
   - Click en el ícono **`</>`** (Web)
   - Registra la app
   - Copia las credenciales que aparecen

8. **Editar archivos .env:**

   **backend/.env:**
   ```
   FIREBASE_PROJECT_ID=tu-project-id-del-json
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-clave-privada-completa\n-----END PRIVATE KEY-----\n"
   ```

   **admin/.env.local y mobile/.env:**
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
   ```

#### 5.2 Configurar PostgreSQL (2 minutos)

1. **Abre PowerShell** (nueva ventana)

2. **Crear base de datos:**
   ```powershell
   createdb green_music
   ```

3. **Ejecutar script SQL:**
   ```powershell
   psql -U postgres -d green_music -f docs/MODELO_BD.sql
   ```

4. **Insertar datos de prueba (opcional):**
   ```powershell
   psql -U postgres -d green_music -f scripts/datos-prueba.sql
   ```

#### 5.3 Reiniciar Servicios

Después de editar los `.env`:

1. **Cierra las 3 ventanas** de PowerShell (los servicios)
2. **Ejecuta de nuevo:** `.\EJECUTAR_AQUI.bat` o `.\scripts\iniciar-todo.ps1`

---

## 🎯 PASO 6: Probar Funcionalidades

### En Admin Panel (http://localhost:3001):

1. **Crear usuario admin en Firebase:**
   - Firebase Console → Authentication → Add user
   - Email: `admin@test.com`
   - Password: `Admin123!`

2. **Actualizar rol en PostgreSQL:**
   ```sql
   psql -U postgres -d green_music
   UPDATE users SET role = 'admin' WHERE email = 'admin@test.com';
   \q
   ```

3. **Iniciar sesión** en admin panel con `admin@test.com`

4. **Crear productos** desde el admin

### En Mobile App:

1. **Registrarse** con un email nuevo
2. **Subir una canción**
3. **En admin, aprobar la canción**
4. **En mobile, reproducir la canción**
5. **Ver puntos ganados**
6. **Canjear un producto**

---

## 🐛 Solución de Problemas

### Los servicios no inician

**Verifica:**
- Node.js instalado: `node --version`
- Dependencias instaladas: `cd backend; npm list`

### Backend da error

**Errores comunes:**
- **"Cannot connect to database"** → PostgreSQL no está corriendo
- **"Firebase error"** → Credenciales incorrectas en `backend/.env`
- **"Port 3000 already in use"** → Cierra el proceso que usa el puerto

### Admin no carga

**Errores comunes:**
- **"Failed to compile"** → Revisa `admin/.env.local`
- **"Connection refused"** → Backend no está corriendo

### Mobile no carga

**Errores comunes:**
- **"Network request failed"** → Backend no está corriendo o URL incorrecta
- **"SDK incompatible"** → Ya está corregido (SDK 54)

---

## 📝 Resumen de Comandos Útiles

### Iniciar todo:
```powershell
.\EJECUTAR_AQUI.bat
# O
.\scripts\iniciar-todo.ps1
```

### Ver estado:
```powershell
.\scripts\revisar-logs.ps1
```

### Detener servicios:
- Cierra las 3 ventanas de PowerShell

### Reiniciar un servicio:
- Cierra su ventana
- Ejecuta manualmente:
  ```powershell
  cd backend
  npm run start:dev
  ```

---

## ✅ Checklist Final

- [ ] 3 ventanas de PowerShell abiertas
- [ ] Backend responde en http://localhost:3000
- [ ] Admin Panel carga en http://localhost:3001
- [ ] Mobile muestra QR code
- [ ] Firebase configurado (opcional, para funcionalidad completa)
- [ ] PostgreSQL configurado (opcional, para funcionalidad completa)

---

## 🎉 ¡Listo!

Con estos pasos deberías tener todo funcionando. Si encuentras algún problema, comparte los logs de las ventanas y te ayudo a solucionarlo.

