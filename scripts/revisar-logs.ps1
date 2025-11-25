# Script para revisar logs y estado de los servicios

Write-Host "🔍 Revisando Logs y Estado de Servicios" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Verificar puertos
Write-Host "📊 Estado de Puertos:" -ForegroundColor Yellow
Write-Host ""

$puerto3000 = netstat -ano | findstr ":3000" | findstr "LISTENING"
$puerto3001 = netstat -ano | findstr ":3001" | findstr "LISTENING"
$puerto8081 = netstat -ano | findstr ":8081" | findstr "LISTENING"

if ($puerto3000) {
    Write-Host "✅ Backend (puerto 3000): ACTIVO" -ForegroundColor Green
    $pid3000 = ($puerto3000 -split '\s+')[-1]
    Write-Host "   PID: $pid3000" -ForegroundColor Gray
} else {
    Write-Host "❌ Backend (puerto 3000): NO ACTIVO" -ForegroundColor Red
}

if ($puerto3001) {
    Write-Host "✅ Admin Panel (puerto 3001): ACTIVO" -ForegroundColor Green
    $pid3001 = ($puerto3001 -split '\s+')[-1]
    Write-Host "   PID: $pid3001" -ForegroundColor Gray
} else {
    Write-Host "❌ Admin Panel (puerto 3001): NO ACTIVO" -ForegroundColor Red
}

if ($puerto8081) {
    Write-Host "✅ Expo/Metro (puerto 8081): ACTIVO" -ForegroundColor Green
    $pid8081 = ($puerto8081 -split '\s+')[-1]
    Write-Host "   PID: $pid8081" -ForegroundColor Gray
} else {
    Write-Host "❌ Expo/Metro (puerto 8081): NO ACTIVO" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Procesos Node.js Activos:" -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Select-Object Id, @{Name="CPU";Expression={$_.CPU}}, @{Name="Memory(MB)";Expression={[math]::Round($_.WorkingSet64/1MB,2)}}, StartTime | Format-Table
} else {
    Write-Host "   No hay procesos Node.js corriendo" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔗 URLs de Servicios:" -ForegroundColor Yellow
Write-Host "   Backend:    http://localhost:3000" -ForegroundColor White
Write-Host "   Admin:      http://localhost:3001" -ForegroundColor White
Write-Host "   Expo:       http://localhost:8081" -ForegroundColor White

Write-Host ""
Write-Host "🧪 Pruebas Rápidas:" -ForegroundColor Yellow

# Probar Backend
Write-Host "   Probando Backend..." -ForegroundColor Gray
try {
    $backendTest = Invoke-WebRequest -Uri "http://localhost:3000/config/points-per-play" -Method GET -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   ✅ Backend responde correctamente" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend no responde: $($_.Exception.Message)" -ForegroundColor Red
}

# Probar Admin
Write-Host "   Probando Admin Panel..." -ForegroundColor Gray
try {
    $adminTest = Invoke-WebRequest -Uri "http://localhost:3001" -Method GET -TimeoutSec 2 -ErrorAction Stop
    Write-Host "   ✅ Admin Panel responde correctamente" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Admin Panel no responde: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 Para ver logs detallados:" -ForegroundColor Cyan
Write-Host "   - Backend: Revisa la ventana de PowerShell donde ejecutaste 'npm run start:dev'" -ForegroundColor White
Write-Host "   - Admin: Revisa la ventana de PowerShell donde ejecutaste 'npm run dev'" -ForegroundColor White
Write-Host "   - Mobile: Revisa la ventana de PowerShell donde ejecutaste 'npm start'" -ForegroundColor White

Write-Host ""
Write-Host "💡 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   - Ver procesos: Get-Process node" -ForegroundColor White
Write-Host "   - Matar proceso: Stop-Process -Id <PID>" -ForegroundColor White
Write-Host "   - Ver puertos: netstat -ano | findstr :3000" -ForegroundColor White

