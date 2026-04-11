$token = "REPLACE_WITH_TOKEN"

$body = @{
    webhook = ""
    waitQrCode = $true
    proxy = @{
        url = ""
        username = ""
        password = ""
    }
} | ConvertTo-Json -Depth 3

$response = Invoke-WebRequest -Uri 'http://localhost:8080/api/default/start-session' -Method POST -Headers @{"Authorization" = "Bearer $token"} -Body $body -ContentType "application/json" -UseBasicParsing

$json = $response.Content | ConvertFrom-Json
$json | ConvertTo-Json -Depth 3

if ($json.qrcode) {
    Write-Host "`nQR Code received! Base64 image length: $($json.qrcode.Length)" -ForegroundColor Green
    Write-Host "Save the QR code base64 to a file or use a QR code viewer" -ForegroundColor Cyan
}