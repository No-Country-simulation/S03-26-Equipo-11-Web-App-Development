# Instalar Maven en Windows
# Ejecutar como administrador en PowerShell

$MAVEN_VERSION = "3.9.14"
$MAVEN_URL = "https://dlcdn.apache.org/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.zip"
$INSTALL_PATH = "C:\maven"
$ZIP_FILE = "$env:TEMP\maven.zip"

Write-Host "Descargando Maven..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $MAVEN_URL -OutFile $ZIP_FILE

Write-Host "Extrayendo..." -ForegroundColor Cyan
Expand-Archive -Path $ZIP_FILE -DestinationPath $INSTALL_PATH -Force

Write-Host "Configurando variables de entorno..." -ForegroundColor Cyan
$env:MAVEN_HOME = "$INSTALL_PATH\apache-maven-$MAVEN_VERSION"
$env:PATH += ";$env:MAVEN_HOME\bin"

[System.Environment]::SetEnvironmentVariable("MAVEN_HOME", "$env:MAVEN_HOME", [System.EnvironmentVariableTarget]::User)
$currentPath = [System.Environment]::GetEnvironmentVariable("PATH", [System.EnvironmentVariableTarget]::User)
[System.Environment]::SetEnvironmentVariable("PATH", "$currentPath;$env:MAVEN_HOME\bin", [System.EnvironmentVariableTarget]::User)

Remove-Item $ZIP_FILE -Force

Write-Host "Maven instalado correctamente!" -ForegroundColor Green
Write-Host "Ejecuta 'mvn --version' en una nueva terminal para verificar" -ForegroundColor Yellow
