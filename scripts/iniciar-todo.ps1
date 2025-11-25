# Script para iniciar TODOS los servicios de Green Music
# Ejecutar desde la raíz del proyecto

Write-Host "🎵 Green Music - Iniciando Todos los Servicios" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la raíz
if (-not (Test-Path "backend/package.json")) {
    Write-Host "❌ Ejecuta este script desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Verificar archivos .env
Write-Host "📋 Verificando configuración..." -ForegroundColor Yellow
$envFiles = @(
    @{Path="backend/.env"; Name="Backend"},
    @{Path="admin/.env.local"; Name="Admin"},
    @{Path="mobile/.env"; Name="Mobile"}
)

$allExist = $true
foreach ($file in $envFiles) {
    if (Test-Path $file.Path) {
        Write-Host "  ✅ $($file.Name) .env existe" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($file.Name) .env NO existe" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host ""
    Write-Host "⚠️  Algunos archivos .env faltan. Creándolos..." -ForegroundColor Yellow
    if (-not (Test-Path "backend/.env")) {
        Copy-Item "backend/.env.example" "backend/.env" -ErrorAction SilentlyContinue
    }
    if (-not (Test-Path "admin/.env.local")) {
        Copy-Item "admin/.env.example" "admin/.env.local" -ErrorAction SilentlyContinue
    }
    if (-not (Test-Path "mobile/.env")) {
        Copy-Item "mobile/.env.example" "mobile/.env" -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "🚀 Iniciando servicios..." -ForegroundColor Yellow
Write-Host ""

# Función para iniciar servicio
function Start-ServiceWindow {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command,
        [string]$Color = "Green"
    )
    
    Write-Host "  Iniciando $Name..." -ForegroundColor $Color
    $fullPath = Join-Path $PSScriptRoot ".." $Path
    $fullPath = Resolve-Path $fullPath -ErrorAction SilentlyContinue
    if (-not $fullPath) {
        $fullPath = Join-Path (Split-Path $PSScriptRoot -Parent) $Path
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$fullPath'; Write-Host '🎵 $Name - Green Music' -ForegroundColor Cyan; Write-Host '================================' -ForegroundColor Cyan; Write-Host ''; $Command"
    Start-Sleep -Seconds 2
}

# Iniciar Backend
Start-ServiceWindow "Backend (NestJS)" "backend" "npm run start:dev" "Green"

# Iniciar Admin Panel
Start-ServiceWindow "Admin Panel (Next.js)" "admin" "npm run dev" "Blue"

# Iniciar Mobile App
Start-ServiceWindow "Mobile App (Expo)" "mobile" "npm start" "Magenta"

Write-Host ""
Write-Host "✅ Todos los servicios iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs de Acceso:" -ForegroundColor Cyan
Write-Host "   Backend API:    http://localhost:3000" -ForegroundColor White
Write-Host "   Admin Panel:    http://localhost:3001" -ForegroundColor White
Write-Host "   Expo DevTools:  Se abrirá automáticamente" -ForegroundColor White
Write-Host ""
Write-Host "📱 Para probar en móvil:" -ForegroundColor Cyan
Write-Host "   1. Instala Expo Go en tu celular" -ForegroundColor White
Write-Host "   2. Escanea el QR code que aparecerá" -ForegroundColor White
Write-Host "   3. Asegúrate de estar en la misma WiFi" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para detener los servicios, cierra las ventanas de PowerShell" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Si es la primera vez, configura Firebase y PostgreSQL" -ForegroundColor Yellow
Write-Host "   Ver: LEEME_PRIMERO.md o GUIA_INTEGRACION_COMPLETA.md" -ForegroundColor Gray

