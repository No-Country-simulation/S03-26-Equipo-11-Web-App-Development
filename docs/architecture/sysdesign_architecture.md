# System Design - Arquitectura y Deployment - Startup CRM

## Vision General

Startup CRM es una aplicacion web progresiva (PWA) construida con Next.js 16 que se despliega en Vercel. La arquitectura esta disenada para escalar horizontalmente mientras mantiene latencia minima y alta disponibilidad.

---

## Arquitectura de Alto Nivel

```
                                    +-------------------------+
                                    |       Internet          |
                                    +------------+------------+
                                                 |
                                    +------------v------------+
                                    |   Vercel Edge Network   |
                                    |   (CDN + DDoS Protection)|
                                    +------------+------------+
                                                 |
                                    +------------v------------+
                                    |   Vercel Gateway         |
                                    |   (Load Balancer)        |
                                    +------------+------------+
                                                 |
                         +-----------------------+-----------------------+
                         |                       |                       |
              +----------v----------+  +---------v---------+  +---------v---------+
              |   Region: us-east-1 |  | Region: eu-west |  | Region: sa-east-1|
              |   (Primary)         |  | (Secondary)     |  | (Latam users)   |
              +----------+---------+  +---------+---------+  +---------+---------+
                         |                       |                       |
              +----------v----------+  +---------v---------+  +---------v---------+
              |   Next.js Server    |  |  Next.js Server  |  |  Next.js Server  |
              |   (Node.js)         |  |  (Node.js)       |  |  (Node.js)       |
              +----------+---------+  +---------+---------+  +---------+---------+
                         |                       |                       |
              +----------v----------+  +---------v---------+  +---------v---------+
              |   API Routes        |  |   API Routes      |  |   API Routes      |
              |   - /api/email/*    |  |   (Read-only)    |  |   (Read-only)    |
              |   - /api/health     |  |                   |  |                   |
              +----------+---------+  +-------------------+  +-------------------+
                         |
                         |
              +----------v----------+
              |   External Services  |
              +----------+---------+
                         |
         +---------------+---------------+---------------+
         |               |               |               |
  +------v------+  +-----v------+  +-----v------+  +-----v------+
  |   Gmail     |  |   Gmail     |  | WhatsApp    |  |   Redis     |
  |   SMTP      |  |   IMAP      |  | Cloud API   |  |   Cache     |
  |   (Send)    |  |   (Recv)    |  | (Future)    |  |   (Future)  |
  +-------------+  +-------------+  +-------------+  +-------------+
```

---

## Diagrama de Componentes

```
+------------------+     +------------------+     +------------------+
|    Frontend      |     |    Backend       |     |   External      |
|    (React)       |     |    (Next.js)     |     |   Services      |
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
| - Pages          |<--->| - API Routes     |<--->| - SMTP Server   |
| - Components     |     | - Server Funcs   |     | - IMAP Server   |
| - Hooks         |     | - Middleware     |     | - WhatsApp API  |
| - Context       |     | - Auth (Future)  |     | - Database      |
| - Utils         |     |                  |     |                 |
+------------------+     +------------------+     +------------------+
        |                       |
        |                       |
        v                       v
+------------------+     +------------------+
|    Static        |     |   Vercel         |
|    Assets        |     |   Infrastructure |
+------------------+     +------------------+
|                  |     |                  |
| - Images         |     | - Edge Runtime   |
| - Fonts          |     | - Serverless    |
| - OpenAPI Spec   |     | - KV Storage    |
+------------------+     +------------------+
```

---

## Flujo de Datos

### Flujo: Solicitud de Pagina

```
User Browser
     |
     | 1. Request: GET /dashboard
     v
Vercel Edge Network
     |
     | 2. CDN Check (static assets)
     |    HIT -> Return cached
     |    MISS -> Continue
     v
Next.js Server (Region)
     |
     | 3. Route Match: /dashboard/page.tsx
     v
Page Component (Server/Client)
     |
     | 4. Data Fetch (if needed)
     v
Mock Data / API Call
     |
     | 5. Render HTML
     v
Response to Browser
     |
     | 6. Hydration (React)
     v
Interactive Page
```

### Flujo: Envio de Email

```
Frontend                 Backend                  External
   |                       |                        |
   | 1. Compose & Send     |                        |
   |---------------------->|                        |
   |                       |                        |
   |                       | 2. POST /api/email/send
   |                       |----------------------->|
   |                       |                        |
   |                       | 3. SMTP Handshake      |
   |                       |<---------------------->|
   |                       |                        |
   | 4. Response {status}  |                        |
   |<----------------------|                        |
   |                       |                        |
   | 5. Show Success Toast |                        |
   v                       v                        v
```

