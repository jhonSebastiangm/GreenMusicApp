# Script para iniciar PostgreSQL
Write-Host "🐘 Iniciando PostgreSQL para Green Music" -ForegroundColor Cyan
Write-Host ""

# Verificar si Docker está disponible
$dockerAvailable = Get-Command docker -ErrorAction SilentlyContinue

if ($dockerAvailable) {
    Write-Host "✅ Docker encontrado" -ForegroundColor Green
    Write-Host ""
    Write-Host "Verificando si el contenedor ya existe..." -ForegroundColor Yellow
    
    $containerExists = docker ps -a --filter "name=greenmusic-postgres" --format "{{.Names}}" 2>$null
    
    if ($containerExists -eq "greenmusic-postgres") {
        Write-Host "✅ Contenedor ya existe" -ForegroundColor Green
        Write-Host "Iniciando contenedor..." -ForegroundColor Yellow
        docker start greenmusic-postgres
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PostgreSQL iniciado con Docker" -ForegroundColor Green
        } else {
            Write-Host "❌ Error al iniciar contenedor" -ForegroundColor Red
        }
    } else {
        Write-Host "Creando nuevo contenedor..." -ForegroundColor Yellow
        docker run --name greenmusic-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=green_music -p 5432:5432 -d postgres:15
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Contenedor creado e iniciado" -ForegroundColor Green
            Write-Host "⏳ Esperando 5 segundos para que PostgreSQL inicie..." -ForegroundColor Yellow
            Start-Sleep -Seconds 5
        } else {
            Write-Host "❌ Error al crear contenedor" -ForegroundColor Red
        }
    }
} else {
    Write-Host "⚠️  Docker no está instalado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Buscando servicios de PostgreSQL..." -ForegroundColor Cyan
    
    $services = Get-Service | Where-Object { $_.Name -like "*postgres*" -or $_.DisplayName -like "*postgres*" }
    
    if ($services) {
        Write-Host "✅ Servicios encontrados:" -ForegroundColor Green
        foreach ($service in $services) {
            if ($service.Status -ne "Running") {
                Write-Host "Iniciando: $($service.DisplayName)" -ForegroundColor Yellow
                Start-Service -Name $service.Name
                if ($service.Status -eq "Running") {
                    Write-Host "✅ Servicio iniciado" -ForegroundColor Green
                } else {
                    Write-Host "❌ Error al iniciar servicio" -ForegroundColor Red
                }
            } else {
                Write-Host "✅ $($service.DisplayName) ya está corriendo" -ForegroundColor Green
            }
        }
    } else {
        Write-Host "❌ No se encontró PostgreSQL" -ForegroundColor Red
        Write-Host ""
        Write-Host "OPCIONES:" -ForegroundColor Yellow
        Write-Host "1. Instalar Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor White
        Write-Host "2. Instalar PostgreSQL: https://www.postgresql.org/download/windows/" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "💡 Verifica que PostgreSQL esté corriendo antes de iniciar el backend" -ForegroundColor Cyan

