# Script para generar APK de Green Music
# Requiere: Expo CLI y cuenta de Expo

Write-Host "📱 Generando APK para Green Music" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en mobile
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Ejecuta este script desde la carpeta mobile/" -ForegroundColor Red
    exit 1
}

# Verificar Expo CLI
Write-Host "🔍 Verificando Expo CLI..." -ForegroundColor Yellow
try {
    $expoVersion = npx expo --version
    Write-Host "✅ Expo CLI encontrado: $expoVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Expo CLI no encontrado, instalando..." -ForegroundColor Yellow
    npm install -g expo-cli
}

Write-Host ""
Write-Host "📋 Opciones para generar APK:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Expo EAS Build (Recomendado - Requiere cuenta Expo)" -ForegroundColor Green
Write-Host "    - Más rápido y fácil" -ForegroundColor White
Write-Host "    - Requiere: npm install -g eas-cli" -ForegroundColor Yellow
Write-Host "    - Comando: eas build -p android" -ForegroundColor Yellow
Write-Host ""
Write-Host "2️⃣  Expo Build (Clásico - Requiere cuenta Expo)" -ForegroundColor Green
Write-Host "    - Funciona pero está deprecado" -ForegroundColor White
Write-Host "    - Comando: expo build:android" -ForegroundColor Yellow
Write-Host ""
Write-Host "3️⃣  Desarrollo Local (Para probar rápido)" -ForegroundColor Green
Write-Host "    - Usa Expo Go en tu teléfono" -ForegroundColor White
Write-Host "    - Escanea QR code" -ForegroundColor White
Write-Host "    - Comando: npm start" -ForegroundColor Yellow
Write-Host ""

$opcion = Read-Host "Selecciona una opción (1, 2, o 3)"

switch ($opcion) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Configurando EAS Build..." -ForegroundColor Yellow
        
        # Verificar EAS CLI
        try {
            $easVersion = eas --version
            Write-Host "✅ EAS CLI encontrado" -ForegroundColor Green
        } catch {
            Write-Host "📦 Instalando EAS CLI..." -ForegroundColor Yellow
            npm install -g eas-cli
        }
        
        Write-Host ""
        Write-Host "📝 Pasos siguientes:" -ForegroundColor Cyan
        Write-Host "   1. Ejecuta: eas login" -ForegroundColor White
        Write-Host "   2. Ejecuta: eas build:configure" -ForegroundColor White
        Write-Host "   3. Ejecuta: eas build -p android --profile preview" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 El APK se generará en la nube y recibirás un link para descargarlo" -ForegroundColor Yellow
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Iniciando Expo Build..." -ForegroundColor Yellow
        Write-Host "⚠️  Este método está deprecado, considera usar EAS Build" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📝 Pasos:" -ForegroundColor Cyan
        Write-Host "   1. Ejecuta: expo login" -ForegroundColor White
        Write-Host "   2. Ejecuta: expo build:android" -ForegroundColor White
        Write-Host ""
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 Iniciando en modo desarrollo..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📱 Para probar en tu teléfono:" -ForegroundColor Cyan
        Write-Host "   1. Instala 'Expo Go' desde Play Store o App Store" -ForegroundColor White
        Write-Host "   2. Ejecuta: npm start" -ForegroundColor White
        Write-Host "   3. Escanea el QR code con Expo Go" -ForegroundColor White
        Write-Host ""
        Write-Host "💻 Para probar en emulador:" -ForegroundColor Cyan
        Write-Host "   - Android: npm start, luego presiona 'a'" -ForegroundColor White
        Write-Host "   - iOS: npm start, luego presiona 'i'" -ForegroundColor White
        Write-Host ""
        
        $iniciar = Read-Host "¿Iniciar ahora? (s/n)"
        if ($iniciar -eq "s") {
            npm start
        }
    }
    default {
        Write-Host "❌ Opción inválida" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📚 Más información en: https://docs.expo.dev/build/introduction/" -ForegroundColor Cyan

