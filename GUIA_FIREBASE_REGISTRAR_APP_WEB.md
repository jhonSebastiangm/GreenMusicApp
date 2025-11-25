# 🌐 Cómo Registrar App Web en Firebase

## ⚠️ IMPORTANTE: Estás Registrando App WEB, NO Android

Si Firebase te está pidiendo "nombre del paquete de Android", significa que estás en el formulario incorrecto.

---

## ✅ PASO A PASO CORRECTO

### 1. Ve a Configuración del Proyecto

1. En Firebase Console: https://console.firebase.google.com/project/greenmusic-6cd99/overview
2. Haz click en el **ícono de engranaje** ⚙️ (arriba a la izquierda, al lado del nombre del proyecto)
3. Selecciona **"Configuración del proyecto"** o **"Project settings"**

### 2. Baja hasta "Tus aplicaciones"

Desplázate hacia abajo hasta encontrar la sección:
```
📱 Tus aplicaciones
   Your apps
```

### 3. Busca el Ícono CORRECTO

Verás varios íconos para diferentes plataformas:

```
📱 iOS (ícono de iPhone)
🤖 Android (ícono de Android)  ← NO este
🌐 Web (ícono </>)            ← SÍ este
```

**IMPORTANTE:** Haz click en el ícono **`</>`** (Web), NO en el de Android.

### 4. Si NO ves el ícono Web

Si solo ves íconos de iOS y Android:

1. Busca un botón o link que diga:
   ```
   [Agregar app] o [Add app]
   ```
2. O busca un texto que diga:
   ```
   "¿No encuentras la plataforma que buscas?"
   ```
3. Ahí deberías ver la opción para agregar una app Web.

### 5. Registrar App Web

Una vez que hagas click en el ícono **`</>`** (Web):

1. **Nombre de la app:** `Green Music Web` (o el que prefieras)
2. **NO marques** "Firebase Hosting" (no es necesario para nuestro caso)
3. Haz click en **"Registrar app"** o **"Register app"**

### 6. Obtener Credenciales

Después de registrar, verás un código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "greenmusic-6cd99.firebaseapp.com",
  projectId: "greenmusic-6cd99",
  storageBucket: "greenmusic-6cd99.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

**Copia estos valores** para usar en los archivos `.env`

---

## 🔍 Si Sigue Pidiendo "Paquete de Android"

### Solución 1: Verificar que estás en Web

Asegúrate de hacer click en el ícono **`</>`** y no en el de Android 🤖

### Solución 2: Usar Credenciales Existentes

Si ya tienes una app Web registrada:

1. Ve a **Configuración del proyecto** ⚙️
2. Baja a **"Tus aplicaciones"**
3. Busca la app que tiene el ícono **`</>`** (Web)
4. Haz click en ella
5. Verás las credenciales en la sección **"SDK setup and configuration"**

### Solución 3: Configuración Manual

Si no puedes registrar la app Web, puedes usar las credenciales del proyecto directamente:

1. Ve a **Configuración del proyecto** ⚙️
2. En la pestaña **"General"**, encontrarás:
   - **Project ID:** `greenmusic-6cd99`
   - **Web API Key:** (si está disponible)

3. Para obtener las demás credenciales:
   - **authDomain:** `greenmusic-6cd99.firebaseapp.com`
   - **storageBucket:** `greenmusic-6cd99.appspot.com`
   - **messagingSenderId y appId:** Necesitas registrarlas, pero puedes usar valores temporales

---

## 📝 Alternativa: Usar Solo las Credenciales del Proyecto

Si tienes problemas registrando la app Web, puedes usar estas credenciales básicas:

### Para `admin/.env.local` y `mobile/.env`:

```env
# Estas son las credenciales básicas que puedes usar
NEXT_PUBLIC_FIREBASE_PROJECT_ID=greenmusic-6cd99
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=greenmusic-6cd99.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=greenmusic-6cd99.appspot.com

# Para API Key, ve a: Configuración > General > Web API Key
NEXT_PUBLIC_FIREBASE_API_KEY=tu-web-api-key-aqui

# Para estos, puedes usar valores temporales o registrarlos después
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:temp
```

---

## 🎯 Pasos Visuales

```
Firebase Console
│
└── ⚙️ Configuración del proyecto (engranaje)
    │
    └── 📱 Tus aplicaciones (Your apps)
        │
        ├── 📱 iOS
        ├── 🤖 Android  ← NO este
        └── 🌐 </> Web  ← SÍ este (haz click aquí)
            │
            └── [Registrar app]
                │
                └── Nombre: "Green Music Web"
                    └── [Registrar app]
                        │
                        └── Ver credenciales
```

---

## ✅ Después de Registrar

Una vez que tengas las credenciales, edita:

1. **`admin/.env.local`** con los valores
2. **`mobile/.env`** con los mismos valores

Y reinicia los servicios.

---

## 💡 Tip

Si Firebase sigue mostrando el formulario de Android, intenta:

1. **Cerrar y volver a abrir** la página de configuración
2. **Buscar específicamente** "Add web app" o "Agregar app web"
3. **Usar la URL directa:** https://console.firebase.google.com/project/greenmusic-6cd99/settings/general

¿Necesitas ayuda con algún paso específico?

