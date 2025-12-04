# Script para instalar y configurar PostgreSQL automáticamente
Write-Host "🐘 Instalando PostgreSQL para Green Music" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si ya está instalado
if (Test-Path "C:\Program Files\PostgreSQL") {
    Write-Host "✅ PostgreSQL ya está instalado" -ForegroundColor Green
    $pgPath = Get-ChildItem "C:\Program Files\PostgreSQL" | Sort-Object Name -Descending | Select-Object -First 1
    Write-Host "   Ubicación: $($pgPath.FullName)" -ForegroundColor Gray
    exit 0
}

Write-Host "📥 Descargando PostgreSQL 16..." -ForegroundColor Yellow
$ProgressPreference = 'SilentlyContinue'

# URL del instalador de PostgreSQL 16
$installerUrl = "https://get.enterprisedb.com/postgresql/postgresql-16.1-1-windows-x64.exe"
$installerPath = "$env:TEMP\postgresql-installer.exe"

try {
    Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -ErrorAction Stop
    Write-Host "✅ Descarga completada" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al descargar: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Alternativa: Descarga manualmente desde:" -ForegroundColor Yellow
    Write-Host "   https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "🔧 Instalando PostgreSQL (esto puede tardar varios minutos)..." -ForegroundColor Yellow
Write-Host "   Por favor, NO cierres esta ventana" -ForegroundColor Yellow
Write-Host ""

# Instalación silenciosa de PostgreSQL
# Configuración: puerto 5432, password: postgres, instalación completa
$installArgs = @(
    "--mode", "unattended",
    "--superpassword", "postgres",
    "--servicename", "postgresql-x64-16",
    "--servicepassword", "postgres",
    "--serverport", "5432",
    "--locale", "C",
    "--datadir", "C:\Program Files\PostgreSQL\16\data",
    "--enable-components", "server,pgAdmin,stackbuilder",
    "--disable-components", "commandlinetools"
)

try {
    $process = Start-Process -FilePath $installerPath -ArgumentList $installArgs -Wait -PassThru
    
    if ($process.ExitCode -eq 0) {
        Write-Host "✅ PostgreSQL instalado correctamente" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Instalación completada con código: $($process.ExitCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error durante la instalación: $_" -ForegroundColor Red
    exit 1
}

# Limpiar instalador
Remove-Item $installerPath -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "⏳ Esperando que el servicio se inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar e iniciar el servicio
$serviceName = Get-Service | Where-Object { $_.Name -like "*postgresql*" } | Select-Object -First 1

if ($serviceName) {
    if ($serviceName.Status -ne "Running") {
        Write-Host "🚀 Iniciando servicio PostgreSQL..." -ForegroundColor Yellow
        Start-Service -Name $serviceName.Name
        Start-Sleep -Seconds 5
    }
    
    if ((Get-Service -Name $serviceName.Name).Status -eq "Running") {
        Write-Host "✅ Servicio PostgreSQL está corriendo" -ForegroundColor Green
    } else {
        Write-Host "⚠️  El servicio no se pudo iniciar automáticamente" -ForegroundColor Yellow
        Write-Host "   Intenta iniciarlo manualmente desde Servicios de Windows" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  No se encontró el servicio de PostgreSQL" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Instalación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Configuración:" -ForegroundColor Cyan
Write-Host "   Usuario: postgres" -ForegroundColor White
Write-Host "   Contraseña: postgres" -ForegroundColor White
Write-Host "   Puerto: 5432" -ForegroundColor White
Write-Host ""
Write-Host "💡 Ahora ejecuta el script de configuración de la base de datos:" -ForegroundColor Yellow
Write-Host "   .\scripts\configurar-bd.ps1" -ForegroundColor Cyan
Write-Host ""

