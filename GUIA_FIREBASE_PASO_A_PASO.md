# 🔥 Guía Paso a Paso - Configurar Firebase

## 📍 Tu Proyecto Firebase
**URL:** https://console.firebase.google.com/project/greenmusic-6cd99/overview

---

## 🔐 PASO 1: Habilitar Authentication

### Ubicación en Firebase Console:

1. **En el menú lateral izquierdo**, busca y haz click en:
   ```
   🔐 Authentication
   ```
   (Está en la sección "Build" del menú)

2. Si es la primera vez, verás un botón:
   ```
   [Comenzar] o [Get started]
   ```
   Haz click en él.

3. **Ve a la pestaña "Sign-in method"** o **"Métodos de inicio de sesión"**

4. Verás una lista de proveedores. Busca:
   ```
   📧 Email/Password
   ```

5. Haz click en **"Email/Password"**

6. **Activa el primer toggle** (el que dice "Enable" o "Habilitar")

7. Haz click en **"Guardar"** o **"Save"**

✅ **¡Authentication habilitado!**

---

## 💾 PASO 2: Habilitar Storage

### Ubicación en Firebase Console:

1. **En el menú lateral izquierdo**, busca y haz click en:
   ```
   💾 Storage
   ```
   (Está en la sección "Build" del menú)

2. Si es la primera vez, verás un botón:
   ```
   [Comenzar] o [Get started]
   ```
   Haz click en él.

3. Te preguntará sobre las reglas de seguridad. Selecciona:
   ```
   ⚠️ Start in test mode
   ```
   (Por ahora, para desarrollo)

4. Selecciona una **ubicación** (elige la más cercana a ti):
   - `us-central` (Iowa, USA)
   - `us-east1` (Carolina del Sur, USA)
   - `europe-west1` (Bélgica)
   - `asia-southeast1` (Singapur)
   - etc.

5. Haz click en **"Listo"** o **"Done"**

✅ **¡Storage habilitado!**

---

## ⚙️ PASO 3: Configurar Reglas de Storage

### Después de habilitar Storage:

1. **Ve a la pestaña "Rules"** o **"Reglas"** en Storage

2. **Reemplaza** las reglas con este código:

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

3. Haz click en **"Publicar"** o **"Publish"**

✅ **¡Reglas configuradas!**

---

## 🔑 PASO 4: Obtener Credenciales para Backend

### Para el archivo `backend/.env`:

1. **En Firebase Console**, haz click en el **ícono de engranaje** ⚙️ (arriba a la izquierda)
   - O ve a: **Configuración del proyecto** / **Project settings**

2. **Ve a la pestaña "Cuentas de servicio"** / **"Service accounts"**

3. Haz click en el botón:
   ```
   [Generar nueva clave privada] o [Generate new private key]
   ```

4. Se descargará un archivo JSON. **Ábrelo con un editor de texto** (Notepad, VS Code, etc.)

5. **Copia estos valores** del JSON:
   - `project_id` → Para `FIREBASE_PROJECT_ID`
   - `client_email` → Para `FIREBASE_CLIENT_EMAIL`
   - `private_key` → Para `FIREBASE_PRIVATE_KEY` (toda la cadena, incluyendo `\n`)

6. **Edita el archivo `backend/.env`** y reemplaza:
   ```env
   FIREBASE_PROJECT_ID=tu-project-id-del-json
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@greenmusic-6cd99.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-clave-privada-completa\n-----END PRIVATE KEY-----\n"
   ```

✅ **¡Backend configurado!**

---

## 🌐 PASO 5: Obtener Credenciales para Admin y Mobile

### Para los archivos `admin/.env.local` y `mobile/.env`:

1. **En Firebase Console**, haz click en el **ícono de engranaje** ⚙️
   - O ve a: **Configuración del proyecto** / **Project settings**

2. **Baja hasta la sección "Tus aplicaciones"** / **"Your apps"**

3. Si NO tienes una app web, haz click en el ícono:
   ```
   </> (Web)
   ```

4. **Registra la app:**
   - Nombre: `Green Music Web` (o el que prefieras)
   - No marques "Firebase Hosting" (no es necesario)
   - Haz click en **"Registrar app"** / **"Register app"**

5. **Se mostrarán las credenciales**. Copia estos valores:

   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",           // ← Copia este
     authDomain: "greenmusic-6cd99.firebaseapp.com",  // ← Copia este
     projectId: "greenmusic-6cd99",  // ← Copia este
     storageBucket: "greenmusic-6cd99.appspot.com",   // ← Copia este
     messagingSenderId: "123456789", // ← Copia este
     appId: "1:123456789:web:abc..."  // ← Copia este
   };
   ```

6. **Edita `admin/.env.local`:**
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (el que copiaste)
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=greenmusic-6cd99.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=greenmusic-6cd99
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=greenmusic-6cd99.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
   ```

7. **Edita `mobile/.env`** con los mismos valores:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy... (el mismo)
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=greenmusic-6cd99.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=greenmusic-6cd99
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=greenmusic-6cd99.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc...
   ```

✅ **¡Admin y Mobile configurados!**

---

## 📍 Ubicación Visual en Firebase Console

```
Firebase Console
├── 📊 Overview (Dashboard)
├── 🔐 Authentication ← AQUÍ (menú lateral izquierdo)
│   └── Sign-in method (pestaña)
├── 💾 Storage ← AQUÍ (menú lateral izquierdo)
│   └── Rules (pestaña)
└── ⚙️ Configuración del proyecto (engranaje arriba)
    ├── Cuentas de servicio (Service accounts) ← Para Backend
    └── Tus aplicaciones (Your apps) ← Para Admin/Mobile
```

---

## ✅ Checklist

Después de seguir estos pasos, verifica:

- [ ] Authentication habilitado (Email/Password activo)
- [ ] Storage habilitado
- [ ] Reglas de Storage configuradas y publicadas
- [ ] `backend/.env` editado con credenciales Admin SDK
- [ ] `admin/.env.local` editado con credenciales Web
- [ ] `mobile/.env` editado con credenciales Web

---

## 🔄 Después de Configurar

1. **Reinicia los servicios:**
   - Cierra las 3 ventanas de PowerShell
   - Ejecuta de nuevo: `.\EJECUTAR_AQUI.bat`

2. **Prueba:**
   - Admin Panel: `http://localhost:3001`
   - Mobile App: Escanea QR code
   - Deberías poder registrarte e iniciar sesión

---

## 🎉 ¡Listo!

Con estos pasos, Firebase estará completamente configurado. Si tienes dudas en algún paso, avísame y te guío.

