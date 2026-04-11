# WPPConnect Server Start Script
# Start WPPConnect directly with Node.js (no Docker)

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  WPPConnect Server - Node.js Edition   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Configurar variables de entorno
$env:SERVER_TYPE = "server"
$env:SERVER_PORT = "8080"
$env:SECRET_KEY = "THISISMYSECURETOKEN"
$env:START_ALL_SESSION = "true"

# Mostrar configuración
Write-Host "Configuración:" -ForegroundColor Yellow
Write-Host "  Puerto: $env:SERVER_PORT" -ForegroundColor White
Write-Host "  Tipo:   $env:SERVER_TYPE" -ForegroundColor White
Write-Host "  Clave:  $env:SECRET_KEY" -ForegroundColor White
Write-Host ""

# Verificar que el puerto esté libre
$portInUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "ADVERTENCIA: El puerto 8080 está en uso" -ForegroundColor Yellow
    Write-Host "Procesos usando el puerto:" -ForegroundColor Yellow
    Get-NetTCPConnection -LocalPort 8080 | ForEach-Object { 
        Write-Host "  - PID: $($_.OwningProcess)" -ForegroundColor White
    }
    Write-Host ""
}

# Cambiar al directorio de WPPConnect
$wppDir = "D:\nc\002\nextjs_crm\node_modules\@wppconnect\server"
Set-Location $wppDir

Write-Host "Ejecutando WPPConnect Server..." -ForegroundColor Green
Write-Host "API Docs disponible en: http://localhost:$env:SERVER_PORT/api-docs" -ForegroundColor Cyan
Write-Host "Presiona CTRL+C para detener" -ForegroundColor Yellow
Write-Host ""

# Ejecuter
node dist/index.js