$instance = "NERDWHATS_AMERICA"
$secret = "THISISMYSECURETOKEN"
$baseUrl = "http://localhost:8080"

Write-Host "1. Generando token..." -ForegroundColor Yellow
$tokenResponse = Invoke-RestMethod -Uri "$baseUrl/api/$instance/$secret/generate-token" -Method POST
$token = $tokenResponse.token

Write-Host "Token: $($tokenResponse.token)" -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $token"
}

Write-Host ""
Write-Host "2. Verificando estado de sesión..." -ForegroundColor Yellow
$checkResponse = Invoke-RestMethod -Uri "$baseUrl/api/$instance/check-connection-session" -Method GET -Headers $headers

Write-Host "Status:" -ForegroundColor Cyan
$checkResponse | ConvertTo-Json -Depth 3

Write-Host ""
Write-Host "3. Iniciando sesión (QR)..." -ForegroundColor Yellow
$body = @{
    webhook = ""
    waitQrCode = $true
} | ConvertTo-Json

$sessionResponse = Invoke-RestMethod -Uri "$baseUrl/api/$instance/start-session" -Method POST -Headers $headers -Body $body -ContentType "application/json"

Write-Host "Session:" -ForegroundColor Cyan
$sessionResponse | ConvertTo-Json -Depth 3