---

## Estructura de Archivos en Vercel

```
/
|-- .next/                 # Build output
|   |-- cache/            # ISR cache
|   |-- server/           # Server bundles
|   `-- static/           # Static chunks
|
|-- app/                  # Next.js App Router
|   |-- (crm)/           # Protected routes
|   |-- api/             # API routes
|   `-- page.tsx         # Landing page
|
|-- components/           # React components
|-- lib/                  # Utilities & services
|-- public/              # Static assets
|
|-- .env.local           # Local env vars
|-- vercel.json          # Vercel config
|-- next.config.ts       # Next.js config
`-- package.json
```

---

## Deployment Architecture

### Pipeline de CI/CD

```
+----------------+     +----------------+     +----------------+
|    GitHub      |     |    Vercel      |     |    Vercel      |
|    Repository  |---->|    Preview     |---->|    Production  |
+----------------+     +----------------+     +----------------+
|                  |     |                  |     |                  |
| Push to branch  |     | PR triggers      |     | Merge to main |
| - main          |     | preview deploy   |     | auto-deploy   |
| - feature/*     |     | - unique URL    |     | - instant     |
|                  |     | - shareable    |     | - atomic      |
+----------------+     +----------------+     +----------------+
```

### Environments

| Environment | Trigger | URL | Vars |
|-------------|---------|-----|------|
| **Preview** | PR opened | `*.vercel.app` | Development vars |
| **Development** | Local | `localhost:3000` | .env.local |
| **Production** | Merge to main | `your-app.vercel.app` | Production vars |

---

## Vercel Configuration

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  "env": {
    "SMTP_HOST": "@smtp-host",
    "SMTP_PORT": "@smtp-port",
    "SMTP_USER": "@smtp-user",
    "SMTP_PASS": "@smtp-pass"
  }
}
```

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }
    ],
    formats: ["image/avif", "image/webp"]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  }
};

export default nextConfig;
```

---

## Seguridad

### Headers de Seguridad

```typescript
// next.config.ts
headers: async () => [
  {
    source: "/:path*",
    headers: [
      { key: "X-DNS-Prefetch-Control", value: "on" },
      { key: "Strict-Transport-Security", value: "max-age=63072000" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-XSS-Protection", value: "1; mode=block" },
      { key: "Referrer-Policy", value: "origin-when-cross-origin" }
    ]
  }
]
```

### Variables de Entorno Seguras

| Variable | Tipo | Ubicacion |
|----------|------|-----------|
| SMTP_PASS | Secret | Vercel Dashboard |
| IMAP_PASS | Secret | Vercel Dashboard |
| NEXTAUTH_SECRET | Secret | Vercel Dashboard |
| DATABASE_URL | Secret | Vercel Dashboard |

---

## Monitoreo

### Vercel Analytics

```
Dashboard > Analytics
- Page Views
- Unique Visitors
- Performance Metrics
- Core Web Vitals
```

### Logs

```bash
# Ver logs en Vercel CLI
vercel logs your-project

# Ver logs de un deployment especifico
vercel logs deployment-id
```

### Health Check

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
}
```

---

## Escalabilidad

### Limites y Cuotas

| Recurso | Limite Vercel Free | Limite Vercel Pro |
|---------|-------------------|-------------------|
| Bandwidth | 100GB/mo | 1TB/mo |
| Serverless Functions | 100h/day | Unlimited |
| Concurrent Builds | 1 | 3 |
| Build Duration | 10min | 45min |

### Optimizaciones

1. **ISR (Incremental Static Regeneration)** - Para paginas semi-dinamicas
2. **Edge Caching** - CDN global de Vercel
3. **Image Optimization** - Next/Image con formatos modernos
4. **Bundle Optimization** - Dynamic imports para codigo pesado

---

## Future Scalability

### Agregar Base de Datos

```
Current: Mock Data
           |
           v
Future: PostgreSQL (Vercel Postgres)
           |
           v
Option: Redis Cache Layer
```

### Agregar Autenticacion

```
Current: Mock Auth
           |
           v
Future: NextAuth.js + Vercel Postgres
           |
           v
Option: Social Login (Google, GitHub)
```

---

**Volver a**: [Indice de Arquitectura](../architecture.md)
