# Script para ejecutar pruebas completas en segundo plano (sin interacción)
# Green Music - Sistema de Pruebas Automatizadas

$ErrorActionPreference = "Continue"

# Verificar que estamos en la raíz del proyecto
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

if (-not (Test-Path "backend/package.json")) {
    Write-Host "ERROR: Ejecuta este script desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Verificar que el backend esté corriendo
Write-Host "Verificando backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/config/points-per-play" -Method GET -TimeoutSec 3 -ErrorAction Stop
    Write-Host "  ✓ Backend está corriendo" -ForegroundColor Green
} catch {
    Write-Host "  ⚠ Backend no responde, pero continuando..." -ForegroundColor Yellow
}

# Configurar variables de entorno
$env:API_URL = "http://localhost:3000"
$env:NODE_ENV = "test"

# Ruta del script de pruebas
$testScript = Join-Path $PSScriptRoot "test-completo-funcionalidades.js"

# Crear directorio de reportes
$reportDir = Join-Path $projectRoot "test-reports"
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
}

Write-Host ""
Write-Host "Ejecutando pruebas..." -ForegroundColor Cyan
Write-Host "Reportes en: $reportDir" -ForegroundColor Gray
Write-Host ""

# Ejecutar el script directamente
Set-Location $PSScriptRoot
node $testScript

# El script de Node.js maneja su propia salida y código de salida
exit $LASTEXITCODE



