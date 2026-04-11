$r = Invoke-WebRequest -Uri "http://localhost:8080/swagger.json" -UseBasicParsing
$r.Content | Out-File -FilePath "$PSScriptRoot\..\wpp-swagger.json" -Encoding UTF8
Write-Host "Saved to wpp-swagger.json"

$json = $r.Content | ConvertFrom-Json
Write-Host ""
Write-Host "Paths available:" -ForegroundColor Cyan
$json.paths.PSObject.Properties.Name | Select-Object -First 30