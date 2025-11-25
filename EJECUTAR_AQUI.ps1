# Script principal - EJECUTAR ESTE ARCHIVO
# Doble click o ejecutar: .\EJECUTAR_AQUI.ps1

Write-Host ""
Write-Host "🎵 ========================================" -ForegroundColor Cyan
Write-Host "   Green Music - Inicio Automatico" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Ejecutar script de inicio
& ".\scripts\iniciar-todo.ps1"

Write-Host ""
Write-Host "Presiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

