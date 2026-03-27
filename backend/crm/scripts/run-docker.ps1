# =============================================================================
# CRM Backend - Docker Runner
# =============================================================================
# Descripción: Construye y ejecuta el contenedor Docker del backend CRM
# Uso: .\scripts\run-docker.ps1
# =============================================================================

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  CRM Backend - Docker Runner" -ForegroundColor Cyan
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
$PORT = "8080:8080"
$DB_URL = "jdbc:postgresql://host.docker.internal:5432/startupcrm_db"
$DB_USERNAME = "postgres"
$DB_PASSWORD = "1"

# 1. Verificar Docker
Write-Host "[1/5] Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>&1
    Write-Host "       $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "       ERROR: Docker no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# 2. Verificar si Docker está corriendo
Write-Host ""
Write-Host "[2/5] Verificando si Docker está ejecutándose..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "       Docker está corriendo correctamente" -ForegroundColor Green
} catch {
    Write-Host "       ERROR: Docker no está ejecutándose. Inicia Docker Desktop." -ForegroundColor Red
    exit 1
}

# 3. Detener y remover contenedor anterior
Write-Host ""
Write-Host "[3/5] Deteniendo contenedor anterior (si existe)..." -ForegroundColor Yellow
docker stop $CONTAINER_NAME 2>$null
docker rm $CONTAINER_NAME 2>$null
Write-Host "       Contenedor anterior eliminado" -ForegroundColor Green

# 4. Construir imagen
Write-Host ""
Write-Host "[4/5] Construyendo imagen Docker..." -ForegroundColor Yellow
Write-Host "       Imagen: $IMAGE_NAME" -ForegroundColor Gray

$buildStopwatch = [System.Diagnostics.Stopwatch]::StartNew()
docker build -t $IMAGE_NAME .

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "       ERROR en la construcción de la imagen!" -ForegroundColor Red
    exit 1
}

$buildStopwatch.Stop()
Write-Host "       Imagen construida en $($buildStopwatch.Elapsed.Seconds)s" -ForegroundColor Green

# 5. Ejecutar contenedor
Write-Host ""
Write-Host "[5/5] Iniciando contenedor..." -ForegroundColor Yellow

docker run -d `
  -p $PORT `
  --name $CONTAINER_NAME `
  -e SPRING_DATASOURCE_URL=$DB_URL `
  -e SPRING_DATASOURCE_USERNAME=$DB_USERNAME `
  -e SPRING_DATASOURCE_PASSWORD=$DB_PASSWORD `
  $IMAGE_NAME

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "       ERROR al iniciar el contenedor!" -ForegroundColor Red
    exit 1
}

# Esperar a que la aplicación inicie
Write-Host ""
Write-Host "       Esperando a que la aplicación inicie (20 segundos)..." -ForegroundColor Gray
Start-Sleep -Seconds 20

# Mostrar información
Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "  Backend CRM ejecutándose!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "  API Base:     http://localhost:$PORT" -ForegroundColor White
Write-Host "  Swagger UI:   http://localhost:$PORT/swagger-ui.html" -ForegroundColor White
Write-Host "  OpenAPI YAML: http://localhost:$PORT/openapi.yaml" -ForegroundColor White
Write-Host "  Health Check: http://localhost:$PORT/api/contacts" -ForegroundColor White
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Comandos Útiles:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Ver logs:         docker logs -f $CONTAINER_NAME" -ForegroundColor Gray
Write-Host "  Detener:          docker stop $CONTAINER_NAME" -ForegroundColor Gray
Write-Host "  Reiniciar:        docker restart $CONTAINER_NAME" -ForegroundColor Gray
Write-Host "  Eliminar:         docker rm -f $CONTAINER_NAME" -ForegroundColor Gray
Write-Host "  Estado:           docker ps --filter name=$CONTAINER_NAME" -ForegroundColor Gray
Write-Host ""
Write-Host "  Scripts útiles:" -ForegroundColor Gray
Write-Host "    .\scripts\stop-docker.ps1   - Detener contenedor" -ForegroundColor Gray
Write-Host "    .\scripts\clean-docker.ps1  - Limpieza completa" -ForegroundColor Gray
Write-Host ""
