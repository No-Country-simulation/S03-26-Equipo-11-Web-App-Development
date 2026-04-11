## Context

El proyecto Startup CRM tiene la tabla `contacts` definida en SQLite pero carece de API REST para manipulación. Se necesita implementar endpoints CRUD completos para soportar la UI de gestión de contactos y el dashboard con métricas del funnel.

**Estado actual:**
- Tabla `contacts` existe con índices en `stage` y `email`
- No hay endpoints API para contactos
- Dashboard usa datos mock para métricas

**Restricciones técnicas:**
- Next.js 16 App Router para API routes
- Better Auth para autenticación (ya configurado)
- SQLite con mejor-sqlite3
- TypeScript strict mode

## Goals / Non-Goals

**Goals:**
- CRUD completo de contactos via REST API
- Paginación configurable (10, 20, 30, 50, 100)
- Filtros por stage, tags, y búsqueda por nombre/email
- Validación con Zod schemas
- Documentación en OpenAPI 3.0

**Non-Goals:**
- Soft-delete (implementar en fase posterior si se requiere)
- Autenticación custom (usar better-auth existente)
- Endpoints de exportación CSV/PDF
- Relación many-to-many para tags (usar JSON por ahora)

## Decisions

### D1: Arquitectura de API Routes

**Decisión:** Usar Next.js App Router API routes (`app/api/contacts/route.ts`)

**Alternativas consideradas:**
- Server Actions: Más Simple pero menos estándar para consumo externo
- Route Handlers:正好 para REST API

**Justificación:** Route Handlers son el estándar para APIs REST en Next.js, permiten versioning claro y son consumibles por cualquier cliente HTTP.

### D2: Validación con Zod

**Decisión:** Usar Zod para validación de request bodies y query params

**Alternativas:**
- Yup: Más popular pero Zod es mejor tipado con TypeScript
- Valibot: Más ligero pero Zod tiene mejor ecosistema

**Justificación:** Zod ofrece inferencia de tipos automática desde schemas, mejor integración con TypeScript strict mode.

### D3: Paginación offset-based

**Decisión:** Usar paginación basada en offset (`page` + `limit`)

**Alternativas:**
- Cursor-based: Más eficiente para datasets grandes
- Page-based: Más simple de implementar y UX conocida

**Justificación:** Offset-based es más simple para UI, permite "ir a página X" fácilmente, y es suficiente para datasets típicos de CRM (< 10,000 contactos).

### D4: Serialización de tags como JSON

**Decisión:** Almacenar tags como string JSON (`["vip","lead"]`)

**Alternativas:**
- Tabla relacional `contact_tags`: Más flexible pero más complejo
- Array de strings en PostgreSQL: No soportado por SQLite

**Justificación:** Simple de implementar, suficiente para el caso de uso actual. Si el volumen de tags crece, se puede migrar a tabla relacional.

### D5: Endpoints separados vs. query params

**Decisión:** Un solo endpoint GET `/api/contacts` con query params para filtros

**Alternativas:**
- `/api/contacts?stage=new` (elegido)
- `/api/contacts/stage/:stage`

**Justificación:** API más limpia, filtros combinables, patrón REST estándar.

## API Design

### Directory Structure

```
app/api/contacts/
├── route.ts           # GET (list), POST (create)
├── [id]/
│   └── route.ts      # GET, PUT, DELETE by ID
└── stats/
    └── route.ts      # GET stats

lib/db/
├── contacts-schema.ts   # Zod schemas + TypeScript types
└── contacts-queries.ts # CRUD functions
```

### Zod Schemas

```typescript
const PHONE_REGEX = /^\+?[\d\s\-]{7,20}$/;

export const FunnelStageSchema = z.enum([
  "new", "contacted", "qualified", "proposal", "won", "lost"
]);

export const ContactCreateSchema = z.object({
  name: z.string()
    .min(2, "Nombre debe tener al menos 2 caracteres")
    .max(255),
  email: z.string()
    .email("Email inválido"),
  phone: z.string()
    .regex(PHONE_REGEX, "Teléfono inválido (solo números, mín 7 chars)")
    .optional()
    .or(z.literal("")),
  company: z.string().optional(),
  stage: FunnelStageSchema.default("new"),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
});

export const ContactUpdateSchema = ContactCreateSchema.partial();

export type Contact = z.infer<typeof ContactCreateSchema> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
```

### Validation Rules Summary

| Campo | Requerido | Regla Zod |
|-------|-----------|-----------|
| name | **Sí** | `min(2).max(255)` |
| email | **Sí** | `.email()` |
| phone | No | regex `^\+?[\d\s\-]{7,20}$` (7-20 chars) |
| company | No | - |
| stage | No | default: "new" |

### Response Shapes

**List Response:**
```typescript
{
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}
```

**Error Response:**
```typescript
{
  error: string;
  details?: Record<string, string[]>;
}
```

## Data Access Layer

```typescript
// lib/db/contacts-queries.ts
export async function listContacts(filters: {
  page?: number;
  limit?: number;
  stage?: string;
  search?: string;
  tags?: string[];
}): Promise<{ data: Contact[]; total: number }>

export async function getContact(id: string): Promise<Contact | null>
export async function createContact(data: ContactInput): Promise<Contact>
export async function updateContact(id: string, data: Partial<ContactInput>): Promise<Contact | null>
export async function deleteContact(id: string): Promise<boolean>
export async function getContactStats(): Promise<{ total: number; byStage: Record<string, number> }>
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| JSON serialization de tags puede ser lenta en queries | Indexar si performance es crítica, o migrar a tabla relacional |
| Sin soft-delete puede perder datos | Agregar soft-delete en fase 2 si hay requisito de auditoría |
| Paginación offset es lenta para datasets grandes | Implementar cursor-based si se alcanzan > 10,000 contactos |

## Migration Plan

1. Crear `lib/db/contacts-schema.ts` y `lib/db/contacts-queries.ts`
2. Implementar endpoints básicos (CRUD sin filtros)
3. Agregar paginación y filtros progresivamente
4. Implementar endpoint stats
5. Actualizar `docs/tests/email.http` con sección CONTACTS
6. Actualizar `public/openapi.json`

## Authentication

**Todos los endpoints SHAL requerir autenticación via better-auth.**

```typescript
// Middleware check en cada route
const session = await auth.api.getSession({ headers: request.headers });
if (!session) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

## Open Questions

1. ¿Se necesita implementar soft-delete eventualmente?
2. ¿El campo `assignedTo` requiere validación de FK a tabla users?
