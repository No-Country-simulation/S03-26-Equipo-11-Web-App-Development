$instance = "NERDWHATS_AMERICA"
$secret = "THISISMYSECURETOKEN"
$baseUrl = "http://localhost:8080"

Write-Host "1. Generando token..." -ForegroundColor Yellow
$t = Invoke-RestMethod -Uri "$baseUrl/api/$instance/$secret/generate-token" -Method POST
$h = @{Authorization = "Bearer $($t.token)"}

Write-Host ""
Write-Host "2. Solicitando codigo de emparejamiento (pairing code)..." -ForegroundColor Yellow

$body = @{
    phoneNumber = "+59167023053"
} | ConvertTo-Json

try {
    $r = Invoke-RestMethod -Uri "$baseUrl/api/$instance/send-pairing-code" -Method POST -Headers $h -Body $body -ContentType "application/json"
    Write-Host ""
    Write-Host "CODIGO DE EMPAREJAMIENTO:" -ForegroundColor Green
    $r | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "3. Generando QR..." -ForegroundColor Yellow
    
    $qrBody = @{
        webhook = ""
        waitQrCode = $true
    } | ConvertTo-Json
    
    $qr = Invoke-RestMethod -Uri "$baseUrl/api/$instance/start-session" -Method POST -Headers $h -Body $qrBody -ContentType "application/json"
    
    if ($qr.qrcode) {
        $qrBase64 = $qr.qrcode -replace "^data:image/png;base64,", ""
        $qrBytes = [System.Convert]::FromBase64String($qrBase64)
        $qrBytes | Set-Content -Path "$PSScriptRoot\..\wpp-qrcode.png" -Encoding Byte
        Write-Host "QR guardado en wpp-qrcode.png" -ForegroundColor Green
    }
    
    $qr | ConvertTo-Json -Depth 3
}