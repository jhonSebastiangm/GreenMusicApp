# 🌐 Solución: Registrar App Web en Firebase

## ⚠️ Problema

Firebase te está pidiendo "nombre del paquete de Android" porque estás en el formulario de **Android**, no de **Web**.

---

## ✅ Solución Correcta

### Paso 1: Ve a Configuración del Proyecto

1. En Firebase Console: https://console.firebase.google.com/project/greenmusic-6cd99/overview
2. Haz click en el **ícono de engranaje** ⚙️ (arriba a la izquierda)
3. Selecciona **"Configuración del proyecto"**

### Paso 2: Busca "Tus aplicaciones"

Desplázate hacia abajo hasta encontrar:
```
📱 Tus aplicaciones
   Your apps
```

### Paso 3: Haz Click en el Ícono CORRECTO

Verás varios íconos:

```
📱 iOS (iPhone)
🤖 Android  ← NO este (este pide "paquete de Android")
🌐 </> Web  ← SÍ este (este es el correcto)
```

**IMPORTANTE:** Haz click en el ícono **`</>`** que dice **"Web"**, NO en el de Android.

### Paso 4: Registrar App Web

Cuando hagas click en **`</>` Web**, verás un formulario diferente que pregunta:

- **Nombre de la app:** `Green Music Web`
- **Firebase Hosting:** (NO marques esta casilla)

**NO te pedirá "paquete de Android"** porque es para Web.

### Paso 5: Obtener Credenciales

Después de registrar, verás algo como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "greenmusic-6cd99.firebaseapp.com",
  projectId: "greenmusic-6cd99",
  storageBucket: "greenmusic-6cd99.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

---

## 🔍 Si No Ves el Ícono Web

### Opción 1: Buscar "Add app" o "Agregar app"

1. En la sección "Tus aplicaciones", busca un botón:
   ```
   [+ Agregar app] o [+ Add app]
   ```
2. Al hacer click, te mostrará opciones:
   - iOS
   - Android
   - **Web** ← Selecciona este

### Opción 2: URL Directa

Puedes ir directamente a:
```
https://console.firebase.google.com/project/greenmusic-6cd99/settings/general
```

Y buscar la sección "Tus aplicaciones" ahí.

---

## 📝 Después de Obtener las Credenciales

Una vez que tengas las credenciales Web, edita:

### `admin/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (del código que copiaste)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=greenmusic-6cd99.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=greenmusic-6cd99
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=greenmusic-6cd99.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 (del código)
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc... (del código)
```

### `mobile/.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy... (el mismo de arriba)
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=greenmusic-6cd99.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=greenmusic-6cd99
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=greenmusic-6cd99.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 (el mismo)
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc... (el mismo)
```

---

## ✅ Resumen

1. **NO uses el formulario de Android** (ese pide "paquete")
2. **USA el ícono `</>` Web** (ese NO pide "paquete")
3. **Registra la app Web** con nombre "Green Music Web"
4. **Copia las credenciales** que aparecen
5. **Edita los archivos .env** con esas credenciales

---

## 💡 Tip Visual

```
Firebase Console
│
└── ⚙️ Configuración
    │
    └── 📱 Tus aplicaciones
        │
        ├── 📱 iOS
        ├── 🤖 Android  ← Si click aquí, pide "paquete Android" ❌
        └── 🌐 </> Web  ← Si click aquí, NO pide "paquete" ✅
```

¡Busca el ícono **`</>`** y haz click ahí!

