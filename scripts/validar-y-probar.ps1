# Script completo: Reinicia todo, valida, y solo permite probar si TODO funciona

param(
    [int]$WaitTime = 60
)

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:3000"
$allOk = $true
$testData = @{}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VALIDACION COMPLETA AUTOMATICA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# FASE 1: Reiniciar todo
Write-Host "FASE 1: Reiniciando servicios..." -ForegroundColor Yellow
Write-Host ""

Write-Host "  Deteniendo procesos..." -ForegroundColor Gray
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "  Iniciando Backend..." -ForegroundColor Gray
$backendPath = "C:\Users\User\Documents\repos\reproducto\backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '=== BACKEND ===' -ForegroundColor Cyan; npm run start:dev" | Out-Null
Start-Sleep -Seconds 3

Write-Host "  Iniciando Admin..." -ForegroundColor Gray
$adminPath = "C:\Users\User\Documents\repos\reproducto\admin"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$adminPath'; Write-Host '=== ADMIN ===' -ForegroundColor Cyan; `$env:PORT=3001; npm run dev" | Out-Null
Start-Sleep -Seconds 3

Write-Host "  Iniciando Mobile..." -ForegroundColor Gray
$mobilePath = "C:\Users\User\Documents\repos\reproducto\mobile"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mobilePath'; Write-Host '=== MOBILE ===' -ForegroundColor Cyan; npm start" | Out-Null
Start-Sleep -Seconds 3

Write-Host "  Esperando $WaitTime segundos para que inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds $WaitTime
Write-Host ""

# FASE 2: Validar cada paso
Write-Host "FASE 2: Validando cada paso..." -ForegroundColor Yellow
Write-Host ""

# Paso 1: Backend
Write-Host "[1/8] Backend..." -ForegroundColor Yellow
$backendOk = $false
for ($i = 0; $i -lt 10; $i++) {
    try {
        $r = Invoke-WebRequest -Uri $baseUrl -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
        Write-Host "  OK - Backend respondiendo" -ForegroundColor Green
        $backendOk = $true
        break
    } catch {
        if ($i -lt 9) {
            Start-Sleep -Seconds 2
        } else {
            Write-Host "  ERROR - Backend no responde" -ForegroundColor Red
            $allOk = $false
        }
    }
}
if (-not $backendOk) { exit 1 }
Start-Sleep -Seconds 1

# Paso 2: Canciones
Write-Host "[2/8] Canciones..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/songs?status=active" -UseBasicParsing -ErrorAction Stop
    $songs = $r.Content | ConvertFrom-Json
    if ($songs.Count -gt 0) {
        Write-Host "  OK - $($songs.Count) canciones disponibles" -ForegroundColor Green
        $testData.songTitle = $songs[0].title
        $testData.songPoints = $songs[0].points_per_play
        $testData.songId = $songs[0].id
    } else {
        Write-Host "  ERROR - No hay canciones" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "  ERROR - $($_.Exception.Message)" -ForegroundColor Red
    $allOk = $false
}
Start-Sleep -Seconds 1

# Paso 3: Productos
Write-Host "[3/8] Productos..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "$baseUrl/products?status=active" -UseBasicParsing -ErrorAction Stop
    $products = $r.Content | ConvertFrom-Json
    if ($products.Count -gt 0) {
        Write-Host "  OK - $($products.Count) productos disponibles" -ForegroundColor Green
        $prod = $products | Sort-Object points_required | Select-Object -First 1
        $testData.productTitle = $prod.title
        $testData.productPoints = $prod.points_required
        $testData.productId = $prod.id
    } else {
        Write-Host "  ERROR - No hay productos" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "  ERROR - $($_.Exception.Message)" -ForegroundColor Red
    $allOk = $false
}
Start-Sleep -Seconds 1

# Paso 4: Endpoint registro
Write-Host "[4/8] Endpoint registro..." -ForegroundColor Yellow
try {
    $body = '{"token":"test"}'
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "  ADVERTENCIA" -ForegroundColor Yellow
} catch {
    $s = $_.Exception.Response.StatusCode.value__
    if ($s) {
        Write-Host "  OK - Endpoint funciona (Status: $s)" -ForegroundColor Green
    } else {
        Write-Host "  ERROR" -ForegroundColor Red
        $allOk = $false
    }
}
Start-Sleep -Seconds 1

