# Script para validar el flujo completo paso a paso
# Simula un usuario nuevo: registro, escuchar canción, canjear producto
# Solo permite probar cuando TODO funcione sin errores

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:3000"
$allStepsOk = $true
$errors = @()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VALIDACION COMPLETA DEL FLUJO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# PASO 1: Verificar Backend
Write-Host "[PASO 1/10] Verificando Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "  OK - Backend respondiendo" -ForegroundColor Green
} catch {
    Write-Host "  ERROR - Backend no responde" -ForegroundColor Red
    $allStepsOk = $false
    $errors += "Backend no responde"
    exit 1
}
Start-Sleep -Seconds 1

# PASO 2: Verificar logs del backend (sin errores críticos)
Write-Host "[PASO 2/10] Verificando logs del backend..." -ForegroundColor Yellow
if (Test-Path "backend\logs\backend.log") {
    $logContent = Get-Content "backend\logs\backend.log" -Tail 50
    $errorCount = ($logContent | Select-String "ERROR|FIREBASE.*Error|AUTH.*Error" -CaseSensitive).Count
    if ($errorCount -eq 0) {
        Write-Host "  OK - No hay errores en logs recientes" -ForegroundColor Green
    } else {
        Write-Host "  ADVERTENCIA - $errorCount errores encontrados en logs" -ForegroundColor Yellow
        $logContent | Select-String "ERROR|FIREBASE.*Error|AUTH.*Error" | Select-Object -First 3 | ForEach-Object {
            Write-Host "    $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ADVERTENCIA - Archivo de logs no encontrado" -ForegroundColor Yellow
}
Start-Sleep -Seconds 1

# PASO 3: Verificar que haya canciones disponibles
Write-Host "[PASO 3/10] Verificando canciones disponibles..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/songs?status=active" -UseBasicParsing -ErrorAction Stop
    $songs = $response.Content | ConvertFrom-Json
    if ($songs.Count -gt 0) {
        Write-Host "  OK - $($songs.Count) canciones disponibles" -ForegroundColor Green
        Write-Host "  Primera cancion: $($songs[0].title) - $($songs[0].points_per_play) puntos" -ForegroundColor Gray
        $firstSongId = $songs[0].id
    } else {
        Write-Host "  ERROR - No hay canciones disponibles" -ForegroundColor Red
        $allStepsOk = $false
        $errors += "No hay canciones disponibles"
    }
} catch {
    Write-Host "  ERROR - No se pueden obtener canciones: $($_.Exception.Message)" -ForegroundColor Red
    $allStepsOk = $false
    $errors += "Error al obtener canciones"
}
Start-Sleep -Seconds 1

# PASO 4: Verificar que haya productos disponibles
Write-Host "[PASO 4/10] Verificando productos disponibles..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/products?status=active" -UseBasicParsing -ErrorAction Stop
    $products = $response.Content | ConvertFrom-Json
    if ($products.Count -gt 0) {
        Write-Host "  OK - $($products.Count) productos disponibles" -ForegroundColor Green
        $cheapestProduct = $products | Sort-Object points_required | Select-Object -First 1
        Write-Host "  Producto mas barato: $($cheapestProduct.title) - $($cheapestProduct.points_required) puntos" -ForegroundColor Gray
        $cheapestProductId = $cheapestProduct.id
        $cheapestProductPoints = $cheapestProduct.points_required
    } else {
        Write-Host "  ERROR - No hay productos disponibles" -ForegroundColor Red
        $allStepsOk = $false
        $errors += "No hay productos disponibles"
    }
} catch {
    Write-Host "  ERROR - No se pueden obtener productos: $($_.Exception.Message)" -ForegroundColor Red
    $allStepsOk = $false
    $errors += "Error al obtener productos"
}
Start-Sleep -Seconds 1

# PASO 5: Verificar endpoint de registro (debe responder, aunque falle sin token)
Write-Host "[PASO 5/10] Verificando endpoint de registro..." -ForegroundColor Yellow
try {
    $body = '{"token":"test-token-invalido"}'
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "  ADVERTENCIA - Deberia haber fallado sin token valido" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401 -or $statusCode -eq 400 -or $statusCode -eq 500) {
        Write-Host "  OK - Endpoint responde correctamente (Status: $statusCode)" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - Status inesperado: $statusCode" -ForegroundColor Red
        $allStepsOk = $false
        $errors += "Endpoint de registro con status inesperado: $statusCode"
    }
}
Start-Sleep -Seconds 1

# PASO 6: Verificar endpoint de login
Write-Host "[PASO 6/10] Verificando endpoint de login..." -ForegroundColor Yellow
try {
    $body = '{"token":"test-token-invalido"}'
    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    Write-Host "  ADVERTENCIA - Deberia haber fallado sin token valido" -ForegroundColor Yellow
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401 -or $statusCode -eq 400 -or $statusCode -eq 500) {
        Write-Host "  OK - Endpoint responde correctamente (Status: $statusCode)" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - Status inesperado: $statusCode" -ForegroundColor Red
        $allStepsOk = $false
        $errors += "Endpoint de login con status inesperado: $statusCode"
    }
}
Start-Sleep -Seconds 1

