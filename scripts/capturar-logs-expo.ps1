# Script para capturar logs de Expo
Write-Host "📱 Capturando logs de Expo" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

$logFile = "mobile\logs\expo-terminal.log"
$logDir = Split-Path $logFile

# Crear directorio si no existe
if (-not (Test-Path $logDir)) {
    New-Item -ItemType Directory -Path $logDir -Force | Out-Null
}

Write-Host "Los logs de Expo se guardaran en: $logFile" -ForegroundColor Yellow
Write-Host ""
Write-Host "Para capturar logs en tiempo real, ejecuta:" -ForegroundColor Cyan
Write-Host "   cd mobile" -ForegroundColor White
Write-Host "   npm start 2>&1 | Tee-Object -FilePath ..\logs\expo-terminal.log" -ForegroundColor White
Write-Host ""








