# Script para reiniciar todo y dejar listo para probar
# Se ejecuta automáticamente antes de cada prueba

Write-Host "=== REINICIANDO Y PREPARANDO PARA PRUEBA ===" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Detener todo
Write-Host "1. Deteniendo procesos anteriores..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2
Write-Host "   ✅ Procesos detenidos" -ForegroundColor Green
Write-Host ""

# Paso 2: Iniciar Backend
Write-Host "2. Iniciando Backend..." -ForegroundColor Yellow
$backendPath = "C:\Users\User\Documents\repos\reproducto\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '=== BACKEND (Puerto 3000) ===' -ForegroundColor Cyan; npm run start:dev"
Start-Sleep -Seconds 3
Write-Host "   ✅ Backend iniciando..." -ForegroundColor Green
Write-Host ""

# Paso 3: Iniciar Admin
Write-Host "3. Iniciando Admin Panel..." -ForegroundColor Yellow
$adminPath = "C:\Users\User\Documents\repos\reproducto\admin"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$adminPath'; Write-Host '=== ADMIN (Puerto 3001) ===' -ForegroundColor Cyan; `$env:PORT=3001; npm run dev"
Start-Sleep -Seconds 3
Write-Host "   ✅ Admin iniciando..." -ForegroundColor Green
Write-Host ""

# Paso 4: Iniciar Mobile
Write-Host "4. Iniciando Mobile App (Expo)..." -ForegroundColor Yellow
$mobilePath = "C:\Users\User\Documents\repos\reproducto\mobile"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mobilePath'; Write-Host '=== MOBILE APP (Expo) ===' -ForegroundColor Cyan; Write-Host 'Espera a que aparezca el QR code...' -ForegroundColor Yellow; npm start"
Start-Sleep -Seconds 3
Write-Host "   ✅ Expo iniciando..." -ForegroundColor Green
Write-Host ""

# Paso 5: Esperar que inicien
Write-Host "5. Esperando que los servicios inicien (35 segundos)..." -ForegroundColor Yellow
Write-Host "   ⏳ Por favor espera..." -ForegroundColor Gray
Start-Sleep -Seconds 35
Write-Host ""

# Paso 6: Verificación
Write-Host "=== VERIFICACIÓN ===" -ForegroundColor Cyan
Write-Host ""

$allOk = $true

Write-Host "Backend (puerto 3000)..." -ForegroundColor Yellow
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Backend funcionando" -ForegroundColor Green
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    if ($status) {
        Write-Host "   ✅ Backend respondiendo (Status: $status)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Backend aún iniciando..." -ForegroundColor Yellow
        $allOk = $false
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
        Write-Host "   ⚠️  Admin aún iniciando..." -ForegroundColor Yellow
        $allOk = $false
    }
}

Write-Host ""
Write-Host "Expo (puerto 8081)..." -ForegroundColor Yellow
$expo = netstat -an | Select-String ":8081.*LISTENING"
if ($expo) {
    Write-Host "   ✅ Expo corriendo" -ForegroundColor Green
    Write-Host "   📱 Busca el QR code en la terminal de Expo" -ForegroundColor Cyan
} else {
    Write-Host "   ⚠️  Expo aún iniciando..." -ForegroundColor Yellow
    $allOk = $false
}

Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
if ($allOk) {
    Write-Host "✅ Todos los servicios están funcionando" -ForegroundColor Green
    Write-Host "✅ Listo para probar" -ForegroundColor Green
} else {
    Write-Host "⚠️  Algunos servicios aún están iniciando" -ForegroundColor Yellow
    Write-Host "⏳ Espera 30-60 segundos más y verifica las terminales" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📱 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "  1. Busca el QR code en la terminal de Expo" -ForegroundColor White
Write-Host "  2. Escanea el QR con tu iPhone (app Expo Go)" -ForegroundColor White
Write-Host "  3. Espera a que la app cargue" -ForegroundColor White
Write-Host "  4. Intenta registrarte o iniciar sesión" -ForegroundColor White
Write-Host ""
Write-Host "📋 Servicios:" -ForegroundColor Cyan
Write-Host "  - Backend: http://localhost:3000" -ForegroundColor White
Write-Host "  - Admin: http://localhost:3001" -ForegroundColor White
Write-Host "  - Expo: Busca el QR code" -ForegroundColor White





