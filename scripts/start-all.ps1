# Script para iniciar todos los servicios de Green Music
# Ejecutar desde la raíz del proyecto

Write-Host "🎵 Iniciando Green Music - Todos los Servicios" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la raíz
if (-not (Test-Path "backend/package.json")) {
    Write-Host "❌ Ejecuta este script desde la raíz del proyecto" -ForegroundColor Red
    exit 1
}

# Función para iniciar un servicio en nueva ventana
function Start-Service {
    param(
        [string]$Name,
        [string]$Path,
        [string]$Command
    )
    
    Write-Host "🚀 Iniciando $Name..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Path'; $Command"
    Start-Sleep -Seconds 3
}

# Iniciar Backend
Write-Host "📦 Backend (NestJS)..." -ForegroundColor Green
Start-Service "Backend" "$PSScriptRoot\..\backend" "npm run start:dev"

# Iniciar Admin Panel
Write-Host "🌐 Admin Panel (Next.js)..." -ForegroundColor Green
Start-Service "Admin Panel" "$PSScriptRoot\..\admin" "npm run dev"

# Iniciar Mobile App
Write-Host "📱 Mobile App (Expo)..." -ForegroundColor Green
Start-Service "Mobile App" "$PSScriptRoot\..\mobile" "npm start"

Write-Host ""
Write-Host "✅ Todos los servicios iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs:" -ForegroundColor Cyan
Write-Host "   Backend:    http://localhost:3000" -ForegroundColor White
Write-Host "   Admin:      http://localhost:3001" -ForegroundColor White
Write-Host "   Mobile:     Expo DevTools se abrirá automáticamente" -ForegroundColor White
Write-Host ""
Write-Host "💡 Para detener los servicios, cierra las ventanas de PowerShell" -ForegroundColor Yellow

