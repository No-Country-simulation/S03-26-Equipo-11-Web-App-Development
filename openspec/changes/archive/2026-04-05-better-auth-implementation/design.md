# Design: better-auth-implementation

## Architecture Overview

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  Next.js     │────▶│   SQLite DB     │
│   (React)       │     │  Middleware  │     │   (users +      │
│                 │     │  + API       │     │    sessions)    │
└─────────────────┘     └──────────────┘     └─────────────────┘
        │                        │                       │
        │                   ┌────▼────┐                 │
        │                   │ Better  │                 │
        │                   │ Auth    │                 │
        │                   └─────────┘                 │
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐     ┌──────────────┐          ┌─────────────┐
│ /api/auth/*     │     │ /api/*       │          │  Sessions   │
│ (publico)       │     │ (protegido)  │          │  Table      │
└─────────────────┘     └──────────────┘          └─────────────┘
```

## Database Schema

### Tabla users (existente)
```sql
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,        -- bcrypt hash
  "name" TEXT NOT NULL,
  "role" TEXT NOT NULL,            -- 'admin' | 'agent' | 'user'
  "active" INTEGER NOT NULL,
  "created_at" TEXT NOT NULL,
  "updated_at" TEXT NOT NULL
);
```

### Tabla sessions (nueva - Better Auth)
```sql
CREATE TABLE "sessions" (
  "id" TEXT PRIMARY KEY,
  "user_id" TEXT NOT NULL REFERENCES "users"("id"),
  "expires_at" INTEGER NOT NULL,
  "token" TEXT NOT NULL
);
CREATE INDEX "session_user_id_idx" ON "sessions"("user_id");
CREATE INDEX "session_token_idx" ON "sessions"("token");
```

## API Routes

### Authentication Endpoints (públicas)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Registrar nuevo usuario |
| POST | `/api/auth/signin` | Iniciar sesión |
| POST | `/api/auth/signout` | Cerrar sesión |
| GET | `/api/auth/get-session` | Obtener sesión actual |

### Protected Endpoints (requieren auth)

Todos los endpoints bajo `/api/*` EXCEPTO:
- `/api/auth/*` (todas las rutas de auth)
- `/api/health`

## Middleware Configuration

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas públicas (sin protección)
  if (pathname.startsWith('/api/auth') || pathname === '/api/health') {
    return NextResponse.next();
  }

  // Rutas protegidas
  if (pathname.startsWith('/api/')) {
    const sessionToken = request.cookies.get('better-auth.session_token');
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Agregar headers para endpoints
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', userId);
    requestHeaders.set('x-user-role', userRole);
    
    return NextResponse.next({
      request: { headers: requestHeaders }
    });
  }
}
```

## Session Helpers

### lib/auth/session.ts

```typescript
export async function getSession(request: Request): Promise<Session | null>
export async function requireAuth(request: Request): Promise<Session>
export async function requireRole(request: Request, roles: Role[]): Promise<Session>
export async function getCurrentUser(request: Request): Promise<User | null>
```

## Implementation Steps

### Step 1: Install Dependencies
```bash
npm install better-auth better-auth-adapters bcrypt drizzle-zod
npm install -D @types/bcrypt
```

### Step 2: Configure Better Auth
- Crear `lib/auth/index.ts` con configuración
- Configurar drizzle adapter
- Configurar emailPassword plugin

### Step 3: Create Auth API Routes
- Crear `app/api/auth/[...all]/route.ts`
- Manejar todas las rutas de Better Auth

### Step 4: Create Session Helpers
- Crear `lib/auth/session.ts` con helpers

### Step 5: Create Middleware
- Crear `middleware.ts` con protección
- Agregar headers de usuario

### Step 6: Protect Existing Endpoints
- Modificar `app/api/email/send/route.ts`
- Modificar `app/api/email/receive*.ts`
- Modificar otros endpoints

### Step 7: Handle Existing Users
- Los 3 usuarios existentes necesitan password hasheada con bcrypt
- Opcional: forzar cambio de contraseña

## Security Considerations

1. **Cookies**: Usar `httpOnly`, `secure`, `sameSite: "lax"`
2. **Passwords**: Hash con bcrypt (cost factor 10)
3. **Sessions**: Expiran en 7 días por defecto
4. **CSRF**: Better Auth maneja automáticamente
5. **Headers**: No exponer passwords en responses
