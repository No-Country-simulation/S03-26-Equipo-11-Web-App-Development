# Startup CRM

Sistema CRM inteligente disenado especificamente para startups, con integracion nativa a WhatsApp y correo electronico.

---

## Descripcion del Proyecto

**Startup CRM** permite gestionar relaciones con leads y clientes en tiempo real, centralizando conversaciones, automatizando seguimientos y segmentando usuarios eficientemente.

### Sector de Negocio
**Cross-Industry (Multisectorial)** - Disenado para startups de cualquier industria.

### Objetivo
Desarrollar un sistema CRM inteligente con integracion nativa a WhatsApp y correo electronico. La herramienta centralizara las conversaciones, automatizara los seguimientos y permitira una segmentacion eficiente de los usuarios, garantizando una experiencia fluida, sencilla, colaborativa y asincronica.

---

## Requerimientos Funcionales

- **Gestion de contactos:** Segmentacion detallada segun el estado dentro del funnel (embudo de ventas).
- **Omnicanalidad:** Integracion fluida de canales de comunicacion (WhatsApp + Email).
- **Gestion de correos:** 
  - Envio de emails con registro automatico en base de datos
  - Recepcion automatica de emails via IMAP ("El Cartero Programado")
  - Plantillas y etiquetas
- **Automatizacion:** Configuracion de recordatorios automaticos para tareas y seguimientos.
- **Analitica:** Panel de metricas integrado para el analisis de datos.
- **Exportacion de datos:** Generacion de reportes y descarga de informacion en formatos CSV o PDF.
- **Personalizacion:** Configuracion de etiquetas, vistas personalizadas y guardado de filtros.

---

## Integraciones Externas

- **WhatsApp Cloud API** (Meta) - Mensajeria WhatsApp
- **API SMTP** - Servicio de envio de emails (nodemailer)

---

## Entregables Esperados

- Prototipo funcional con flujos basicos de gestion de usuarios, comunicacion y segmentacion.
- Panel de metricas operacionales con visualizacion de KPIs clave (contactos activos, mensajes enviados, tasa de respuesta).
- Documentacion tecnica detallada sobre los endpoints y guia de instalacion.

---

## Tecnologias

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript 5 |
| Estilos | Tailwind CSS v4, Radix UI |
| Email | nodemailer (SMTP), IMAP, mailparser |
| Iconos | lucide-react |
| Graficos | recharts |
| Docs | OpenAPI Spec |
| Despliegue | **Vercel** |
| QA/Lint | **Husky**, lint-staged, ESLint |

---

## Ejecutar el Proyecto

### Requisitos Previos

- Node.js >= 18.17.0
- npm >= 9.0.0

### Instalacion

```bash
# Clonar el repositorio
git clone <repo-url>
cd nextjs_crm

# Instalar dependencias
npm install
```

### Variables de Entorno

Crear archivo .env con las siguientes variables:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# IMAP Configuration
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_USER=tu_email@gmail.com
IMAP_PASS=tu_app_password

# Email Defaults
FROM_EMAIL=tu_email@gmail.com
FROM_NAME=Startup CRM

# Database (Local SQLite)
DATABASE_URL=file:./tools/scripts/data/crm.db

# Email Sync - "El Cartero Programado" (opcional, defaults aplicados)
EMAIL_SYNC_BATCH_SIZE=5
EMAIL_SYNC_CRON_INTERVAL=*/3 * * * *

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Nota:** Para Gmail, habilita 2FA y usa una contrasena de aplicacion.

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

### Produccion

```bash
# Build
npm run build

# Start produccion
npm run start
```

### Linting

```bash
# Verificar linting manualmente
npm run lint
```

> **Husky** esta configurado para verificar codigo antes de commit y push:
> - `pre-commit`: Ejecuta lint-staged en archivos modificados
> - `pre-push`: Ejecuta lint completo antes de push

---

## Despliegue en Vercel

El proyecto esta configurado para desplegarse en **Vercel**.

### Caracteristicas Incluidas

- **Cron Jobs:** Sincronizacion automatica de emails entrantes cada 3 minutos
- **API Endpoints:** Gestion de emails, contactos, recordatorios
- **Swagger UI:** Documentacion interactiva en `/api-docs`

### Deploy Rapido

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy (desarrollo)
vercel

