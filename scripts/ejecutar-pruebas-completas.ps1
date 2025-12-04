# Script para ejecutar pruebas completas de funcionalidades en segundo plano
# Green Music - Sistema de Pruebas Automatizadas

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GREEN MUSIC - PRUEBAS AUTOMATIZADAS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la raíz del proyecto
if (-not (Test-Path "backend/package.json")) {
    Write-Host "ERROR: Ejecuta este script desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Verificar que el backend esté corriendo
Write-Host "Verificando que el backend esté corriendo..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/config/points-per-play" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "  ✓ Backend está corriendo en http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Backend NO está corriendo en http://localhost:3000" -ForegroundColor Red
    Write-Host "  Por favor, inicia el backend primero:" -ForegroundColor Yellow
    Write-Host "    cd backend" -ForegroundColor Gray
    Write-Host "    npm run start:dev" -ForegroundColor Gray
    Write-Host ""
    $continue = Read-Host "¿Deseas continuar de todas formas? (s/n)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 1
    }
}

Write-Host ""

# Verificar si axios está instalado
Write-Host "Verificando dependencias..." -ForegroundColor Yellow
$scriptPath = Join-Path $PSScriptRoot "test-completo-funcionalidades.js"

if (-not (Test-Path $scriptPath)) {
    Write-Host "  ✗ Script de pruebas no encontrado: $scriptPath" -ForegroundColor Red
    exit 1
}

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js no está instalado" -ForegroundColor Red
    exit 1
}

# Verificar versión de Node.js (necesita 18+ para fetch nativo, sino usa http)
Write-Host "  Verificando versión de Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
$nodeMajor = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeMajor -ge 18) {
    Write-Host "  ✓ Node.js $nodeVersion soporta fetch nativo" -ForegroundColor Green
} else {
    Write-Host "  ✓ Node.js $nodeVersion - usando módulo http nativo" -ForegroundColor Green
}

Write-Host ""

# Crear directorio de reportes
$reportDir = Join-Path (Split-Path $PSScriptRoot -Parent) "test-reports"
if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
    Write-Host "  ✓ Directorio de reportes creado: $reportDir" -ForegroundColor Green
}

Write-Host ""
Write-Host "Iniciando pruebas en segundo plano..." -ForegroundColor Cyan
Write-Host "  El reporte se guardará en: $reportDir" -ForegroundColor Gray
Write-Host ""

# Ejecutar el script de pruebas
$env:API_URL = "http://localhost:3000"
$env:NODE_ENV = "test"

# Ejecutar en segundo plano y mostrar salida
$job = Start-Job -ScriptBlock {
    param($scriptPath, $apiUrl)
    $env:API_URL = $apiUrl
    $env:NODE_ENV = "test"
    Set-Location $using:PSScriptRoot
    node $scriptPath 2>&1
} -ArgumentList $scriptPath, "http://localhost:3000"

Write-Host "Pruebas ejecutándose en segundo plano (Job ID: $($job.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "Para ver el progreso en tiempo real:" -ForegroundColor Yellow
Write-Host "  Receive-Job -Id $($job.Id) -Keep" -ForegroundColor Gray
Write-Host ""
Write-Host "Para ver el estado del job:" -ForegroundColor Yellow
Write-Host "  Get-Job -Id $($job.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Para esperar y ver el resultado completo:" -ForegroundColor Yellow
Write-Host "  Wait-Job -Id $($job.Id); Receive-Job -Id $($job.Id)" -ForegroundColor Gray
Write-Host ""
Write-Host "Los reportes se guardan en: $reportDir" -ForegroundColor Cyan
Write-Host ""

# Opción para esperar y mostrar resultado
$wait = Read-Host "¿Deseas esperar y ver el resultado ahora? (s/n)"
if ($wait -eq "s" -or $wait -eq "S") {
    Write-Host ""
    Write-Host "Esperando a que terminen las pruebas..." -ForegroundColor Yellow
    Wait-Job -Id $job.Id | Out-Null
    Write-Host ""
    Write-Host ("=" * 80) -ForegroundColor Cyan
    Write-Host "RESULTADO DE LAS PRUEBAS" -ForegroundColor Cyan
    Write-Host ("=" * 80) -ForegroundColor Cyan
    Write-Host ""
    Receive-Job -Id $job.Id
    Write-Host ""
    Remove-Job -Id $job.Id
    Write-Host "Pruebas completadas. Revisa el reporte en: $reportDir" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Las pruebas continúan ejecutándose en segundo plano." -ForegroundColor Green
    Write-Host "Usa los comandos anteriores para ver el progreso." -ForegroundColor Gray
}

