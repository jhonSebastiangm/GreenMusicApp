# Script para iniciar TODOS los servicios de Green Music
# Ejecutar desde la raiz del proyecto

Write-Host "Green Music - Iniciando Todos los Servicios" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la raiz
if (-not (Test-Path "backend/package.json")) {
    Write-Host "ERROR: Ejecuta este script desde la raiz del proyecto" -ForegroundColor Red
    exit 1
}

# Verificar archivos .env
Write-Host "Verificando configuracion..." -ForegroundColor Yellow
$envFiles = @(
    @{Path="backend/.env"; Name="Backend"},
    @{Path="admin/.env.local"; Name="Admin"},
    @{Path="mobile/.env"; Name="Mobile"}
)

$allExist = $true
foreach ($file in $envFiles) {
    if (Test-Path $file.Path) {
        Write-Host "  OK $($file.Name) .env existe" -ForegroundColor Green
    } else {
        Write-Host "  ERROR $($file.Name) .env NO existe" -ForegroundColor Red
        $allExist = $false
    }
}

if (-not $allExist) {
    Write-Host ""
    Write-Host "Algunos archivos .env faltan. Creandolos..." -ForegroundColor Yellow
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
Write-Host "Iniciando servicios..." -ForegroundColor Yellow
Write-Host ""

# Obtener ruta absoluta del proyecto
$projectRoot = $PSScriptRoot | Split-Path -Parent

# Iniciar Backend
Write-Host "  Iniciando Backend (NestJS)..." -ForegroundColor Green
$backendPath = Join-Path $projectRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend (NestJS) - Green Music' -ForegroundColor Cyan; Write-Host '================================' -ForegroundColor Cyan; Write-Host ''; npm run start:dev"
Start-Sleep -Seconds 3

# Iniciar Admin Panel
Write-Host "  Iniciando Admin Panel (Next.js)..." -ForegroundColor Blue
$adminPath = Join-Path $projectRoot "admin"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$adminPath'; Write-Host 'Admin Panel (Next.js) - Green Music' -ForegroundColor Cyan; Write-Host '====================================' -ForegroundColor Cyan; Write-Host ''; `$env:PORT=3001; npm run dev"
Start-Sleep -Seconds 3

# Iniciar Mobile App
Write-Host "  Iniciando Mobile App (Expo)..." -ForegroundColor Magenta
$mobilePath = Join-Path $projectRoot "mobile"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mobilePath'; Write-Host 'Mobile App (Expo) - Green Music' -ForegroundColor Cyan; Write-Host '==============================' -ForegroundColor Cyan; Write-Host ''; npm start"
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Todos los servicios iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "URLs de Acceso:" -ForegroundColor Cyan
Write-Host "   Backend API:    http://localhost:3000" -ForegroundColor White
Write-Host "   Admin Panel:    http://localhost:3001" -ForegroundColor White
Write-Host "   Expo DevTools:  Se abrira automaticamente" -ForegroundColor White
Write-Host ""
Write-Host "Para probar en movil:" -ForegroundColor Cyan
Write-Host "   1. Instala Expo Go en tu celular" -ForegroundColor White
Write-Host "   2. Escanea el QR code que aparecera" -ForegroundColor White
Write-Host "   3. Asegurate de estar en la misma WiFi" -ForegroundColor White
Write-Host ""
Write-Host "Para detener los servicios, cierra las ventanas de PowerShell" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANTE: Si es la primera vez, configura Firebase y PostgreSQL" -ForegroundColor Yellow
Write-Host "   Ver: LEEME_PRIMERO.md o GUIA_INTEGRACION_COMPLETA.md" -ForegroundColor Gray