# Deploy en produccion
vercel --prod
```

### Variables de Entorno en Vercel

Configurar las siguientes variables en el dashboard de Vercel:

| Variable | Valor |
|----------|-------|
| SMTP_HOST | smtp.gmail.com |
| SMTP_PORT | 465 |
| SMTP_SECURE | true |
| SMTP_USER | tu_email@gmail.com |
| SMTP_PASS | tu_app_password |
| IMAP_HOST | imap.gmail.com |
| IMAP_PORT | 993 |
| IMAP_USER | tu_email@gmail.com |
| IMAP_PASS | tu_app_password |
| FROM_EMAIL | tu_email@gmail.com |
| FROM_NAME | Startup CRM |
| NEXT_PUBLIC_APP_URL | https://tu-proyecto.vercel.app |
| EMAIL_SYNC_BATCH_SIZE | 5 (opcional) |
| EMAIL_SYNC_CRON_INTERVAL | */3 * * * * (opcional) |

### Verificar Cron Jobs

Despues del deploy, verificar en:
- **Vercel Dashboard** → Project → Cron Events
- **Endpoint** → `GET /api/email/sync-status`

### Dominio Personalizado

1. Ir a Project > Settings > Domains
2. Agregar dominio personalizado
3. Configurar DNS segun indicaciones de Vercel

### Configuracion (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "SMTP_HOST": "@smtp-host",
    "NEXT_PUBLIC_APP_URL": "@app-url"
  }
}
```

---

## Estructura del Proyecto

```
nextjs_crm/
|-- app/                    # App Router
|   |-- (crm)/             # Route group CRM
|   |   |-- dashboard/     # Panel de control
|   |   |-- contacts/     # Gestion de contactos
|   |   |-- email/        # Cliente de email
|   |   |-- whatsapp/     # Mensajeria WhatsApp
|   |   |-- reminders/    # Recordatorios
|   |   |-- settings/     # Configuracion
|   |-- api/              # API Routes
|   |-- login/            # Autenticacion
|   |-- page.tsx          # Landing page
|-- components/
|   |-- ui/               # Componentes base (Radix)
|   |-- landing/          # Componentes landing
|-- lib/
|   |-- data/             # Datos mock y tipos
|   |-- email/            # Servicios SMTP/IMAP
|   |-- utils.ts         # Utilidades
|-- docs/
|   |-- architecture/     # Documentacion tecnica
```

---

## Documentacion

- [Arquitectura del Proyecto](docs/architecture/architecture.md)
- [API Endpoints](docs/architecture/5_api_rest.md)
- [Variables de Entorno](docs/architecture/10_environment.md)
- [Infraestructura y Despliegue](docs/architecture/8_infrastructure.md)

# WhatsApp - WAHA

El CRM integra WhatsApp mediante **WAHA** (WhatsApp HTTP API - self-hosted). WAHA es una alternativa open source que permite controlar WhatsApp Web programmatically sin necesidad de cuenta empresarial.

> **Nota:** Anteriormente se usaba WPPConnect. Ahora se usa WAHA por mejor estabilidad y más features.

### Arquitectura

```
┌─────────────┐                    ┌──────────────────┐
│   Vercel    │                    │    Docker         │
│  (CRM API)  │  ──────HTTP─────▶│    (WAHA)        │
│  + Auth ✓   │                    │   Puerto 4000    │
└─────────────┘                    └──────────────────┘
       │                                   │
       ▼                                   ▼
┌─────────────┐                    ┌──────────────────┐
│   Turso     │                    │  WhatsApp        │
│  (mensajes) │                    │  (dispositivo)   │
└─────────────┘                    └──────────────────┘
```

### Variables de Entorno

Agregar en `.env`:

```env
# WhatsApp - WAHA
WHATSAPP_API_URL=http://localhost:4000
WHATSAPP_API_KEY=0148d3609e824423acf609c15f2b42b8
WHATSAPP_SESSION=default
```

| Variable | Descripción | Default |
|----------|-------------|---------|
| `WHATSAPP_API_URL` | URL del servidor WAHA | `http://localhost:4000` |
| `WHATSAPP_API_KEY` | API Key de WAHA | (generado por WAHA) |
| `WHATSAPP_SESSION` | Nombre de sesión | `default` |

### Configuración de WAHA

#### Docker (Desarrollo)

```bash
# Directorio: waha/
cd waha

# Iniciar contenedor
docker compose up -d

# Ver estado
docker ps
```

El servidor estará en `http://localhost:4000`. Abre el dashboard en el navegador y escanea el QR desde tu WhatsApp.

**Dashboard:** http://localhost:4000/dashboard
- Usuario: admin
- Contraseña: (configurada en .env)

#### Puerto 4000

WAHA usa el puerto 4000 para desarrollo (el 3000 es del CRM).

### Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/whatsapp` | Listar contactos WhatsApp + sync automático |
| GET | `/api/whatsapp/[contactId]` | Ver mensajes de un contacto |
| POST | `/api/whatsapp/send` | Enviar mensaje |
| POST | `/api/whatsapp/sync` | Sincronizar mensajes entrantes |

