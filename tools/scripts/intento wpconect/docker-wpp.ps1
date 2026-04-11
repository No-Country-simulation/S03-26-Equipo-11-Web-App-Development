# Startup CRM - WPPConnect Only Scripts (Windows PowerShell)

param(
    [Parameter(Position=0)]
    [ValidateSet("up", "down", "logs", "restart", "status", "clean")]
    [string]$Action
)

switch ($Action) {
    "up" {
        Write-Host "Starting WPPConnect..." -ForegroundColor Green
        docker-compose -f docker-compose.wppconnect.yml up -d
        Write-Host ""
        Write-Host "Open http://localhost:8080 to scan WhatsApp QR" -ForegroundColor Cyan
    }
    "down" {
        Write-Host "Stopping WPPConnect..." -ForegroundColor Yellow
        docker-compose -f docker-compose.wppconnect.yml down
    }
    "logs" {
        docker-compose -f docker-compose.wppconnect.yml logs -f
    }
    "restart" {
        Write-Host "Restarting WPPConnect..." -ForegroundColor Yellow
        docker-compose -f docker-compose.wppconnect.yml restart
    }
    "status" {
        docker-compose -f docker-compose.wppconnect.yml ps
    }
    "clean" {
        Write-Host "Removing WPPConnect container..." -ForegroundColor Yellow
        docker-compose -f docker-compose.wppconnect.yml down
    }
    default {
        Write-Host "Usage: .\docker-wpp.ps1 {up|down|logs|restart|status|clean}" -ForegroundColor White
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor White
        Write-Host "  up       - Start WPPConnect"
        Write-Host "  down     - Stop WPPConnect"
        Write-Host "  logs     - View logs"
        Write-Host "  restart  - Restart"
        Write-Host "  status   - View status"
        Write-Host "  clean    - Remove container"
        exit 1
    }
}