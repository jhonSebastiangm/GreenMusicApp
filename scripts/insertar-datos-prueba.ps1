# Script para insertar datos de prueba completos en PostgreSQL
# Ejecutar desde la raiz del proyecto

Write-Host "=== INSERTANDO DATOS DE PRUEBA COMPLETOS ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que PostgreSQL esté corriendo
$pgProcess = Get-Process -Name "postgres" -ErrorAction SilentlyContinue
if (-not $pgProcess) {
    Write-Host "ERROR: PostgreSQL no está corriendo" -ForegroundColor Red
    Write-Host "Ejecuta: .\scripts\iniciar-postgresql.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "PostgreSQL está corriendo" -ForegroundColor Green
Write-Host ""

# Buscar psql
$psqlPath = "psql"
try {
    $null = Get-Command psql -ErrorAction Stop
} catch {
    Write-Host "ERROR: psql no encontrado" -ForegroundColor Red
    Write-Host "Asegúrate de que PostgreSQL esté instalado y en el PATH" -ForegroundColor Yellow
    exit 1
}

# Leer password de .env si existe
$envFile = "backend\.env"
$password = "postgres" # Default
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $passwordLine = $envContent | Where-Object { $_ -match "DATABASE_PASSWORD=" }
    if ($passwordLine) {
        $password = $passwordLine -replace "DATABASE_PASSWORD=", "" -replace '"', '' -replace "'", ''
    }
}

# Configurar password
$env:PGPASSWORD = $password

# Archivo SQL
$sqlFile = Join-Path $PSScriptRoot "datos-prueba-completos.sql"

if (-not (Test-Path $sqlFile)) {
    Write-Host "ERROR: No se encontró $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "Insertando datos de prueba..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar script SQL
$result = & $psqlPath -U postgres -d green_music -f $sqlFile 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Datos de prueba insertados correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "RESUMEN:" -ForegroundColor Cyan
    Write-Host "  👤 3 usuarios creados" -ForegroundColor White
    Write-Host "  🎵 5 canciones creadas" -ForegroundColor White
    Write-Host "  🛍️  6 productos creados" -ForegroundColor White
    Write-Host "  📊 Historial de ejemplo incluido" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
    Write-Host "  1. Crea los usuarios en Firebase Auth:" -ForegroundColor White
    Write-Host "     - admin@test.com / Admin123!" -ForegroundColor Gray
    Write-Host "     - user@test.com / User123!" -ForegroundColor Gray
    Write-Host "     - artist@test.com / Artist123!" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Actualiza los firebase_uid en PostgreSQL:" -ForegroundColor White
    Write-Host "     psql -U postgres -d green_music" -ForegroundColor Gray
    Write-Host "     UPDATE users SET firebase_uid = 'TU_UID_REAL' WHERE email = 'admin@test.com';" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  3. Las URLs de audio son de ejemplo - funcionarán para demo" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Error al insertar datos:" -ForegroundColor Red
    Write-Host $result -ForegroundColor Red
    Write-Host ""
    Write-Host "Verifica:" -ForegroundColor Yellow
    Write-Host "  - Que la BD 'green_music' exista" -ForegroundColor White
    Write-Host "  - Que las tablas estén creadas (ejecuta MODELO_BD.sql primero)" -ForegroundColor White
    Write-Host "  - Que PostgreSQL esté corriendo" -ForegroundColor White
}

# Limpiar password
$env:PGPASSWORD = $null