**Headers requeridos** (todos los endpoints):
```
Cookie: better-auth.session_token=<token>
```

#### GET /api/whatsapp

Lista contactos con quienes has conversado por WhatsApp. **Hace sync automático** cada vez que se consulta.

```bash
curl -X GET http://localhost:3000/api/whatsapp?limit=20 \
  -H "Cookie: better-auth.session_token=<token>"
```

#### GET /api/whatsapp/[contactId]

Lista mensajes de un contacto específico.

```bash
curl -X GET "http://localhost:3000/api/whatsapp/<CONTACT_ID>?limit=20" \
  -H "Cookie: better-auth.session_token=<token>"
```

#### POST /api/whatsapp/send

Envía un mensaje de texto.

```bash
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=<token>" \
  -d '{"to": "+59167023053", "text": "Hola desde el CRM!"}'
```

#### POST /api/whatsapp/sync

Sincroniza mensajes entrantes desde WAHA.

```bash
curl -X POST http://localhost:3000/api/whatsapp/sync \
  -H "Cookie: better-auth.session_token=<token>"
```

### Pruebas

Ver archivos en `docs/tests/`:
- `waha.http` - Tests de WAHA directo
- `whatsapp.http` - Tests del CRM
- `whatsapp-results.md` - Resultados de testing

---

## Equipo de Desarrollo (Equipo 11)

| Nombre | Rol | GitHub |
|--------|-----|--------|
| **Carla Vallejos Ari** | Full Stack Developer | [vallejos12ari](https://github.com/vallejos12ari) |
| **Daniel Lorenzo Ramos** | Backend Developer | [LazaroTupo](https://github.com/LazaroTupo) |
| **Rodrigo Fernandez** | Backend Developer | [rodri9891](https://github.com/rodri9891) |
| **Favian Fernando Medina Gemio** | Backend Developer | [fabinnerself](https://github.com/fabinnerself) |
| **Mario Isaac Alberto Cortez** | Backend Developer | [mariocortezBEST](https://github.com/mariocortezBEST) |
| **Anghelo Flores** | Backend Developer | [evanghel1on](https://github.com/evanghel1on) |

---

## Estado del Proyecto

### Módulos Completados

| Módulo | Estado | Notas |
|--------|--------|-------|
| **Autenticación** | ✅ Completo | Login, Registro, Sesión, Logout |
| **Dashboard CRM** | ✅ Completo | KPIs, Gráficos, Fetch a API |
| **Landing Page** | ✅ Completo | Frontend funcional |
| **Contactos** | ✅ En Desarrollo | Frontend funcional, CRUD backend pendiente |
| **WhatsApp** | ✅ Completo | Frontend UI + Backend API funcionales con WAHA |
| **Emails** | ✅ En Desarrollo | Frontend funcional, sync pendiente |
 
### Endpoints API Implementados

| # | Método | Ruta | Descripción |
|---|--------|------|-------------|
| 1 | POST | `/api/auth/signin` | Iniciar sesión |
| 2 | POST | `/api/auth/signup` | Registrar usuario |
| 3 | POST | `/api/auth/signout` | Cerrar sesión |
| 4 | GET | `/api/auth/get-session` | Obtener sesión actual |
| 5 | POST | `/api/email/send` | Enviar email (SMTP) |
| 6 | GET | `/api/email/receive` | Recibir emails (IMAP) |
| 7 | POST | `/api/email/receiveOne` | Email específico |
| 8 | GET | `/api/email/sync-status` | Estado sincronización |
| 9 | GET | `/api/email/receive-sync` | Sincronizar emails |
| 10 | GET | `/api/dashboard` | Métricas KPIs y gráficos |
| 11 | GET | `/api/health` | Health check |
| 12 | GET | `/api/whatsapp` | Listar contactos WhatsApp |
| 13 | GET | `/api/whatsapp/[contactId]` | Mensajes de contacto |
| 14 | POST | `/api/whatsapp/send` | Enviar mensaje WhatsApp |
| 15 | POST | `/api/whatsapp/sync` | Sincronizar mensajes entrantes |
| 16 | GET | `/api/contacts` | Listar todos los contactos |
| 17 | POST | `/api/contacts` | Crear nuevo contacto |
| 18 | PUT | `/api/contacts/[id]` | Actualizar contacto |
| 19 | DELETE | `/api/contacts/[id]` | Eliminar contacto |
| 20 | GET | `/api/contacts/stats` | Estadísticas de contactos |

 

---

## Learn More

- [Documentacion Next.js](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)


> [!NOTE]
> Aqui tienes una nota especial

> [!TIP]
> Tip cobsejo

> [!IMPORTANT]
> Aqui tienes un consejo

> [!WARNING]
> Aqui tienes una adevertencia

