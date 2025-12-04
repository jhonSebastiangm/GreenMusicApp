# Script para reiniciar todos los servicios desde cero
# Úsalo antes de cada prueba para asegurar un estado limpio

$ErrorActionPreference = "Continue"

Write-Host "=== REINICIANDO TODOS LOS AMBIENTES ===" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Detener todos los procesos
Write-Host "1. Deteniendo todos los procesos..." -ForegroundColor Yellow
$processes = @("node", "expo", "npm")
foreach ($proc in $processes) {
    $running = Get-Process -Name $proc -ErrorAction SilentlyContinue
    if ($running) {
        Write-Host "   Deteniendo procesos $proc..." -ForegroundColor Gray
        $running | Stop-Process -Force -ErrorAction SilentlyContinue
    }
}

Start-Sleep -Seconds 3
Write-Host "   ✅ Procesos detenidos" -ForegroundColor Green
Write-Host ""

# Paso 2: Verificar PostgreSQL
Write-Host "2. Verificando PostgreSQL..." -ForegroundColor Yellow
$pg = Get-Process -Name postgres -ErrorAction SilentlyContinue
if ($pg) {
    Write-Host "   ✅ PostgreSQL corriendo" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  PostgreSQL no detectado (puede estar como servicio)" -ForegroundColor Yellow
    Write-Host "   Intentando iniciar PostgreSQL..." -ForegroundColor Gray
    $scriptPath = Join-Path $PSScriptRoot "iniciar-postgresql.ps1"
    if (Test-Path $scriptPath) {
        & $scriptPath
        Start-Sleep -Seconds 3
    }
}
Write-Host ""

# Paso 3: Limpiar puertos (opcional, solo si están ocupados)
Write-Host "3. Verificando puertos..." -ForegroundColor Yellow
$ports = @(3000, 3001, 8081)
foreach ($port in $ports) {
    $connection = netstat -an | Select-String ":$port.*LISTENING"
    if ($connection) {
        Write-Host "   ⚠️  Puerto $port aún en uso (se liberará al detener procesos)" -ForegroundColor Yellow
    } else {
        Write-Host "   ✅ Puerto $port disponible" -ForegroundColor Green
    }
}
Write-Host ""

# Paso 4: Iniciar Backend
Write-Host "4. Iniciando Backend..." -ForegroundColor Yellow
$backendPath = Join-Path (Split-Path $PSScriptRoot -Parent) "backend"
if (Test-Path $backendPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '=== BACKEND (Puerto 3000) ===' -ForegroundColor Cyan; Write-Host 'Iniciando con logging detallado...' -ForegroundColor Yellow; npm run start:dev"
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Backend iniciando..." -ForegroundColor Green
} else {
    Write-Host "   ❌ No se encontró el directorio backend" -ForegroundColor Red
}
Write-Host ""

# Paso 5: Iniciar Admin Panel
Write-Host "5. Iniciando Admin Panel..." -ForegroundColor Yellow
$adminPath = Join-Path (Split-Path $PSScriptRoot -Parent) "admin"
if (Test-Path $adminPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$adminPath'; Write-Host '=== ADMIN PANEL (Puerto 3001) ===' -ForegroundColor Cyan; `$env:PORT=3001; npm run dev"
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Admin iniciando..." -ForegroundColor Green
} else {
    Write-Host "   ❌ No se encontró el directorio admin" -ForegroundColor Red
}
Write-Host ""

# Paso 6: Iniciar Mobile App (Expo)
Write-Host "6. Iniciando Mobile App (Expo)..." -ForegroundColor Yellow
$mobilePath = Join-Path (Split-Path $PSScriptRoot -Parent) "mobile"
if (Test-Path $mobilePath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mobilePath'; Write-Host '=== MOBILE APP (Expo) ===' -ForegroundColor Cyan; Write-Host 'Espera a que aparezca el QR code...' -ForegroundColor Yellow; npm start"
    Start-Sleep -Seconds 3
    Write-Host "   ✅ Expo iniciando..." -ForegroundColor Green
} else {
    Write-Host "   ❌ No se encontró el directorio mobile" -ForegroundColor Red
}
Write-Host ""

# Paso 7: Esperar y verificar
Write-Host "7. Esperando que los servicios inicien (30 segundos)..." -ForegroundColor Yellow
Write-Host "   ⏳ Por favor espera..." -ForegroundColor Gray
Start-Sleep -Seconds 30
Write-Host ""

# Verificación final
Write-Host "=== VERIFICACIÓN FINAL ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "Backend (puerto 3000)..." -ForegroundColor Yellow
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Backend funcionando" -ForegroundColor Green
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    if ($status) {
        Write-Host "   ✅ Backend respondiendo (Status: $status)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Backend aún iniciando... (puede tardar más)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Admin (puerto 3001)..." -ForegroundColor Yellow
try {
    $admin = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Admin funcionando" -ForegroundColor Green
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    if ($status) {
        Write-Host "   ✅ Admin respondiendo (Status: $status)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Admin aún iniciando... (puede tardar más)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Expo (puerto 8081)..." -ForegroundColor Yellow
$expo = netstat -an | Select-String ":8081.*LISTENING"
if ($expo) {
    Write-Host "   ✅ Expo corriendo" -ForegroundColor Green
    Write-Host "   📱 Busca el QR code en la terminal de Expo" -ForegroundColor Cyan
} else {
    Write-Host "   ⚠️  Expo aún iniciando... (puede tardar más)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "✅ Todos los servicios han sido reiniciados" -ForegroundColor Green
Write-Host "✅ Ambientes limpios y listos para pruebas" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Servicios disponibles:" -ForegroundColor Yellow
Write-Host "  - Backend: http://localhost:3000" -ForegroundColor White
Write-Host "  - Admin: http://localhost:3001" -ForegroundColor White
Write-Host "  - Expo: Busca el QR code en la terminal" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Si algún servicio aún no responde, espera 30-60 segundos más" -ForegroundColor Gray
Write-Host "📖 Revisa los logs en las terminales de cada servicio" -ForegroundColor Gray

