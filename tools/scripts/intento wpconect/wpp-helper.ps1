# Get token
$r1 = Invoke-WebRequest -Uri "http://localhost:8080/api/default/THISISMYSECURETOKEN/generate-token" -Method POST -UseBasicParsing
$j1 = $r1.Content | ConvertFrom-Json
$token = $j1.token  # Use 'token' not 'full'

Write-Host "Generated token: $($token.Substring(0, 40))..." -ForegroundColor Cyan

# Start session with token
$body = @{
    webhook = ""
    waitQrCode = $true
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
}

$r2 = Invoke-WebRequest -Uri "http://localhost:8080/api/default/start-session" -Method POST -Headers $headers -Body $body -ContentType "application/json" -UseBasicParsing

$j2 = $r2.Content | ConvertFrom-Json
$j2 | ConvertTo-Json -Depth 3