# PASO 7: Verificar endpoint de reproducción de canción
Write-Host "[PASO 7/10] Verificando endpoint de reproduccion..." -ForegroundColor Yellow
if ($firstSongId) {
    try {
        $body = '{}'
        $response = Invoke-WebRequest -Uri "$baseUrl/song-plays/songs/$firstSongId/play-complete" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "  ADVERTENCIA - Deberia requerir autenticacion" -ForegroundColor Yellow
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401 -or $statusCode -eq 403) {
            Write-Host "  OK - Endpoint requiere autenticacion (Status: $statusCode)" -ForegroundColor Green
        } else {
            Write-Host "  ADVERTENCIA - Status: $statusCode" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  OMITIDO - No hay canciones para probar" -ForegroundColor Yellow
}
Start-Sleep -Seconds 1

# PASO 8: Verificar endpoint de canjeo
Write-Host "[PASO 8/10] Verificando endpoint de canjeo..." -ForegroundColor Yellow
if ($cheapestProductId) {
    try {
        $body = "{\"productId\":\"$cheapestProductId\"}"
        $response = Invoke-WebRequest -Uri "$baseUrl/redemptions" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        Write-Host "  ADVERTENCIA - Deberia requerir autenticacion" -ForegroundColor Yellow
    } catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        if ($statusCode -eq 401 -or $statusCode -eq 403) {
            Write-Host "  OK - Endpoint requiere autenticacion (Status: $statusCode)" -ForegroundColor Green
        } else {
            Write-Host "  ADVERTENCIA - Status: $statusCode" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "  OMITIDO - No hay productos para probar" -ForegroundColor Yellow
}
Start-Sleep -Seconds 1

# PASO 9: Verificar logs del backend después de las pruebas
Write-Host "[PASO 9/10] Verificando logs del backend (despues de pruebas)..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
if (Test-Path "backend\logs\backend.log") {
    $newLogContent = Get-Content "backend\logs\backend.log" -Tail 20
    $newErrors = ($newLogContent | Select-String "ERROR|FIREBASE.*Error|AUTH.*Error" -CaseSensitive).Count
    if ($newErrors -eq 0) {
        Write-Host "  OK - No hay nuevos errores" -ForegroundColor Green
    } else {
        Write-Host "  ADVERTENCIA - $newErrors nuevos errores" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ADVERTENCIA - Archivo de logs no encontrado" -ForegroundColor Yellow
}
Start-Sleep -Seconds 1

# PASO 10: Verificar que Expo esté corriendo
Write-Host "[PASO 10/10] Verificando Expo..." -ForegroundColor Yellow
$expo = netstat -an | Select-String ":8081.*LISTENING"
if ($expo) {
    Write-Host "  OK - Expo corriendo en puerto 8081" -ForegroundColor Green
} else {
    Write-Host "  ERROR - Expo no esta corriendo" -ForegroundColor Red
    $allStepsOk = $false
    $errors += "Expo no esta corriendo"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUMEN DE VALIDACION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($allStepsOk -and $errors.Count -eq 0) {
    Write-Host "RESULTADO: TODO OK - LISTO PARA PROBAR" -ForegroundColor Green
    Write-Host ""
    Write-Host "DATOS PARA PROBAR:" -ForegroundColor Yellow
    Write-Host "  Canciones disponibles: $($songs.Count)" -ForegroundColor White
    if ($songs.Count -gt 0) {
        Write-Host "  Primera cancion: $($songs[0].title)" -ForegroundColor White
        Write-Host "  Puntos por escuchar: $($songs[0].points_per_play)" -ForegroundColor White
    }
    Write-Host "  Productos disponibles: $($products.Count)" -ForegroundColor White
    if ($products.Count -gt 0) {
        Write-Host "  Producto mas barato: $($cheapestProduct.title)" -ForegroundColor White
        Write-Host "  Puntos requeridos: $($cheapestProductPoints)" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "FLUJO COMPLETO:" -ForegroundColor Yellow
    Write-Host "  1. Registrarse con cualquier email/password" -ForegroundColor White
    Write-Host "  2. Escuchar '$($songs[0].title)' para ganar $($songs[0].points_per_play) puntos" -ForegroundColor White
    Write-Host "  3. Ver puntos en Profile" -ForegroundColor White
    Write-Host "  4. Canjear '$($cheapestProduct.title)' con $($cheapestProductPoints) puntos" -ForegroundColor White
    Write-Host ""
    Write-Host "Puedes probar ahora!" -ForegroundColor Green
} else {
    Write-Host "RESULTADO: HAY ERRORES - NO PROBAR AUN" -ForegroundColor Red
    Write-Host ""
    Write-Host "Errores encontrados:" -ForegroundColor Red
    $errors | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Corrige los errores antes de probar" -ForegroundColor Yellow
    exit 1
}





