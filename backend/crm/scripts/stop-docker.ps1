# =============================================================================
# CRM Backend - Docker Stopper
# =============================================================================
# Descripción: Detiene y elimina el contenedor Docker del backend CRM
# Uso: .\scripts\stop-docker.ps1
# =============================================================================

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  CRM Backend - Detener Contenedor" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Obtener directorio del script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath

# Cambiar al directorio raíz del proyecto
Set-Location $projectRoot
Write-Host "Directorio del proyecto: $projectRoot" -ForegroundColor Gray
Write-Host ""

# Configuración
$CONTAINER_NAME = "crm-backend-test"
$IMAGE_NAME = "crm-backend:latest"

# 1. Verificar Docker
Write-Host "[1/3] Verificando Docker..." -ForegroundColor Yellow
try {
    docker --version | Out-Null
    Write-Host "       Docker está disponible" -ForegroundColor Green
} catch {
    Write-Host "       ERROR: Docker no está instalado" -ForegroundColor Red
    exit 1
}

# 2. Detener contenedor
Write-Host ""
Write-Host "[2/3] Deteniendo contenedor..." -ForegroundColor Yellow

$containerExists = docker ps -a --filter "name=$CONTAINER_NAME" --format "{{.Names}}" | Select-String $CONTAINER_NAME

if ($containerExists) {
    docker stop $CONTAINER_NAME
    Write-Host "       Contenedor detenido" -ForegroundColor Green
} else {
    Write-Host "       No hay contenedor '$CONTAINER_NAME' ejecutándose" -ForegroundColor Yellow
}

# 3. Remover contenedor
Write-Host ""
Write-Host "[3/3] Eliminando contenedor..." -ForegroundColor Yellow

docker rm $CONTAINER_NAME 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "       Contenedor eliminado" -ForegroundColor Green
} else {
    Write-Host "       No fue necesario eliminar el contenedor" -ForegroundColor Yellow
}

# Mostrar información
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Contenedor detenido" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Imagen Docker: $IMAGE_NAME" -ForegroundColor Gray
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Comandos Útiles:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Iniciar:          .\scripts\run-docker.ps1" -ForegroundColor Gray
Write-Host "  Limpieza:         .\scripts\clean-docker.ps1" -ForegroundColor Gray
Write-Host "  Ver logs:         docker logs $CONTAINER_NAME" -ForegroundColor Gray
Write-Host ""
