$body = @{
    email = "test@test.com"
    password = "test1234"
    name = "Test"
    confirmPassword = "test1234"
} | ConvertTo-Json -Depth 3

$r = [System.Net.WebRequest]::Create("http://localhost:3000/api/auth/signup")
$r.Method = "POST"
$r.ContentType = "application/json"
$r.ServicePoint.Expect100Continue = $false
$sw = [System.IO.StreamWriter]::new($r.GetRequestStream())
$sw.Write($body)
$sw.Close()

try {
    $resp = $r.GetResponse()
    $sr = [System.IO.StreamReader]::new($resp.GetResponseStream())
    Write-Host "Status:" $resp.StatusCode
    Write-Host "Body:" $sr.ReadToEnd()
} catch {
    Write-Host "Status Code:" $_.Exception.Response.StatusCode
    $stream = $_.Exception.Response.GetResponseStream()
    $stream.Position = 0
    $sr = [System.IO.StreamReader]::new($stream)
    Write-Host "Body:" $sr.ReadToEnd()
}
