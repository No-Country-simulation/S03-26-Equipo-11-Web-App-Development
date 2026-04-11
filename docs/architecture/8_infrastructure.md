# Infrastructure - Startup CRM

## Despliegue en Vercel

**Vercel** es la plataforma de despliegue recomendada para este proyecto, optimizada para Next.js.

### Despliegue Rapido

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy en produccion
vercel --prod
```

### Configuracion (vercel.json)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "SMTP_HOST": "@smtp-host",
    "SMTP_PORT": "@smtp-port",
    "SMTP_USER": "@smtp-user",
    "SMTP_PASS": "@smtp-pass",
    "FROM_EMAIL": "@from-email",
    "IMAP_HOST": "@imap-host",
    "IMAP_PORT": "@imap-port",
    "IMAP_USER": "@imap-user",
    "IMAP_PASS": "@imap-pass"
  }
}
```

### Configurar Variables de Entorno en Vercel

```bash
vercel env add SMTP_HOST production
vercel env add SMTP_PORT production
vercel env add SMTP_USER production
vercel env add SMTP_PASS production
vercel env add FROM_EMAIL production
vercel env add FROM_NAME production
vercel env add IMAP_HOST production
vercel env add IMAP_PORT production
vercel env add IMAP_USER production
vercel env add IMAP_PASS production
vercel env add NEXT_PUBLIC_APP_URL production
```

### Dominio Personalizado (Opcional)

1. Ir a Vercel Dashboard > Project > Settings > Domains
2. Agregar dominio (ej: crm.tustartup.com)
3. Configurar DNS segun indicaciones de Vercel

---

## Otras Plataformas de Despliegue

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

---

## Variables de Entorno para Produccion

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

# App URL
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

---

## Arquitectura de Produccion

```
+------------------+
|   Vercel Edge   |
|   (CDN Global)  |
+--------+---------+
         |
+--------v---------+
|   Vercel Server |
|   (Lambda/Node) |
+--------+---------+
         |
+--------v---------+
|   External API  |
|   SMTP / IMAP   |
+------------------+
```

---

## Optimizaciones de Build

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["tu-cdn.com"],
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};
```

---

## Monitoreo y Logs

### Vercel Analytics

Vercel provee analytics integrado en el dashboard.

### Logs de Aplicacion

```typescript
// Estructured logging
console.log(JSON.stringify({
  level: "info",
  message: "Email sent",
  contactId: 123,
  timestamp: new Date().toISOString(),
}));
```

---

**Volver a**: [Indice de Arquitectura](../architecture.md)
