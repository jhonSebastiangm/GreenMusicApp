# Script para configurar la base de datos con contraseña
Write-Host "Configurando Base de Datos Green Music" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Pedir contraseña
$password = Read-Host "Ingresa la contraseña de PostgreSQL (usuario postgres)" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
$env:PGPASSWORD = $plainPassword

# Buscar PostgreSQL
$pgPaths = @(
    "C:\Program Files\PostgreSQL\18\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $pgPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        Write-Host "[OK] PostgreSQL encontrado" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "[ERROR] PostgreSQL no encontrado" -ForegroundColor Red
    exit 1
}

# Verificar conexion
Write-Host ""
Write-Host "Verificando conexion..." -ForegroundColor Yellow
$testConn = & $psqlPath -U postgres -c "SELECT version();" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] No se pudo conectar" -ForegroundColor Red
    Write-Host "   Error: $testConn" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Conexion exitosa" -ForegroundColor Green

# Crear base de datos
Write-Host ""
Write-Host "Creando base de datos 'green_music'..." -ForegroundColor Yellow
& $psqlPath -U postgres -c "DROP DATABASE IF EXISTS green_music;" 2>&1 | Out-Null
& $psqlPath -U postgres -c "CREATE DATABASE green_music;" 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Base de datos creada" -ForegroundColor Green
}

# Ejecutar script SQL
Write-Host ""
Write-Host "Ejecutando script de creacion de tablas..." -ForegroundColor Yellow
$scriptPath = Join-Path $PSScriptRoot "..\docs\MODELO_BD.sql"
$scriptPath = Resolve-Path $scriptPath -ErrorAction SilentlyContinue

if ($scriptPath) {
    & $psqlPath -U postgres -d green_music -f $scriptPath 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Tablas creadas" -ForegroundColor Green
    }
}

# Insertar datos de prueba
Write-Host ""
Write-Host "Insertando datos de prueba..." -ForegroundColor Yellow
$dataPath = Join-Path $PSScriptRoot "..\scripts\datos-prueba.sql"
$dataPath = Resolve-Path $dataPath -ErrorAction SilentlyContinue

if ($dataPath) {
    & $psqlPath -U postgres -d green_music -f $dataPath 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Datos insertados" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "[OK] Configuracion completada!" -ForegroundColor Green

# Limpiar contraseña de memoria
$env:PGPASSWORD = $null
$plainPassword = $null


