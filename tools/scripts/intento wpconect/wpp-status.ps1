# Check session status and connection
$instance = "NERDWHATS_AMERICA"
$secret = "THISISMYSECURETOKEN"
$baseUrl = "http://localhost:8080"

# Generate token
$tokenResponse = Invoke-RestMethod -Uri "$baseUrl/api/$instance/$secret/generate-token" -Method POST
$token = $tokenResponse.token

Write-Host "Token generated" -ForegroundColor Cyan

$headers = @{
    "Authorization" = "Bearer $token"
}

# Check session status
Write-Host ""
Write-Host "Session Status:" -ForegroundColor Green
$response = Invoke-RestMethod -Uri "$baseUrl/api/$instance/check-connection-session" -Method GET -Headers $headers
$response | ConvertTo-Json -Depth 3