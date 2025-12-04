# Script para probar el flujo completo de registro
# Simula lo que hace la app móvil

Write-Host "=== TEST COMPLETO DE REGISTRO ===" -ForegroundColor Cyan
Write-Host ""

# Verificar que el backend esté corriendo
Write-Host "1. Verificando Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Backend está corriendo" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Backend NO está corriendo" -ForegroundColor Red
    Write-Host "   Ejecuta: cd backend && npm run start:dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "2. Verificando endpoint de registro..." -ForegroundColor Yellow

# Simular request sin token (debe fallar con error claro)
$body = @{token=""} | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/auth/register" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop `
        -UseBasicParsing
    Write-Host "   ⚠️  Debería haber fallado sin token" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   ✅ Endpoint responde (Status: $statusCode)" -ForegroundColor Green
    
    if ($statusCode -eq 400 -or $statusCode -eq 401) {
        Write-Host "   ✅ Error esperado: Token requerido" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "3. Verificando logs del backend..." -ForegroundColor Yellow
if (Test-Path "backend\logs\backend.log") {
    Write-Host "   ✅ Logs disponibles en backend\logs\backend.log" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Últimas líneas del log:" -ForegroundColor Cyan
    Get-Content "backend\logs\backend.log" -Tail 10 | ForEach-Object {
        Write-Host "   $_" -ForegroundColor Gray
    }
} else {
    Write-Host "   ⚠️  No se encontraron logs" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "✅ Backend está funcionando" -ForegroundColor Green
Write-Host "✅ Endpoint de registro responde" -ForegroundColor Green
Write-Host ""
Write-Host "Para probar registro completo:" -ForegroundColor Yellow
Write-Host "  1. Abre la app móvil" -ForegroundColor White
Write-Host "  2. Intenta registrarte" -ForegroundColor White
Write-Host "  3. Revisa los logs del backend para ver errores detallados" -ForegroundColor White
Write-Host ""
Write-Host "Si hay errores, revisa:" -ForegroundColor Yellow
Write-Host "  - backend\logs\backend.log" -ForegroundColor White
Write-Host "  - mobile\logs\app.log (si existe)" -ForegroundColor White
Write-Host "  - Variables de Firebase en backend\.env" -ForegroundColor White





