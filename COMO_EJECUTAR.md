# 🚀 CÓMO EJECUTAR - Paso a Paso

## 📍 Método 1: Doble Click (MÁS FÁCIL)

### Paso 1: Abrir el Explorador de Archivos
1. Presiona `Windows + E` para abrir el Explorador
2. Navega a: `C:\Users\User\Documents\repos\reproducto`

### Paso 2: Buscar el archivo
Busca el archivo llamado: **`EJECUTAR_AQUI.bat`**

### Paso 3: Ejecutar
- **Doble click** en `EJECUTAR_AQUI.bat`
- Se abrirán 3 ventanas de PowerShell con los servicios

### Paso 4: Esperar
Espera 10-15 segundos a que todo inicie. Verás:
- ✅ Ventana 1: Backend (puerto 3000)
- ✅ Ventana 2: Admin Panel (puerto 3001)  
- ✅ Ventana 3: Mobile App (Expo con QR code)

---

## 📍 Método 2: Desde PowerShell

### Paso 1: Abrir PowerShell
1. Presiona `Windows + X`
2. Selecciona **"Windows PowerShell"** o **"Terminal"**

### Paso 2: Ir a la carpeta del proyecto
Escribe estos comandos (uno por uno, presiona Enter después de cada uno):

```powershell
cd C:\Users\User\Documents\repos\reproducto
```

### Paso 3: Ejecutar el script
Escribe este comando:

```powershell
.\EJECUTAR_AQUI.ps1
```

Presiona Enter.

### Paso 4: Si aparece error de ejecución
Si dice algo como "no se puede ejecutar scripts", escribe:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Presiona Enter, luego escribe `S` y Enter.

Luego vuelve a ejecutar:
```powershell
.\EJECUTAR_AQUI.ps1
```

---

## 📍 Método 3: Desde la Terminal Integrada (VS Code/Cursor)

### Si estás en VS Code o Cursor:

1. Abre la terminal integrada:
   - Presiona `` Ctrl + ` `` (Ctrl + backtick)
   - O ve a: Terminal > New Terminal

2. Ejecuta:
```powershell
.\EJECUTAR_AQUI.ps1
```

---

## 🎯 Qué Esperar Después de Ejecutar

### Ventana 1: Backend
```
🎵 Backend (NestJS) - Green Music
================================
[Nest] Starting...
Application is running on: http://localhost:3000
```

### Ventana 2: Admin Panel
```
🎵 Admin Panel (Next.js) - Green Music
======================================
- ready started server on 0.0.0.0:3001
```

### Ventana 3: Mobile App
```
🎵 Mobile App (Expo) - Green Music
==================================
› Metro waiting on exp://192.168.1.X:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

---

## 📱 Probar en el Celular

### Paso 1: Instalar Expo Go
- **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS:** https://apps.apple.com/app/expo-go/id982107779

### Paso 2: Escanear QR
1. Abre **Expo Go** en tu celular
2. Escanea el **QR code** que aparece en la ventana 3
3. Asegúrate de estar en la **misma WiFi** que tu PC

---

## 🌐 Probar en el Navegador

### Admin Panel
1. Abre tu navegador (Chrome, Edge, etc.)
2. Ve a: `http://localhost:3001`
3. Deberías ver la pantalla de login

### Backend API
1. Abre: `http://localhost:3000/config/points-per-play`
2. Deberías ver: `{"points_per_play": 10}`

---

## 🐛 Si Algo No Funciona

### Error: "No se puede ejecutar scripts"
**Solución:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "No se encuentra el archivo"
**Solución:**
Asegúrate de estar en la carpeta correcta:
```powershell
cd C:\Users\User\Documents\repos\reproducto
ls EJECUTAR_AQUI.bat
```

### Las ventanas se cierran inmediatamente
**Solución:**
Los scripts están configurados para mantener las ventanas abiertas. Si se cierran, hay un error. Revisa:
- ¿Node.js está instalado? (`node --version`)
- ¿Las dependencias están instaladas? (`cd backend; npm list`)

### Backend no inicia
**Solución:**
1. Revisa la ventana del Backend para ver el error
2. Verifica que PostgreSQL esté corriendo
3. Verifica que `backend/.env` tenga las credenciales correctas

---

## ✅ Checklist Antes de Ejecutar

- [ ] Estás en la carpeta: `C:\Users\User\Documents\repos\reproducto`
- [ ] Node.js está instalado (`node --version` debe funcionar)
- [ ] PostgreSQL está instalado y corriendo
- [ ] Archivos `.env` están creados (ya están creados ✅)
- [ ] Firebase está configurado (si no, los servicios iniciarán pero no funcionarán completamente)

---

## 🎉 ¡Listo!

Solo necesitas:
1. **Doble click** en `EJECUTAR_AQUI.bat`
2. **Esperar** 10-15 segundos
3. **Probar** en navegador o celular

¡Es así de fácil! 🚀

