<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Guidelines for Startup CRM

## Project Overview

**Startup CRM** es un sistema CRM inteligente diseñado específicamente para startups, con integración nativa a WhatsApp y correo electrónico. Permite gestionar relaciones con leads y clientes en tiempo real, centralizando conversaciones, automatizando seguimientos y segmentando usuarios eficientemente.

### Características Clave
- **Omnicanalidad**: Integración nativa WhatsApp + Email
- **Embudo de Ventas**: Segmentación de contactos por etapa
- **Automatización**: Recordatorios y seguimientos automáticos
- **Analítica**: Panel de métricas con KPIs clave
- **Exportación**: CSV y PDF para reportes

### Equipo de Desarrollo (Equipo 11)
- Carla Vallejos Ari, Ricardo Thalhuen Moraga Cortez, Daniel Lorenzo Ramos, Rodrigo Fernández, Favian Medina, Mario Cortez, Anghelo Flores

---

## Stack

### Core
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety (strict mode enabled)

### UI & Styling
- **Tailwind CSS v4** - CSS-first configuration (no tailwind.config.js)
- **Radix UI** - Accessible UI primitives (Dialog, Label, Slot, Tabs, Select)
- **lucide-react** - Icon library
- **recharts** - Charts for dashboard
- **clsx** + **tailwind-merge** - Class name utility (`cn()` helper)

### Integraciones Externas
- **WhatsApp Cloud API** (Meta) - Mensajería WhatsApp
- **SMTP** - Envío de emails

### Email
- **nodemailer** - SMTP email sending
- **imap** + **mailparser** - IMAP email receiving/parsing

### Auth
- **Better Auth** - Authentication and sessions

### API & Documentation
- **openapi3-ts** - OpenAPI Spec generation
- **ESLint 9** - Linting with `eslint-config-next`

### Utilities
- **date-fns** - Date formatting

---

## Requerimientos Funcionales

| Requerimiento | Descripción |
|---------------|-------------|
| Gestión de Contactos | Segmentación por funnel (new, contacted, qualified, proposal, won, lost) |
| Omnicanalidad | Integración fluida WhatsApp + Email |
| Gestión de Emails | Envío/registro con etiquetas y plantillas |
| Automatización | Recordatorios automáticos para tareas y seguimientos |
| Analítica | Panel de métricas con KPIs (contactos activos, mensajes enviados, tasa de respuesta) |
| Exportación | Generación de reportes CSV y PDF |
| Personalización | Etiquetas, vistas personalizadas, filtros guardados |

---

## Build/Lint/Test Commands

**No test framework is currently configured.** If adding tests, use Vitest (compatible with Vite/Next.js) and add test scripts to package.json.

---

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** (`tsconfig.json`): no implicit any, strict null checks
- Use explicit types for function parameters and return values
- Use `type` for type aliases, `interface` for object shapes
- Prefer `Record<K, V>` over `{ [key: string]: V }`
- Use utility types when appropriate: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`

```typescript
// Good
export type FunnelStage = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export interface Contact {
  id: string;
  name: string;
  stage: FunnelStage;
}

// Bad - avoid implicit any
function processData(data) { /* ... */ }
```

### Imports

**Ordering:**
1. React imports (`import * as React from "react"`)
2. Next.js imports (`import { NextResponse } from "next/server"`)
3. Third-party library imports (lucide-react, recharts, etc.)
4. UI component imports (`@/components/ui/*`)
5. Internal lib imports (`@/lib/*`)
6. Relative imports (`./`, `../`)

**Path aliases:** Use `@/` for project root-relative imports.

```typescript
import * as React from "react";
import { NextResponse } from "next/server";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contacts, type Contact } from "@/lib/data/mockData";
import { exportContactsCSV } from "@/lib/exportUtils";
```

### Component Patterns

**Client Components:**
- Add `"use client"` directive at the top of client-side React components
- Use functional components with explicit return types where helpful

**UI Components (Radix-based):**
- Use `React.forwardRef` for components accepting refs
- Export interfaces for component props (e.g., `ButtonProps`)
- Set `displayName` on forwarded components

```typescript
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn("base-classes", variant && `variant-${variant}`, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
```

### Tailwind CSS v4

- Uses CSS-first configuration (no `tailwind.config.js`)
- Define custom colors, fonts, and animations in `app/globals.css` under `@theme`
- Use `@layer components` for reusable utility classes
- Use Tailwind's `@apply` in `globals.css` only, not in component inline styles

**Custom color classes used:**
- Funnel stages: `funnel-new`, `funnel-contacted`, `funnel-qualified`, `funnel-proposal`, `funnel-won`, `funnel-lost`
- Messaging: `whatsapp`, `email`
- Semantic: `primary`, `secondary`, `muted`, `accent`, `destructive`

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ContactRow`, `HeroSection` |
| Functions | camelCase | `exportContactsCSV`, `sendEmail` |
| Types/Interfaces | PascalCase | `Contact`, `FunnelStage` |
| Constants | camelCase | `stageLabels`, `priorityColors` |
| CSS Classes | kebab-case | `sidebar-link`, `funnel-badge` |
| Files | kebab-case | `email-service.ts`, `mock-data.ts` |

### Error Handling

**API Routes:**
```typescript
export async function POST(request: Request) {
  try {
    // Parse and validate input
    const bodyText = await request.text();
    let bodyJson: unknown;
    try { 
      bodyJson = bodyText ? JSON.parse(bodyText) : {}; 
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Validate required fields
    const { to, subject } = bodyJson as Record<string, unknown>;
    if (!to || typeof to !== "string" || !to.includes("@")) {
      return NextResponse.json({ error: "Invalid 'to' email" }, { status: 400 });
    }

    // Return result
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

**Service Functions:**
```typescript
export async function sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  try {
    // ... implementation
    return { status: "sent", provider: "smtp", messageId: info.messageId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: "failed", provider: "smtp", error: message };
  }
}
```

### API Routes Structure

Place routes in `app/api/<resource>/route.ts`:
- `GET`, `POST`, `PUT`, `DELETE` handlers as named exports
- Return `NextResponse.json()` with appropriate status codes
- Validate request body before processing
- Use status codes: 200 (success), 201 (created), 400 (bad request), 500 (server error)

---

## Environment Variables

Required for email functionality:
```
SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, FROM_EMAIL, FROM_NAME
IMAP_HOST, IMAP_PORT, IMAP_USER, IMAP_PASS
```

Required for WhatsApp (future):
```
WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID
```

---

## Common Tasks

**Adding a new UI component:**
1. Create in `components/ui/<name>.tsx`
2. Follow Radix UI patterns if applicable
3. Export component and props interface

**Adding a new page:**
1. Create route in `app/(crm)/<page>/page.tsx`
2. Add "use client" if using hooks
3. Import components from `@/components/ui/*`

**Adding an API endpoint:**
1. Create `app/api/<resource>/route.ts`
2. Export appropriate HTTP method handlers
3. Return `NextResponse.json()` with status codes

**Adding WhatsApp integration (future):**
1. Add environment variables for WhatsApp Cloud API
2. Create service in `lib/whatsapp/`
3. Create API routes for webhook and messaging

