# Crear Usuarios de Prueba en Firebase

Esta guía te ayuda a crear los usuarios de prueba manualmente en Firebase Console.

## Pasos

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** > **Users**
4. Click en **"Add user"** o **"Agregar usuario"**

## Usuarios a Crear

### 1. Admin
- **Email:** `admin@test.com`
- **Password:** `Admin123!`
- **UID:** Copia este UID después de crearlo

### 2. Usuario Normal
- **Email:** `user@test.com`
- **Password:** `User123!`
- **UID:** Copia este UID después de crearlo

### 3. Artista
- **Email:** `artist@test.com`
- **Password:** `Artist123!`
- **UID:** Copia este UID después de crearlo

## Actualizar Base de Datos

Después de crear los usuarios, actualiza los `firebase_uid` en PostgreSQL:

```sql
-- Conectarte a la BD
psql -U postgres -d green_music

-- Actualizar admin (reemplaza 'TU_UID_AQUI' con el UID real)
UPDATE users 
SET firebase_uid = 'TU_UID_AQUI' 
WHERE email = 'admin@test.com';

-- Actualizar usuario
UPDATE users 
SET firebase_uid = 'TU_UID_AQUI' 
WHERE email = 'user@test.com';

-- Actualizar artista
UPDATE users 
SET firebase_uid = 'TU_UID_AQUI' 
WHERE email = 'artist@test.com';
```

## Verificar

```sql
SELECT email, firebase_uid, role FROM users;
```

Todos deberían tener un `firebase_uid` válido (no 'firebase-uid-xxx-test').

