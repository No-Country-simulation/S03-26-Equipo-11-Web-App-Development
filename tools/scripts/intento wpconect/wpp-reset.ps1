# Close and restart WPPConnect session
$r1 = Invoke-WebRequest -Uri "http://localhost:8080/api/default/THISISMYSECURETOKEN/generate-token" -Method POST -UseBasicParsing
$j1 = $r1.Content | ConvertFrom-Json
$token = $j1.token

$headers = @{"Authorization" = "Bearer $token"}

Write-Host "Closing any existing session..." -ForegroundColor Yellow

# Try to close session first
try {
    $rClose = Invoke-WebRequest -Uri "http://localhost:8080/api/default/logout-session" -Method POST -Headers $headers -UseBasicParsing -ErrorAction Stop
    Write-Host "Session closed" -ForegroundColor Cyan
} catch {
    Write-Host "No active session to close" -ForegroundColor Cyan
}

Start-Sleep -Seconds 2

# Start new session
$body = @{
    webhook = ""
    waitQrCode = $true
} | ConvertTo-Json

Write-Host "Generating new QR code..." -ForegroundColor Yellow

$r2 = Invoke-WebRequest -Uri "http://localhost:8080/api/default/start-session" -Method POST -Headers $headers -Body $body -ContentType "application/json" -UseBasicParsing
$j2 = $r2.Content | ConvertFrom-Json

# Save QR code image
$qrBase64 = $j2.qrcode -replace "^data:image/png;base64,", ""
$qrBytes = [System.Convert]::FromBase64String($qrBase64)
$qrBytes | Set-Content -Path "$PSScriptRoot\..\wpp-qrcode.png" -Encoding Byte

Write-Host "New QR Code saved to: wpp-qrcode.png" -ForegroundColor Green
Write-Host ""
Write-Host "INSTRUCTIONS:" -ForegroundColor Cyan
Write-Host "1. Make sure WhatsApp on your PHONE is logged in and working" -ForegroundColor White
Write-Host "2. Open wpp-qrcode.png on your COMPUTER" -ForegroundColor White
Write-Host "3. On your PHONE: WhatsApp > Settings > Linked Devices > Link Device" -ForegroundColor White
Write-Host "4. Tap the QR icon and scan the image" -ForegroundColor White
Write-Host "5. If it fails, wait 30 seconds and try again" -ForegroundColor White
Write-Host ""
Write-Host "URL Code:" -ForegroundColor Yellow
Write-Host $j2.urlcode