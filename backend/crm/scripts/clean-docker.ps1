# =============================================================================
# CRM Backend - Docker Cleaner
# =============================================================================
# Descripción: Limpieza completa de contenedores e imágenes Docker del backend
# Uso: .\scripts\clean-docker.ps1
# Advertencia: Este script elimina contenedores e imágenes
# =============================================================================

Write-Host ""
Write-Host "=====================================" -ForegroundColor Red
Write-Host "  CRM Backend - Limpieza Docker" -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Red
Write-Host ""
Write-Host "ADVERTENCIA: Este script eliminará:" -ForegroundColor Yellow
Write-Host "  - Contenedores del backend CRM" -ForegroundColor Gray
Write-Host "  - Imágenes del backend CRM" -ForegroundColor Gray
Write-Host "  - Volúmenes huérfanos (opcional)" -ForegroundColor Gray
Write-Host ""

# Obtener directorio del script
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath

# Cambiar al directorio raíz del proyecto
Set-Location $projectRoot
Write-Host "Directorio del proyecto: $projectRoot" -ForegroundColor Gray
Write-Host ""

# Confirmación
$confirmation = Read-Host "¿Estás seguro de continuar? (y/n)"
if ($confirmation -ne 'y' -and $confirmation -ne 'Y') {
    Write-Host ""
    Write-Host "Operación cancelada" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Iniciando limpieza..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$CONTAINER_NAME = "crm-backend-test"
$IMAGE_NAME = "crm-backend:latest"

# 1. Detener y remover contenedor
Write-Host "[1/4] Deteniendo y removiendo contenedor..." -ForegroundColor Yellow
docker stop $CONTAINER_NAME 2>$null
docker rm $CONTAINER_NAME 2>$null
Write-Host "       Contenedor eliminado" -ForegroundColor Green

# 2. Remover imagen
Write-Host ""
Write-Host "[2/4] Eliminando imagen Docker..." -ForegroundColor Yellow
docker image rm $IMAGE_NAME 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "       Imagen eliminada" -ForegroundColor Green
} else {
    Write-Host "       No fue necesario eliminar la imagen" -ForegroundColor Yellow
}

# 3. Limpieza de Docker (opcional)
Write-Host ""
Write-Host "[3/4] Limpieza de recursos de Docker..." -ForegroundColor Yellow

$cleanupChoice = Read-Host "¿Ejecutar 'docker system prune'? (y/n)"

if ($cleanupChoice -eq 'y' -or $cleanupChoice -eq 'Y') {
    Write-Host "       Ejecutando docker system prune..." -ForegroundColor Gray
    docker system prune -f
    Write-Host "       Limpieza completada" -ForegroundColor Green
} else {
    Write-Host "       Saltando limpieza general" -ForegroundColor Yellow
}

# 4. Verificar estado
Write-Host ""
Write-Host "[4/4] Verificando estado..." -ForegroundColor Yellow

$containersLeft = docker ps -a --filter "name=$CONTAINER_NAME" --format "{{.Names}}"
$imagesLeft = docker images $IMAGE_NAME --format "{{.Repository}}:{{.Tag}}"

if ([string]::IsNullOrWhiteSpace($containersLeft)) {
    Write-Host "       No hay contenedores del backend" -ForegroundColor Green
} else {
    Write-Host "       Contenedores restantes: $containersLeft" -ForegroundColor Yellow
}

if ([string]::IsNullOrWhiteSpace($imagesLeft)) {
    Write-Host "       No hay imágenes del backend" -ForegroundColor Green
} else {
    Write-Host "       Imágenes restantes: $imagesLeft" -ForegroundColor Yellow
}

# Mostrar información
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Limpieza completada" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Para volver a ejecutar el backend:" -ForegroundColor White
Write-Host ""
Write-Host "  .\scripts\run-docker.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "O manualmente:" -ForegroundColor White
Write-Host ""
Write-Host "  docker build -t $IMAGE_NAME ." -ForegroundColor Gray
Write-Host "  docker run -d -p 8080:8080 --name $CONTAINER_NAME \" -ForegroundColor Gray
Write-Host "    -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/startupcrm_db \" -ForegroundColor Gray
Write-Host "    -e SPRING_DATASOURCE_USERNAME=postgres \" -ForegroundColor Gray
Write-Host "    -e SPRING_DATASOURCE_PASSWORD=1 \" -ForegroundColor Gray
Write-Host "    $IMAGE_NAME" -ForegroundColor Gray
Write-Host ""
