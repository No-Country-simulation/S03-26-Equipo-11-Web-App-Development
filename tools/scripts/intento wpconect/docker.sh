#!/bin/bash

# Startup CRM - Docker Scripts

case "$1" in
  up)
    echo "🚀 Starting CRM + WPPConnect..."
    docker-compose up -d
    echo ""
    echo "📱 Abre http://localhost:8080 para escanear QR de WhatsApp"
    echo "🌐 CRM disponible en http://localhost:3000"
    ;;
  down)
    echo "🛑 Deteniendo servicios..."
    docker-compose down
    ;;
  logs)
    docker-compose logs -f
    ;;
  logs-wpp)
    docker-compose logs -f wppconnect
    ;;
  logs-next)
    docker-compose logs -f nextjs-crm
    ;;
  restart)
    echo "🔄 Reiniciando servicios..."
    docker-compose restart
    ;;
  status)
    docker-compose ps
    ;;
  clean)
    echo "🧹 Limpiando contenedores y volúmenes..."
    docker-compose down -v
    ;;
  *)
    echo "Usage: $0 {up|down|logs|logs-wpp|logs-next|restart|status|clean}"
    echo ""
    echo "Comandos:"
    echo "  up         - Iniciar todos los servicios"
    echo "  down       - Detener todos los servicios"
    echo "  logs       - Ver logs de todos los servicios"
    echo "  logs-wpp   - Ver logs de WPPConnect"
    echo "  logs-next  - Ver logs de Next.js"
    echo "  restart    - Reiniciar servicios"
    echo "  status     - Ver estado de contenedores"
    echo "  clean      - Eliminar contenedores y volúmenes"
    exit 1
    ;;
esac