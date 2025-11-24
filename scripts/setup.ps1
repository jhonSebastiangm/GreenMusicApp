# Script de configuración automática para Green Music (Windows PowerShell)
# Este script ayuda a configurar el proyecto paso a paso

Write-Host "🎵 Green Music - Script de Configuración" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar prerequisitos
Write-Host "📋 Verificando prerequisitos..." -ForegroundColor Yellow
Write-Host ""

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host "   Instala Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm instalado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está instalado" -ForegroundColor Red
    exit 1
}

# Verificar PostgreSQL
try {
    $psqlVersion = psql --version
    Write-Host "✅ PostgreSQL encontrado: $psqlVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostgreSQL no encontrado en PATH" -ForegroundColor Yellow
    Write-Host "   Asegúrate de tener PostgreSQL instalado" -ForegroundColor Yellow
}

# Verificar Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Git no encontrado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Backend..." -ForegroundColor Cyan
Set-Location backend
if (-not (Test-Path "package.json")) {
    Write-Host "❌ No se encontró package.json en backend/" -ForegroundColor Red
    exit 1
}
npm install
Set-Location ..

Write-Host ""
Write-Host "Admin Panel..." -ForegroundColor Cyan
Set-Location admin
if (-not (Test-Path "package.json")) {
    Write-Host "❌ No se encontró package.json en admin/" -ForegroundColor Red
    exit 1
}
npm install
Set-Location ..

Write-Host ""
Write-Host "Mobile App..." -ForegroundColor Cyan
Set-Location mobile
if (-not (Test-Path "package.json")) {
    Write-Host "❌ No se encontró package.json en mobile/" -ForegroundColor Red
    exit 1
}
npm install
Set-Location ..

Write-Host ""
Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
Write-Host ""

# Crear archivos .env si no existen
Write-Host "⚙️  Configurando archivos de entorno..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-Path "backend/.env")) {
    if (Test-Path "backend/.env.example") {
        Copy-Item "backend/.env.example" "backend/.env"
        Write-Host "📝 Creado backend/.env desde .env.example" -ForegroundColor Yellow
        Write-Host "   ⚠️  IMPORTANTE: Edita backend/.env con tus credenciales" -ForegroundColor Yellow
    } else {
        Write-Host "❌ No se encontró backend/.env.example" -ForegroundColor Red
    }
} else {
    Write-Host "✅ backend/.env ya existe" -ForegroundColor Green
}

if (-not (Test-Path "admin/.env.local")) {
    if (Test-Path "admin/.env.example") {
        Copy-Item "admin/.env.example" "admin/.env.local"
        Write-Host "📝 Creado admin/.env.local desde .env.example" -ForegroundColor Yellow
        Write-Host "   ⚠️  IMPORTANTE: Edita admin/.env.local con tus credenciales" -ForegroundColor Yellow
    } else {
        Write-Host "❌ No se encontró admin/.env.example" -ForegroundColor Red
    }
} else {
    Write-Host "✅ admin/.env.local ya existe" -ForegroundColor Green
}

if (-not (Test-Path "mobile/.env")) {
    if (Test-Path "mobile/.env.example") {
        Copy-Item "mobile/.env.example" "mobile/.env"
        Write-Host "📝 Creado mobile/.env desde .env.example" -ForegroundColor Yellow
        Write-Host "   ⚠️  IMPORTANTE: Edita mobile/.env con tus credenciales" -ForegroundColor Yellow
    } else {
        Write-Host "❌ No se encontró mobile/.env.example" -ForegroundColor Red
    }
} else {
    Write-Host "✅ mobile/.env ya existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Configuración inicial completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Próximos pasos:" -ForegroundColor Cyan
Write-Host "   1. Configura Firebase (ver GUIA_INTEGRACION_COMPLETA.md)"
Write-Host "   2. Crea la base de datos PostgreSQL"
Write-Host "   3. Edita los archivos .env con tus credenciales"
Write-Host "   4. Ejecuta el script SQL: psql -U postgres -d green_music -f docs/MODELO_BD.sql"
Write-Host "   5. Inicia los servicios:"
Write-Host "      - Backend: cd backend; npm run start:dev"
Write-Host "      - Admin: cd admin; npm run dev"
Write-Host "      - Mobile: cd mobile; npm start"
Write-Host ""
Write-Host "📖 Lee GUIA_INTEGRACION_COMPLETA.md para más detalles" -ForegroundColor Cyan

