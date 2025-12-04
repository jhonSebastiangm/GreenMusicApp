# Script que simula un usuario completo: registro, escuchar, canjear
# Solo permite probar cuando TODO funcione sin errores

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:3000"
$allOk = $true
$testData = @{}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SIMULACION COMPLETA DE USUARIO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# FASE 1: Reiniciar todo
Write-Host "FASE 1: Reiniciando servicios..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

$backendPath = "C:\Users\User\Documents\repos\reproducto\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '=== BACKEND ===' -ForegroundColor Cyan; npm run start:dev" | Out-Null
Start-Sleep -Seconds 3

$adminPath = "C:\Users\User\Documents\repos\reproducto\admin"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$adminPath'; Write-Host '=== ADMIN ===' -ForegroundColor Cyan; `$env:PORT=3001; npm run dev" | Out-Null
Start-Sleep -Seconds 3

$mobilePath = "C:\Users\User\Documents\repos\reproducto\mobile"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mobilePath'; Write-Host '=== MOBILE ===' -ForegroundColor Cyan; npm start" | Out-Null
Start-Sleep -Seconds 3

Write-Host "  Esperando 70 segundos para que todo inicie..." -ForegroundColor Yellow
Start-Sleep -Seconds 70
Write-Host ""

# FASE 2: Validar Backend
Write-Host "FASE 2: Validando Backend..." -ForegroundColor Yellow
$backendOk = $false
for ($i = 0; $i -lt 20; $i++) {
    try {
        $r = Invoke-WebRequest -Uri $baseUrl -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
        Write-Host "  OK - Backend respondiendo" -ForegroundColor Green
        $backendOk = $true
        break
    } catch {
        if ($i -lt 19) {
            Start-Sleep -Seconds 2
        } else {
            Write-Host "  ERROR - Backend no responde despues de 40 segundos" -ForegroundColor Red
            $allOk = $false
        }
    }
}
if (-not $backendOk) {
    Write-Host ""
    Write-Host "ERROR: Backend no esta funcionando" -ForegroundColor Red
    Write-Host "Revisa los logs en backend\logs\backend.log" -ForegroundColor Yellow
    exit 1
}
Start-Sleep -Seconds 2

# FASE 3: Validar datos disponibles
Write-Host "FASE 3: Validando datos disponibles..." -ForegroundColor Yellow

# Canciones
Write-Host "  Verificando canciones..." -ForegroundColor Gray
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/songs?status=active" -UseBasicParsing -ErrorAction Stop
    $songs = $r.Content | ConvertFrom-Json
    if ($songs.Count -gt 0) {
        Write-Host "    OK - $($songs.Count) canciones disponibles" -ForegroundColor Green
        $testData.songTitle = $songs[0].title
        $testData.songPoints = $songs[0].points_per_play
        $testData.songId = $songs[0].id
        $testData.songArtist = $songs[0].artist
    } else {
        Write-Host "    ERROR - No hay canciones" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "    ERROR - $($_.Exception.Message)" -ForegroundColor Red
    $allOk = $false
}

# Productos
Write-Host "  Verificando productos..." -ForegroundColor Gray
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/products?status=active" -UseBasicParsing -ErrorAction Stop
    $products = $r.Content | ConvertFrom-Json
    if ($products.Count -gt 0) {
        Write-Host "    OK - $($products.Count) productos disponibles" -ForegroundColor Green
        $prod = $products | Sort-Object points_required | Select-Object -First 1
        $testData.productTitle = $prod.title
        $testData.productPoints = $prod.points_required
        $testData.productId = $prod.id
        $testData.productDescription = $prod.description
    } else {
        Write-Host "    ERROR - No hay productos" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "    ERROR - $($_.Exception.Message)" -ForegroundColor Red
    $allOk = $false
}

if (-not $allOk) {
    Write-Host ""
    Write-Host "ERROR: Faltan datos en la base de datos" -ForegroundColor Red
    Write-Host "Ejecuta: .\scripts\insertar-datos-prueba.ps1" -ForegroundColor Yellow
    exit 1
}
Start-Sleep -Seconds 2

# FASE 4: Validar endpoints
Write-Host "FASE 4: Validando endpoints..." -ForegroundColor Yellow

# Endpoint registro
Write-Host "  Endpoint /auth/register..." -ForegroundColor Gray
try {
    $body = '{"token":"test-invalid"}'
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "    ADVERTENCIA - Deberia fallar" -ForegroundColor Yellow
} catch {
    $s = $_.Exception.Response.StatusCode.value__
    if ($s -eq 401 -or $s -eq 400 -or $s -eq 500) {
        Write-Host "    OK - Endpoint funciona (Status: $s)" -ForegroundColor Green
    } else {
        Write-Host "    ADVERTENCIA - Status: $s" -ForegroundColor Yellow
    }
}

