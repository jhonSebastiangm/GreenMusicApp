# Script para configurar la base de datos Green Music
Write-Host "Configurando Base de Datos Green Music" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Buscar PostgreSQL instalado
$pgPaths = @(
    "C:\Program Files\PostgreSQL\18\bin\psql.exe",
    "C:\Program Files\PostgreSQL\16\bin\psql.exe",
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $pgPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        $pgBin = Split-Path $path
        $env:PATH = "$pgBin;$env:PATH"
        Write-Host "[OK] PostgreSQL encontrado: $pgBin" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "[ERROR] PostgreSQL no encontrado" -ForegroundColor Red
    Write-Host "   Asegurate de que PostgreSQL este instalado" -ForegroundColor Yellow
    exit 1
}

# Verificar conexion
Write-Host ""
Write-Host "Verificando conexion a PostgreSQL..." -ForegroundColor Yellow

# Leer contraseña del archivo .env del backend
$envFile = Join-Path $PSScriptRoot "..\backend\.env"
$password = "postgres"  # Default
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    $passwordLine = $envContent | Where-Object { $_ -match "DATABASE_PASSWORD=" }
    if ($passwordLine) {
        $password = $passwordLine -replace "DATABASE_PASSWORD=", "" -replace '"', ''
        Write-Host "   Contraseña leida del archivo .env" -ForegroundColor Gray
    }
}

# Configurar variable de entorno para la contraseña
$env:PGPASSWORD = $password

$testConn = & $psqlPath -U postgres -c "SELECT version();" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] No se pudo conectar a PostgreSQL" -ForegroundColor Red
    Write-Host "   Verifica que el servicio este corriendo" -ForegroundColor Yellow
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
} else {
    Write-Host "[WARNING] La base de datos puede que ya exista" -ForegroundColor Yellow
}

# Ejecutar script SQL
Write-Host ""
Write-Host "Ejecutando script de creacion de tablas..." -ForegroundColor Yellow
$scriptPath = Join-Path $PSScriptRoot "..\docs\MODELO_BD.sql"
$scriptPath = Resolve-Path $scriptPath -ErrorAction SilentlyContinue

if ($scriptPath) {
    $output = & $psqlPath -U postgres -d green_music -f $scriptPath 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Tablas creadas correctamente" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Algunos errores al crear tablas (puede que ya existan)" -ForegroundColor Yellow
        if ($output) {
            Write-Host "   Detalles: $($output -join ' ')" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "[WARNING] No se encontro el archivo MODELO_BD.sql" -ForegroundColor Yellow
}

# Insertar datos de prueba
Write-Host ""
Write-Host "Insertando datos de prueba..." -ForegroundColor Yellow
$dataPath = Join-Path $PSScriptRoot "..\scripts\datos-prueba.sql"
$dataPath = Resolve-Path $dataPath -ErrorAction SilentlyContinue

if ($dataPath) {
    $output = & $psqlPath -U postgres -d green_music -f $dataPath 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] Datos de prueba insertados" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Algunos errores al insertar datos" -ForegroundColor Yellow
        if ($output) {
            Write-Host "   Detalles: $($output -join ' ')" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "[WARNING] No se encontro el archivo datos-prueba.sql" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[OK] Configuracion completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Resumen:" -ForegroundColor Cyan
Write-Host "   Base de datos: green_music" -ForegroundColor White
Write-Host "   Usuario: postgres" -ForegroundColor White
Write-Host "   Puerto: 5432" -ForegroundColor White
Write-Host ""
Write-Host "Ahora puedes iniciar el backend:" -ForegroundColor Yellow
Write-Host "   cd backend && npm run start:dev" -ForegroundColor Cyan
