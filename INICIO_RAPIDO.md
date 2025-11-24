# 🚀 Inicio Rápido - Green Music

Guía rápida para empezar en 5 minutos.

## ⚡ Setup Automático

### Windows (PowerShell)
```powershell
.\scripts\setup.ps1
```

### Mac/Linux
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Este script:
- ✅ Verifica prerequisitos
- ✅ Instala dependencias
- ✅ Crea archivos .env desde .env.example

## 📝 Configuración Manual (5 pasos)

### 1️⃣ Firebase (5 min)
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea proyecto → Habilita Auth (Email/Password) → Habilita Storage
3. Obtén credenciales (ver `GUIA_INTEGRACION_COMPLETA.md` sección 1)

### 2️⃣ Base de Datos (2 min)
```bash
# Crear BD
createdb green_music

# Ejecutar script
psql -U postgres -d green_music -f docs/MODELO_BD.sql
```

### 3️⃣ Backend (2 min)
```bash
cd backend
# Edita .env con tus credenciales (Firebase + PostgreSQL)
npm run start:dev
```

### 4️⃣ Admin Panel (1 min)
```bash
cd admin
# Edita .env.local con credenciales Firebase
npm run dev
```

### 5️⃣ App Móvil (1 min)
```bash
cd mobile
# Edita .env con credenciales Firebase
npm start
```

## 🎯 Probar

1. **Regístrate** en la app móvil
2. **Crea usuario admin:**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'tu-email@test.com';
   ```
3. **Inicia sesión** en admin panel (`http://localhost:3001`)
4. **Crea productos** y **aprueba canciones**

## 📚 Documentación Completa

Para detalles paso a paso, lee: **`GUIA_INTEGRACION_COMPLETA.md`**

## ❓ Problemas?

Ver sección **Troubleshooting** en `GUIA_INTEGRACION_COMPLETA.md`