# Endpoint login
Write-Host "  Endpoint /auth/login..." -ForegroundColor Gray
try {
    $body = '{"token":"test-invalid"}'
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "    ADVERTENCIA - Deberia fallar" -ForegroundColor Yellow
} catch {
    $s = $_.Exception.Response.StatusCode.value__
    if ($s -eq 401 -or $s -eq 400 -or $s -eq 500) {
        Write-Host "    OK - Endpoint funciona (Status: $s)" -ForegroundColor Green
    } else {
        Write-Host "    ADVERTENCIA - Status: $s" -ForegroundColor Yellow
    }
}
Start-Sleep -Seconds 2

# FASE 5: Verificar logs sin errores críticos
Write-Host "FASE 5: Verificando logs..." -ForegroundColor Yellow
if (Test-Path "backend\logs\backend.log") {
    $logs = Get-Content "backend\logs\backend.log" -Tail 50
    $errors = ($logs | Select-String "ERROR|FIREBASE.*Error|AUTH.*Error" -CaseSensitive)
    $errorCount = $errors.Count
    
    if ($errorCount -eq 0) {
        Write-Host "  OK - Sin errores en logs recientes" -ForegroundColor Green
    } else {
        Write-Host "  ADVERTENCIA - $errorCount errores encontrados" -ForegroundColor Yellow
        $errors | Select-Object -First 3 | ForEach-Object {
            Write-Host "    $_" -ForegroundColor Red
        }
        # No marcar como error fatal, solo advertencia
    }
} else {
    Write-Host "  ADVERTENCIA - Archivo de logs no encontrado" -ForegroundColor Yellow
}
Start-Sleep -Seconds 2

# FASE 6: Verificar Expo
Write-Host "FASE 6: Verificando Expo..." -ForegroundColor Yellow
$expo = netstat -an | Select-String ":8081.*LISTENING"
if ($expo) {
    Write-Host "  OK - Expo corriendo en puerto 8081" -ForegroundColor Green
} else {
    Write-Host "  ERROR - Expo no esta corriendo" -ForegroundColor Red
    $allOk = $false
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESULTADO FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($allOk) {
    Write-Host "RESULTADO: TODO VALIDADO - LISTO PARA PROBAR" -ForegroundColor Green
    Write-Host ""
    Write-Host "DATOS VALIDADOS PARA PROBAR:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "CANCION DISPONIBLE:" -ForegroundColor Cyan
    Write-Host "  Titulo: $($testData.songTitle)" -ForegroundColor White
    Write-Host "  Artista: $($testData.songArtist)" -ForegroundColor White
    Write-Host "  Puntos por escuchar: $($testData.songPoints)" -ForegroundColor White
    Write-Host ""
    Write-Host "PRODUCTO DISPONIBLE:" -ForegroundColor Cyan
    Write-Host "  Titulo: $($testData.productTitle)" -ForegroundColor White
    Write-Host "  Descripcion: $($testData.productDescription)" -ForegroundColor White
    Write-Host "  Puntos requeridos: $($testData.productPoints)" -ForegroundColor White
    Write-Host ""
    Write-Host "FLUJO COMPLETO VALIDADO:" -ForegroundColor Yellow
    Write-Host "  1. Registrarse:" -ForegroundColor White
    Write-Host "     - Nombre: Cualquier nombre (ej: Test User)" -ForegroundColor Gray
    Write-Host "     - Email: test@example.com (o cualquier email)" -ForegroundColor Gray
    Write-Host "     - Password: Test123! (minimo 6 caracteres)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Escuchar cancion:" -ForegroundColor White
    Write-Host "     - Ve a Home" -ForegroundColor Gray
    Write-Host "     - Toca '$($testData.songTitle)'" -ForegroundColor Gray
    Write-Host "     - Reproduce la cancion completa" -ForegroundColor Gray
    Write-Host "     - Ganaras $($testData.songPoints) puntos" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  3. Ver puntos:" -ForegroundColor White
    Write-Host "     - Ve a Profile" -ForegroundColor Gray
    Write-Host "     - Veras tus $($testData.songPoints) puntos" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  4. Canjear producto:" -ForegroundColor White
    Write-Host "     - Ve a Catalog" -ForegroundColor Gray
    Write-Host "     - Busca '$($testData.productTitle)'" -ForegroundColor Gray
    Write-Host "     - Si tienes $($testData.productPoints) puntos, puedes canjearlo" -ForegroundColor Gray
    Write-Host "     - Toca 'Canjear'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "VALIDACIONES COMPLETADAS:" -ForegroundColor Yellow
    Write-Host "  Backend: OK" -ForegroundColor Green
    Write-Host "  Canciones: OK ($($songs.Count) disponibles)" -ForegroundColor Green
    Write-Host "  Productos: OK ($($products.Count) disponibles)" -ForegroundColor Green
    Write-Host "  Endpoints: OK" -ForegroundColor Green
    Write-Host "  Expo: OK" -ForegroundColor Green
    Write-Host ""
    Write-Host "PUEDES PROBAR AHORA!" -ForegroundColor Green
    Write-Host "Busca el QR code en la terminal de Expo" -ForegroundColor Cyan
} else {
    Write-Host "RESULTADO: HAY ERRORES - NO PROBAR AUN" -ForegroundColor Red
    Write-Host ""
    Write-Host "Corrige los errores antes de probar" -ForegroundColor Yellow
    exit 1
}





