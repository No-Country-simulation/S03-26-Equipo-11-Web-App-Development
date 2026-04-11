# Runbook: Deployment en Vercel

Guia paso a paso para desplegar Startup CRM en Vercel.

---

## Pre-requisitos

1. **Cuenta en Vercel**
   - Registrarse en [vercel.com](https://vercel.com)
   - Preferiblemente con GitHub

2. **GitHub Repository**
   - Codigo en un repositorio GitHub
   - Acceso desde Vercel

3. **Variables de Entorno**
   - Preparar valores para produccion (ver [environment-setup.md](environment-setup.md))

---

## Metodo 1: Deploy desde Vercel Dashboard (GUI)

### Paso 1: Importar Proyecto

1. Ir a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click en **Add New** > **Project**
3. Seleccionar **Import Git Repository**
4. Autorizar acceso a GitHub si es necesario
5. Buscar y seleccionar el repositorio `nextjs_crm`

### Paso 2: Configurar Proyecto

1. **Framework Preset**: `Next.js` (auto-detectado)
2. **Root Directory**: `./` (por defecto)
3. **Build Command**: `npm run build` (ya configurado)
4. **Output Directory**: `.next` (por defecto)

```
Configure Project
  |-- Build Command: npm run build
  |-- Output Directory: .next
  |-- Install Command: npm install
  |-- Development Command: npm run dev
```

### Paso 3: Variables de Entorno

1. Expandir **Environment Variables**
2. Agregar cada variable:

| Nombre | Valor (ejemplo) |
|--------|-----------------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `tu_email@gmail.com` |
| `SMTP_PASS` | `xxxx xxxx xxxx xxxx` |
| `IMAP_HOST` | `imap.gmail.com` |
| `IMAP_PORT` | `993` |
| `IMAP_USER` | `tu_email@gmail.com` |
| `IMAP_PASS` | `xxxx xxxx xxxx xxxx` |
| `FROM_EMAIL` | `tu_email@gmail.com` |
| `FROM_NAME` | `Startup CRM` |
| `NEXT_PUBLIC_APP_URL` | `https://tu-proyecto.vercel.app` |
| `EMAIL_SYNC_BATCH_SIZE` | `5` (opcional) |
| `EMAIL_SYNC_CRON_INTERVAL` | `*/3 * * * *` (opcional) |

> **Importante:** Marcar variables sensibles como **Secret**

### Paso 4: Deploy

1. Click en **Deploy**
2. Esperar build (~2-3 minutos)
3. Verificar en Preview URL

### Paso 5: Verificacion Post-Deploy

1. Abrir URL de preview
2. Verificar:
   - [ ] Pagina de inicio carga
   - [ ] Navegacion funciona
   - [ ] Dashboard muestra metricas
   - [ ] API health check: `https://tu-proyecto.vercel.app/api/health`

---

## Metodo 2: Deploy con Vercel CLI

### Instalacion

```bash
npm install -g vercel
```

### Login

```bash
vercel login
# Abrira navegador para autenticar
```

### Deploy Desarrollo

```bash
# Navegar al proyecto
cd d:/nc/002/nextjs_crm

# Deploy interactivo
vercel

# Opciones:
# - Set up and deploy: Y
# - Which scope: tu-cuenta
# - Link to existing project: N
# - Project name: nextjs-crm
# - Directory: ./
# - Override settings: N
```

### Deploy Produccion

```bash
vercel --prod
```

### Ver Logs

```bash
# Logs en tiempo real
vercel logs tu-proyecto

# Logs de un deployment especifico
vercel logs deployment-id

# Filtrar por nivel
vercel logs tu-proyecto --level=error
```

---

## Configurar Dominio Personalizado

### Paso 1: Agregar Dominio

1. Ir a **Project Settings** > **Domains**
2. Ingresar dominio: `crm.tustartup.com`
3. Click **Add**

### Paso 2: Configurar DNS

Vercel mostrara registros DNS a configurar:

```
Type    | Name | Value
CNAME   | crm  | cname.vercel-domains.com
```

### Paso 3: Verificar

```bash
# En tu proveedor DNS, agregar:
crm IN CNAME cname.vercel-domains.com
```

### Paso 4: Esperar Propagacion

- Vercel verifica automaticamente
- Puede tomar 24-48 horas para propagacion completa
- Puede tomar minutos si ya tienes otros dominios en Vercel

---

## Configurar vercel.json

El archivo `vercel.json` ya esta configurado en el proyecto con soporte para Cron Jobs:

```json
{
  "crons": [
    {
      "path": "/api/email/receive-sync",
      "schedule": "@every 3m"
    }
  ]
}
```

> **Nota:** El cron job se ejecutara automaticamente cada 3 minutos en produccion.

### Verificar Cron Jobs en Vercel

1. Ir a **Project** > **Functions** > **Cron Events**
2. Ver historial de ejecuciones
3. Verificar logs de cada ejecucion

### Endpoints de Monitoreo

| Endpoint | Descripcion |
|----------|-------------|
| `/api/email/receive-sync` | Ejecutar sincronizacion manualmente |
| `/api/email/sync-status` | Ver estado actual del sync |

---

## Variables de Entorno por Ambiente

### Desarrollo (.env.local)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=dev@gmail.com
SMTP_PASS=dev_password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=dev@gmail.com
IMAP_PASS=dev_password
FROM_EMAIL=dev@gmail.com
FROM_NAME=Startup CRM Dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Produccion (Vercel Dashboard)

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=prod@gmail.com
SMTP_PASS=prod_password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_USER=prod@gmail.com
IMAP_PASS=prod_password
FROM_EMAIL=prod@tu-dominio.com
FROM_NAME=Startup CRM
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

---

## Rollback (Reversar Deploy)

### Desde Dashboard

1. Ir a **Deployments**
2. Buscar el deployment actual
3. Click en **...** (tres puntos)
4. Seleccionar **Promote to Production**

### Desde CLI

```bash
# Ver deployments recientes
vercel list

# Revertir a version anterior
vercel rollback deployment-url
```

---

## Monitoreo Post-Deploy

### Vercel Analytics

1. Ir a **Project** > **Analytics**
2. Ver metricas:
   - Page Views
   - Unique Visitors
   - Performance
   - Core Web Vitals

### Health Check

```bash
curl https://tu-proyecto.vercel.app/api/health
```

Respuesta esperada:
```json
{"status":"ok","timestamp":"2026-04-04T00:00:00.000Z"}
```

---

## Troubleshooting

| Problema | Solucion |
|----------|----------|
| Build fails | Verificar Node.js version (18+) |
| Variables no cargan | Verificar nombres exactos en Dashboard |
| 500 en API routes | Ver logs con `vercel logs` |
| Domain no resuelve | Esperar DNS propagation |
| SSL expired | Vercel maneja automaticamente |

---

**Anterior**: [README](README.md)  
**Siguiente**: [Setup Local](setup-local.md)

**Volver a**: [Runbooks Index](README.md)
