# Despliegue de WAHA en Render

## Descripción

Este documento describe cómo desplegar el servicio WAHA (WhatsApp HTTP API) en Render para integración con el CRM de Startup CRM.

## Requisitos Previos

- Cuenta en [render.com](https://render.com)
- Docker instalado (para desarrollo local)
- Acceso a Internet

---

## Desarrollo Local (Puerto 4000)

### Estructura de Archivos

```
waha/
├── docker-compose.yaml    # Configuración del contenedor
├── .env                   # Variables de entorno
└── sessions/              # Sesiones de WhatsApp (persistencia local)
```

### Iniciar WAHA Local

```bash
cd waha
docker-compose up -d
```

### Verificar Estado

```bash
# Ver logs
docker-compose logs -f waha

# Ver estado del contenedor
docker-compose ps
```

### Endpoints Locales (Puerto 4000)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `http://localhost:4000/api/sessions` | GET | Listar todas las sesiones |
| `http://localhost:4000/api/sessions/default` | GET | Estado de sesión específica |
| `http://localhost:4000/api/sessions/default/start` | POST | Iniciar sesión |
| `http://localhost:4000/api/default/auth/qr` | GET | Obtener QR (imagen) |
| `http://localhost:4000/api/sendText` | POST | Enviar mensaje |

### Escanear QR y Conectar WhatsApp

1. Abrir el navegador en: `http://localhost:4000/dashboard`
2. Iniciar sesión con credentials del `.env`
3. Click en "Start Session" para la sesión `default`
4. Escanear el QR con WhatsApp en el teléfono
5. Esperar confirmación de conexión

### Detener WAHA

```bash
cd waha
docker-compose down
```

---

## Despliegue en Render (Producción)

### Configuración en Render Dashboard

1. **New** → **Web Service**
2. **Docker Image**: `devlikeapro/waha:latest`
3. **Name**: `waha-crm` (o nombre preferido)
4. **Region**: `Oregon` (gratis)
5. **Plan**: Free

### Environment Variables

| Variable | Valor |
|----------|-------|
| `WAHA_API_KEY` | `0148d3609e824423acf609c15f2b42b8` |
| `WAHA_DASHBOARD_USERNAME` | `admin` |
| `WAHA_DASHBOARD_PASSWORD` | `2aa3a2ee6ec4422c8299651f23831a54` |
| `WHATSAPP_SWAGGER_PASSWORD` | `2aa3a2ee6ec4422c8299651f23831a54` |
| `WAHA_SESSION` | `default` |

### Puerto

- **Puerto**: `3000` (Render expone en 3000 por defecto)

### URL de Render

Una vez desplegado, obtener la URL (ej: `https://waha-crm.onrender.com`)

---

## Actualizar CRM para Render

En el archivo `.env` del proyecto CRM:

```env
WHATSAPP_API_URL=https://waha-crm.onrender.com
WHATSAPP_API_KEY=0148d3609e824423acf609c15f2b42b8
```

---

## Limitaciones (Free Tier)

| Problema | Descripción |
|----------|-------------|
| Hibernación | Se duerme tras 15 min de inactividad |
| Disco efímero | Sesión se pierde al despertar |
| Cold Start | 30-60 segundos para despertar |

### Para Demo

1. Acceder a la URL de Render antes de la demo
2. Escanear QR después de cada despertar
3. Mantener activo durante la presentación

---

## Actualizar WAHA en Render (CLI)

### Instalar Render CLI

```bash
# Opción 1: Homebrew (macOS/Linux)
brew install render-oss/cli/render

# Opción 2: Directo (Linux/macOS)
curl -fsSL https://raw.githubusercontent.com/render-oss/cli/refs/heads/main/bin/install.sh | sh

# Opción 3: Windows (PowerShell)
winget install render-oss.cli
```

### Autenticarse

```bash
render login
# Ingresa tu email y autoriza en el navegador
```

### Comandos Útiles

```bash
# Listar servicios (obtener SERVICE_ID)
render services

# Actualizar/redesplegar servicio
render deploys create <SERVICE_ID> --image devlikeapro/waha:latest --wait

# Ver lista de despliegues
render deploys list <SERVICE_ID>

# Ver logs del servicio
render logs <SERVICE_ID>
```

### Actualizar sin CLI (Manual)

1. Ir a **Render Dashboard**
2. Seleccionar el servicio WAHA
3. Click **Manual Deploy** → **Deploy Latest**

---

## Notas

- El archivo `docker-compose.yaml` local usa puerto 4000 (no es necesario modificarlo para desarrollo local)
- En Render, el puerto se configura automáticamente a 3000
- Los endpoints funcionan igual en ambos entornos