# Script para configurar y ejecutar en emulador Android

Write-Host "🤖 Configurando Emulador Android para Green Music" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Android Studio / SDK
Write-Host "🔍 Verificando Android SDK..." -ForegroundColor Yellow

$androidHome = $env:ANDROID_HOME
if (-not $androidHome) {
    $androidHome = "$env:LOCALAPPDATA\Android\Sdk"
}

if (Test-Path $androidHome) {
    Write-Host "✅ Android SDK encontrado en: $androidHome" -ForegroundColor Green
} else {
    Write-Host "❌ Android SDK no encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Instalación:" -ForegroundColor Yellow
    Write-Host "   1. Descarga Android Studio: https://developer.android.com/studio" -ForegroundColor White
    Write-Host "   2. Instala Android Studio" -ForegroundColor White
    Write-Host "   3. Abre Android Studio > SDK Manager" -ForegroundColor White
    Write-Host "   4. Instala Android SDK Platform y Android Emulator" -ForegroundColor White
    Write-Host "   5. Crea un AVD (Android Virtual Device)" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Verificar adb
$adbPath = "$androidHome\platform-tools\adb.exe"
if (Test-Path $adbPath) {
    Write-Host "✅ ADB encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ ADB no encontrado" -ForegroundColor Red
    Write-Host "   Instala Android SDK Platform-Tools desde Android Studio" -ForegroundColor Yellow
    exit 1
}

# Verificar emuladores disponibles
Write-Host ""
Write-Host "📱 Emuladores disponibles:" -ForegroundColor Cyan
& "$androidHome\emulator\emulator.exe" -list-avds

Write-Host ""
Write-Host "🚀 Para iniciar la app en emulador:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Inicia el emulador manualmente desde Android Studio" -ForegroundColor White
Write-Host "    O ejecuta: $androidHome\emulator\emulator.exe -avd NOMBRE_AVD" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Desde la carpeta mobile/, ejecuta:" -ForegroundColor White
Write-Host "    npm start" -ForegroundColor Green
Write-Host ""
Write-Host "3️⃣  Presiona 'a' para abrir en Android" -ForegroundColor White
Write-Host ""

# Verificar si hay emulador corriendo
Write-Host "🔍 Verificando emuladores activos..." -ForegroundColor Yellow
$devices = & "$adbPath" devices
if ($devices -match "emulator") {
    Write-Host "✅ Emulador detectado" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Puedes iniciar la app ahora con: cd mobile; npm start" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  No hay emuladores corriendo" -ForegroundColor Yellow
    Write-Host "   Inicia un emulador primero desde Android Studio" -ForegroundColor White
}

Write-Host ""
Write-Host "📚 Más información:" -ForegroundColor Cyan
Write-Host "   https://docs.expo.dev/workflow/android-studio-emulator/" -ForegroundColor Gray

