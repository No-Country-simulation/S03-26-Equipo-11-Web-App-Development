# Generate QR Code image for WhatsApp
$instance = "NERDWHATS_AMERICA"
$secret = "THISISMYSECURETOKEN"
$baseUrl = "http://localhost:8080"

Write-Host "Generando QR Code..." -ForegroundColor Yellow

$tokenResponse = Invoke-RestMethod -Uri "$baseUrl/api/$instance/$secret/generate-token" -Method POST
$token = $tokenResponse.token

$headers = @{
    "Authorization" = "Bearer $token"
}

$body = @{
    webhook = ""
    waitQrCode = $true
} | ConvertTo-Json

$sessionResponse = Invoke-RestMethod -Uri "$baseUrl/api/$instance/start-session" -Method POST -Headers $headers -Body $body -ContentType "application/json"

# Get base64 QR code (remove data:image/png;base64, prefix)
$qrBase64 = $sessionResponse.qrcode -replace "^data:image/png;base64,", ""

# Convert base64 to bytes
$qrBytes = [System.Convert]::FromBase64String($qrBase64)

# Save as PNG
$qrBytes | Set-Content -Path "$PSScriptRoot\..\wpp-qrcode.png" -Encoding Byte

Write-Host ""
Write-Host "QR Code guardado en: wpp-qrcode.png" -ForegroundColor Green
Write-Host ""
Write-Host "INSTRUCCIONES:" -ForegroundColor Cyan
Write-Host "1. Abre wpp-qrcode.png en tu computadora" -ForegroundColor White
Write-Host "2. En WhatsApp de tu teléfono: Settings > Linked Devices > Link Device" -ForegroundColor White
Write-Host "3. Escanea el código QR" -ForegroundColor White
Write-Host "4. Después de escanear, verifica el estado con: .\scripts\test-wpp.ps1 status" -ForegroundColor White
Write-Host ""
Write-Host "URL Code:" -ForegroundColor Yellow
Write-Host $sessionResponse.urlcode