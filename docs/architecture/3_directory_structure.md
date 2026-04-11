# Directory Structure - Startup CRM

## Estructura Completa

```
D:\nc\002\nextjs_crm\
│
├── app/                              # App Router de Next.js
│   ├── (crm)/                        # Route group CRM
│   │   ├── contacts/
│   │   │   └── page.tsx             # Página de contactos
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Panel de control
│   │   ├── email/
│   │   │   └── page.tsx             # Cliente de email
│   │   ├── reminders/
│   │   │   └── page.tsx             # Recordatorios
│   │   ├── settings/
│   │   │   └── page.tsx             # Configuración
│   │   ├── whatsapp/
│   │   │   └── page.tsx             # WhatsApp
│   │   └── layout.tsx               # Layout CRM con sidebar
│   │
│   ├── api/                         # Rutas API
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   │   └── route.ts         # POST /api/auth/signin
│   │   │   ├── signup/
│   │   │   │   └── route.ts         # POST /api/auth/signup
│   │   │   ├── signout/
│   │   │   │   └── route.ts         # POST /api/auth/signout
│   │   │   ├── get-session/
│   │   │   │   └── route.ts         # GET /api/auth/get-session
│   │   │   └── [...all]/
│   │   │       └── route.ts         # Catch-all auth
│   │   │
│   │   ├── dashboard/
│   │   │   └── route.ts             # GET /api/dashboard
│   │   │
│   │   ├── email/
│   │   │   ├── send/
│   │   │   │   └── route.ts         # POST /api/email/send
│   │   │   ├── receive/
│   │   │   │   └── route.ts         # GET /api/email/receive
│   │   │   ├── receiveOne/
│   │   │   │   └── route.ts         # POST /api/email/receiveOne
│   │   │   ├── sync-status/
│   │   │   │   └── route.ts         # GET /api/email/sync-status
│   │   │   └── receive-sync/
│   │   │       └── route.ts         # GET /api/email/receive-sync
│   │   │
│   │   └── health/
│   │       └── route.ts             # GET /api/health
│   │
│   ├── api-docs/
│   │   └── page.tsx                 # Documentación Swagger
│   │
│   ├── login/
│   │   └── page.tsx                 # Página de login
│   │
│   ├── register/
│   │   └── page.tsx                 # Página de registro
│   │
│   ├── globals.css                  # Tailwind CSS v4
│   ├── layout.tsx                  # Layout raíz
│   └── page.tsx                    # Landing page
│
├── components/                      # Componentes React
│   ├── api-docs/
│   │   └── swagger-api-docs.tsx    # Wrapper Swagger UI
│   │
│   ├── landing/                     # Componentes landing page
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── Footer.tsx
│   │   ├── WhatWeDoSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── OurClientsSection.tsx
│   │   └── OurProductsSection.tsx
│   │
│   └── ui/                         # Componentes UI base
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       ├── select.tsx
│       ├── tabs.tsx
│       └── textarea.tsx
│
├── lib/                             # Lógica de negocio
│   ├── auth/
│   │   ├── index.ts                # Configuración better-auth
│   │   ├── session.ts               # Utilidades de sesión
│   │   ├── client-session.tsx       # Componente sesión cliente
│   │   ├── ensure-auth-schema.ts    # Schema validación Zod
│   │   └── forward-auth-request.ts  # Forward auth headers
│   │
│   ├── db/
│   │   ├── index.ts                 # DB client drizzle
│   │   ├── schema.ts                # Schema DB
│   │   └── auth-schema.ts           # Schema auth (users, sessions, accounts)
│   │
│   ├── data/
│   │   └── mockData.ts             # Datos mock y tipos
│   │
│   ├── email/
│   │   ├── emailService.ts         # Servicio SMTP
│   │   ├── imapService.ts          # Servicio IMAP
│   │   ├── syncService.ts          # Servicio sincronización
│   │   └── types.ts                # Tipos de email
│   │
│   ├── exportUtils.ts              # Exportación CSV/PDF
│   ├── swagger.ts                  # Spec OpenAPI
│   └── utils.ts                    # Utilidades (cn())
│
├── types/                           # Declaraciones TypeScript
│   └── swagger-ui-bundle.d.ts
│
├── public/                          # Archivos estáticos
│   ├── logo-scrm.png
│   ├── dashboard-preview.png
│   └── openapi.json                # Spec OpenAPI estático
│
├── docs/                            # Documentación
│   ├── architecture/               # Documentación de arquitectura
│   │   ├── 0_overview.md
│   │   ├── 1_stack.md
│   │   ├── 2_data_model.md
│   │   ├── 3_directory_structure.md
│   │   ├── 4_routes_access.md
│   │   ├── 5_api_rest.md
│   │   ├── 6_patterns.md
│   │   ├── 7_seo.md
│   │   ├── 8_infrastructure.md
│   │   ├── 9_data_flows.md
│   │   ├── 10_environment.md
│   │   ├── 11_components.md
│   │   ├── 12_features.md
│   │   ├── architecture.md         # Índice
│   │   ├── sysdesign_architecture.md
│   │   ├── sysdesign_ui_ux.md
│   │   └── tests/
│   ├── decisions/                  # Architecture Decision Records
│   ├── runbooks/                   # Guías de operación
│   └── tests/
│       └── architecture.md         # Arquitectura (legacy)
│
├── .env.example                     # Variables de entorno template
├── AGENTS.md                        # Guías para agentes IA
├── next.config.ts                   # Configuración Next.js
├── package.json                     # Dependencias
├── tsconfig.json                    # Configuración TypeScript
├── postcss.config.mjs              # PostCSS (Tailwind v4)
├── eslint.config.mjs               # ESLint 9
└── vercel.json                     # Configuración Vercel
```

---

## Descripción de Directorios

### `app/`

Contiene todas las rutas de la aplicación usando el App Router de Next.js. El route group `(crm)` agrupa las páginas del panel CRM con su layout compartido.

### `components/`

| Subdirectorio | Propósito |
|---------------|-----------|
| `ui/` | Componentes UI fundamentales y reutilizables |
| `landing/` | Componentes específicos de la landing page |
| `api-docs/` | Componentes para documentación de API |

### `lib/`

| Subdirectorio | Propósito |
|---------------|-----------|
| `auth/` | Configuración better-auth y utilidades de sesión |
| `db/` | Schema y cliente de base de datos (Drizzle) |
| `data/` | Datos mock e interfaces TypeScript |
| `email/` | Servicios de email (SMTP, IMAP) |

### `public/`

Archivos estáticos servidos directamente: imágenes, fuentes, spec OpenAPI.

---

## Alias de Rutas

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Ejemplos de Uso

| Alias | Ruta Absoluta |
|-------|---------------|
| `@/components/ui/button` | `D:\nc\002\nextjs_crm\components\ui\button.tsx` |
| `@/lib/data/mockData` | `D:\nc\002\nextjs_crm\lib\data\mockData.ts` |
| `@/app/(crm)/dashboard` | `D:\nc\002\nextjs_crm\app\(crm)\dashboard` |

---

**Volver a**: [Índice de Arquitectura](../architecture.md)
