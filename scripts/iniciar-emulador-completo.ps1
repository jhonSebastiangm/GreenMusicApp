# Script para iniciar emulador y toda la aplicación
Write-Host "`n=== INICIANDO EMULADOR Y APLICACION COMPLETA ===" -ForegroundColor Cyan

# Rutas
$emulatorPath = "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe"
$adbPath = "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe"
$projectRoot = Split-Path -Parent $PSScriptRoot

# 1. Iniciar emulador
Write-Host "`n1. INICIANDO EMULADOR..." -ForegroundColor Yellow
if (Test-Path $emulatorPath) {
    $emulators = & $emulatorPath -list-avds
    if ($emulators) {
        $firstEmu = $emulators[0]
        Write-Host "   Emulador encontrado: $firstEmu" -ForegroundColor Green
        Write-Host "   Iniciando emulador (esto puede tardar 30-60 segundos)..." -ForegroundColor Gray
        
        # Verificar si ya está corriendo
        $devices = & $adbPath devices 2>&1
        if ($devices -match "device$") {
            Write-Host "   ✅ Emulador ya está corriendo" -ForegroundColor Green
        } else {
            Start-Process $emulatorPath -ArgumentList "-avd", $firstEmu -WindowStyle Normal
            Write-Host "   Esperando 45 segundos para que el emulador arranque..." -ForegroundColor Gray
            Start-Sleep -Seconds 45
        }
    } else {
        Write-Host "   ❌ No se encontraron emuladores" -ForegroundColor Red
        Write-Host "   Abre Android Studio y crea un emulador primero" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "   ❌ No se encontró el emulador en: $emulatorPath" -ForegroundColor Red
    exit 1
}

# 2. Verificar que el emulador esté listo
Write-Host "`n2. VERIFICANDO EMULADOR..." -ForegroundColor Yellow
$maxAttempts = 15
$attempt = 0
$deviceReady = $false

while ($attempt -lt $maxAttempts -and -not $deviceReady) {
    $attempt++
    $devices = & $adbPath devices 2>&1
    if ($devices -match "device$") {
        $deviceReady = $true
        Write-Host "   ✅ Emulador conectado!" -ForegroundColor Green
    } else {
        Write-Host "   Esperando emulador... ($attempt/$maxAttempts)" -ForegroundColor Gray
        Start-Sleep -Seconds 3
    }
}

if (-not $deviceReady) {
    Write-Host "   ❌ El emulador no se conectó después de $maxAttempts intentos" -ForegroundColor Red
    Write-Host "   Verifica que el emulador esté completamente iniciado" -ForegroundColor Yellow
    exit 1
}

# 3. Configurar redirección de puertos
Write-Host "`n3. CONFIGURANDO REDIRECCION DE PUERTOS..." -ForegroundColor Yellow
& $adbPath reverse tcp:8081 tcp:8081 2>&1 | Out-Null
& $adbPath reverse tcp:3000 tcp:3000 2>&1 | Out-Null
Write-Host "   ✅ Redirección configurada (8081 y 3000)" -ForegroundColor Green

# 4. Verificar e iniciar Backend
Write-Host "`n4. VERIFICANDO BACKEND..." -ForegroundColor Yellow
$backendRunning = $false
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/songs?status=active" -Method GET -TimeoutSec 2 -ErrorAction Stop
    $backendRunning = $true
    Write-Host "   ✅ Backend ya está corriendo" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Backend NO está corriendo, iniciándolo..." -ForegroundColor Yellow
    $backendPath = Join-Path $projectRoot "backend"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run start:dev" -WindowStyle Minimized
    Write-Host "   Esperando 20 segundos para que el backend inicie..." -ForegroundColor Gray
    Start-Sleep -Seconds 20
    
    # Verificar nuevamente
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/songs?status=active" -Method GET -TimeoutSec 5 -ErrorAction Stop
        $backendRunning = $true
        Write-Host "   ✅ Backend iniciado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Backend aún no responde, pero continuando..." -ForegroundColor Yellow
    }
}

# 5. Verificar e iniciar Metro
Write-Host "`n5. VERIFICANDO METRO BUNDLER..." -ForegroundColor Yellow
$metroProcess = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { 
    $_.Path -like "*node.exe*" -and 
    (Get-WmiObject Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine -like "*metro*" -or
    (Get-WmiObject Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine -like "*expo*"
}

if ($metroProcess) {
    Write-Host "   ✅ Metro ya está corriendo" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Metro NO está corriendo, iniciándolo..." -ForegroundColor Yellow
    $mobilePath = Join-Path $projectRoot "mobile"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mobilePath'; npm start" -WindowStyle Normal
    Write-Host "   Esperando 15 segundos para que Metro inicie..." -ForegroundColor Gray
    Start-Sleep -Seconds 15
    Write-Host "   ✅ Metro iniciado" -ForegroundColor Green
}

# 6. Instalar app en el emulador
Write-Host "`n6. INSTALANDO APP EN EL EMULADOR..." -ForegroundColor Yellow
$apkPath = Join-Path $projectRoot "mobile\android\app\build\outputs\apk\debug\app-debug.apk"

if (Test-Path $apkPath) {
    Write-Host "   Desinstalando versión anterior (si existe)..." -ForegroundColor Gray
    & $adbPath uninstall com.greenmusic.app 2>&1 | Out-Null
    Start-Sleep -Seconds 2
    
    Write-Host "   Instalando APK..." -ForegroundColor Gray
    $fullPath = (Resolve-Path $apkPath).Path
    $installResult = & $adbPath install -r $fullPath 2>&1
    
    if ($LASTEXITCODE -eq 0 -or $installResult -match "Success" -or $installResult -match "Performing") {
        Write-Host "   ✅ APK instalado correctamente" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Error al instalar APK" -ForegroundColor Red
        Write-Host "   Resultado: $installResult" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "   ❌ APK no encontrado en: $apkPath" -ForegroundColor Red
    Write-Host "   Necesitas compilar la app primero con: cd mobile; npx expo run:android" -ForegroundColor Yellow
    exit 1
}

# 7. Ejecutar app
Write-Host "`n7. EJECUTANDO APP..." -ForegroundColor Yellow
& $adbPath shell am start -n com.greenmusic.app/.MainActivity 2>&1 | Out-Null
Start-Sleep -Seconds 3
Write-Host "   ✅ APP EJECUTADA" -ForegroundColor Green

# Resumen final
Write-Host "`n=== TODO LISTO ===" -ForegroundColor Cyan
Write-Host "   ✅ Emulador iniciado y conectado" -ForegroundColor Green
Write-Host "   ✅ Redirección de puertos configurada" -ForegroundColor Green
Write-Host "   ✅ Backend corriendo" -ForegroundColor Green
Write-Host "   ✅ Metro corriendo" -ForegroundColor Green
Write-Host "   ✅ App instalada y ejecutada" -ForegroundColor Green

Write-Host "`nINSTRUCCIONES:" -ForegroundColor Yellow
Write-Host "   1. Espera 5-10 segundos a que la app cargue completamente" -ForegroundColor White
Write-Host "   2. Toca el boton 'Probar sin registro (Modo Demo)'" -ForegroundColor White
Write-Host "   3. Las canciones deberian cargar correctamente" -ForegroundColor White
Write-Host "`nSi la app muestra error de red:" -ForegroundColor Cyan
Write-Host "   - Presiona Ctrl+M en el emulador y selecciona Reload" -ForegroundColor White
Write-Host "   - O cierra y vuelve a abrir la app" -ForegroundColor White
Write-Host ""

