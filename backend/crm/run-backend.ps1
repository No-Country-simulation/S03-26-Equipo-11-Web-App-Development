# Script para ejecutar el backend Spring Boot
# Requiere Java 17+ instalado

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  CRM Backend - Spring Boot" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Java
Write-Host "Verificando Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String -Pattern 'version' | Select-Object -First 1
    Write-Host "Java encontrado: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Java no esta instalado o no esta en el PATH" -ForegroundColor Red
    Write-Host "Por favor instala Java 17 o superior" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Iniciando aplicacion..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Ejecutar aplicacion
.\mvnw spring-boot:run
