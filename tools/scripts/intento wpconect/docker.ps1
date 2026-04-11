# Startup CRM - Docker Scripts (Windows PowerShell)

param(
    [Parameter(Position=0)]
    [ValidateSet("up", "down", "logs", "logs-wpp", "logs-next", "restart", "status", "clean")]
    [string]$Action
)

switch ($Action) {
    "up" {
        Write-Host "Starting CRM + WPPConnect..." -ForegroundColor Green
        docker-compose up -d
        Write-Host ""
        Write-Host "Open http://localhost:8080 to scan WhatsApp QR" -ForegroundColor Cyan
        Write-Host "CRM available at http://localhost:3000" -ForegroundColor Cyan
    }
    "down" {
        Write-Host "Stopping services..." -ForegroundColor Yellow
        docker-compose down
    }
    "logs" {
        docker-compose logs -f
    }
    "logs-wpp" {
        docker-compose logs -f wppconnect
    }
    "logs-next" {
        docker-compose logs -f nextjs-crm
    }
    "restart" {
        Write-Host "Restarting services..." -ForegroundColor Yellow
        docker-compose restart
    }
    "status" {
        docker-compose ps
    }
    "clean" {
        Write-Host "Cleaning containers and volumes..." -ForegroundColor Yellow
        docker-compose down -v
    }
    default {
        Write-Host "Usage: .\docker.ps1 {up|down|logs|logs-wpp|logs-next|restart|status|clean}" -ForegroundColor White
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor White
        Write-Host "  up         - Start all services"
        Write-Host "  down       - Stop all services"
        Write-Host "  logs       - View all logs"
        Write-Host "  logs-wpp   - View WPPConnect logs"
        Write-Host "  logs-next  - View Next.js logs"
        Write-Host "  restart    - Restart services"
        Write-Host "  status     - View container status"
        Write-Host "  clean      - Remove containers and volumes"
        exit 1
    }
}