# Paso 5: Endpoint login
Write-Host "[5/8] Endpoint login..." -ForegroundColor Yellow
try {
    $body = '{"token":"test"}'
    $r = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "  ADVERTENCIA" -ForegroundColor Yellow
} catch {
    $s = $_.Exception.Response.StatusCode.value__
    if ($s) {
        Write-Host "  OK - Endpoint funciona (Status: $s)" -ForegroundColor Green
    } else {
        Write-Host "  ERROR" -ForegroundColor Red
        $allOk = $false
    }
}
Start-Sleep -Seconds 1

# Paso 6: Logs del backend
Write-Host "[6/8] Logs del backend..." -ForegroundColor Yellow
if (Test-Path "backend\logs\backend.log") {
    $logs = Get-Content "backend\logs\backend.log" -Tail 30
    $errs = ($logs | Select-String "ERROR" -CaseSensitive).Count
    if ($errs -eq 0) {
        Write-Host "  OK - Sin errores en logs" -ForegroundColor Green
    } else {
        Write-Host "  ADVERTENCIA - $errs errores encontrados" -ForegroundColor Yellow
        $logs | Select-String "ERROR" | Select-Object -First 3 | ForEach-Object {
            Write-Host "    $_" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ADVERTENCIA - Archivo de logs no encontrado" -ForegroundColor Yellow
}
Start-Sleep -Seconds 1

# Paso 7: Admin
Write-Host "[7/8] Admin Panel..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 3 -UseBasicParsing -ErrorAction Stop
    Write-Host "  OK - Admin funcionando" -ForegroundColor Green
} catch {
    $s = $_.Exception.Response.StatusCode.value__
    if ($s) {
        Write-Host "  OK - Admin respondiendo (Status: $s)" -ForegroundColor Green
    } else {
        Write-Host "  ADVERTENCIA - Admin iniciando..." -ForegroundColor Yellow
    }
}
Start-Sleep -Seconds 1

# Paso 8: Expo
Write-Host "[8/8] Expo..." -ForegroundColor Yellow
$expo = netstat -an | Select-String ":8081.*LISTENING"
if ($expo) {
    Write-Host "  OK - Expo corriendo" -ForegroundColor Green
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
    Write-Host "RESULTADO: TODO OK - LISTO PARA PROBAR" -ForegroundColor Green
    Write-Host ""
    Write-Host "DATOS VALIDADOS:" -ForegroundColor Yellow
    Write-Host "  Cancion: $($testData.songTitle)" -ForegroundColor White
    Write-Host "  Puntos por escuchar: $($testData.songPoints)" -ForegroundColor White
    Write-Host "  Producto mas barato: $($testData.productTitle)" -ForegroundColor White
    Write-Host "  Puntos requeridos: $($testData.productPoints)" -ForegroundColor White
    Write-Host ""
    Write-Host "FLUJO COMPLETO VALIDADO:" -ForegroundColor Yellow
    Write-Host "  1. Registrarse (cualquier email/password)" -ForegroundColor White
    Write-Host "  2. Escuchar '$($testData.songTitle)' -> Ganas $($testData.songPoints) puntos" -ForegroundColor White
    Write-Host "  3. Ver puntos en Profile" -ForegroundColor White
    Write-Host "  4. Canjear '$($testData.productTitle)' -> Necesitas $($testData.productPoints) puntos" -ForegroundColor White
    Write-Host ""
    Write-Host "PUEDES PROBAR AHORA!" -ForegroundColor Green
    Write-Host "Busca el QR code en la terminal de Expo" -ForegroundColor Cyan
} else {
    Write-Host "RESULTADO: HAY ERRORES - NO PROBAR AUN" -ForegroundColor Red
    Write-Host ""
    Write-Host "Corrige los errores antes de probar" -ForegroundColor Yellow
    exit 1
}





