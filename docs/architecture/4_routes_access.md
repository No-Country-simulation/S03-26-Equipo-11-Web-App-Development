# Routes & Access - Startup CRM

## Mapa de Rutas

### Rutas Públicas

| Ruta | Archivo | Descripción | Acceso |
|------|---------|-------------|--------|
| `/` | `app/page.tsx` | Landing page | Público |
| `/login` | `app/login/page.tsx` | Página de login | Público |
| `/register` | `app/register/page.tsx` | Página de registro | Público |
| `/api-docs` | `app/api-docs/page.tsx` | Documentación Swagger | Público |

### Rutas Protegidas (CRM)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/dashboard` | `app/(crm)/dashboard/page.tsx` | Panel de control |
| `/contacts` | `app/(crm)/contacts/page.tsx` | Gestión de contactos |
| `/email` | `app/(crm)/email/page.tsx` | Cliente de email |
| `/whatsapp` | `app/(crm)/whatsapp/page.tsx` | Mensajería WhatsApp |
| `/reminders` | `app/(crm)/reminders/page.tsx` | Recordatorios |
| `/settings` | `app/(crm)/settings/page.tsx` | Configuración |

### Rutas API

| Método | Ruta | Handler | Descripción |
|--------|------|---------|-------------|
| `GET` | `/api/health` | Inline | Health check |
| `POST` | `/api/auth/signin` | better-auth | Iniciar sesión |
| `POST` | `/api/auth/signup` | better-auth | Registrar usuario |
| `POST` | `/api/auth/signout` | better-auth | Cerrar sesión |
| `GET` | `/api/auth/get-session` | better-auth | Obtener sesión |
| `GET` | `/api/dashboard` | route | Métricas KPIs |
| `POST` | `/api/email/send` | emailService | Enviar email |
| `GET` | `/api/email/receive` | imapService | Recibir emails |
| `POST` | `/api/email/receiveOne` | imapService | Recibir email por ID |
| `GET` | `/api/email/sync-status` | syncService | Estado sincronización |
| `GET` | `/api/email/receive-sync` | syncService | Sincronizar emails |

---

## Estructura de Rutas

```
app/
├── page.tsx                    # / (root)
├── login/page.tsx             # /login
├── register/page.tsx          # /register
├── api-docs/page.tsx          # /api-docs
│
├── (crm)/                     # Route group
│   ├── layout.tsx             # Layout compartido CRM
│   │
│   ├── dashboard/
│   │   └── page.tsx           # /dashboard
│   │
│   ├── contacts/
│   │   └── page.tsx           # /contacts
│   │
│   ├── email/
│   │   └── page.tsx           # /email
│   │
│   ├── whatsapp/
│   │   └── page.tsx           # /whatsapp
│   │
│   ├── reminders/
│   │   └── page.tsx           # /reminders
│   │
│   └── settings/
│       └── page.tsx            # /settings
│
└── api/
    ├── health/
    │   └── route.ts           # /api/health
    │
    └── email/
        ├── send/
        │   └── route.ts       # /api/email/send
        ├── receive/
        │   └── route.ts       # /api/email/receive
        └── receiveOne/
            └── route.ts       # /api/email/receiveOne
```

---

## Layout CRM

El route group `(crm)` comparte un layout común con sidebar de navegación:

```typescript
// app/(crm)/layout.tsx
export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

### Navegación del Sidebar

```
┌──────────────────────────────┐
│  Logo                        │
├──────────────────────────────┤
│  📊 Dashboard                │
│  👥 Contactos                │
│  ✉️  Email                   │
│  💬 WhatsApp                 │
│  ⏰ Recordatorios            │
│  ⚙️ Configuración            │
├──────────────────────────────┤
│  Cerrar Sesión               │
└──────────────────────────────┘
```

---

## Middleware de Autenticación (Futuro)

```typescript
// middleware.ts (futuro)
export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has("session");
  
  if (!isAuthenticated && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|login|register|_next/static|_next/image).*)"],
};
```

---

## Rutas API - Autenticación Requerida (Futuro)

```typescript
// Verificación de API keys o tokens
export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Validar token...
}
```

---

**Volver a**: [Índice de Arquitectura](../architecture.md)
