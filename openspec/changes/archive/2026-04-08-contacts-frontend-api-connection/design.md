## Context

La página `app/(crm)/contacts/page.tsx` actualmente usa datos estáticos de `@/lib/data/mockData`. El backend contacts-crud-api ya está implementado y archivado (`2026-04-07-contacts-crud-api`), exponiendo endpoints REST en `/api/contacts`.

**Estado actual del frontend:**
- Tabla con datos mock (no persistence)
- Formulario simple sin validación (campos planos)
- Filtros por stage implementados localmente
- Sin paginación real
- Exportación CSV usa mock data

**Endpoints disponibles:**
- `GET /api/contacts` - lista con query params: `page`, `limit`, `stage`, `search`, `tags`
- `POST /api/contacts` - crear contacto (retorna 409 si email duplicado)
- `GET /api/contacts/stats` - estadísticas del funnel

## Goals / Non-Goals

**Goals:**
- Conectar lista de contactos al endpoint GET `/api/contacts`
- Conectar formulario de creación al endpoint POST `/api/contacts`
- Implementar validación frontend consistente con backend
- Reemplazar filtros mock con query params reales
- Mostrar errores 409 (email duplicado) desde backend

**Non-Goals:**
- Edición inline de contactos
- Eliminación de contactos
- Exportación CSV (no existe endpoint)
- Componente de formulario separado
- Optimistic updates o revalidación avanzada

## Decisions

### 1. Fetch Strategy
Usar `useEffect` con fetch nativo en lugar de library externa (SWR/React Query). Mantener consistencia con dashboard existente.

```tsx
// Patrón equivalente a dashboard/page.tsx
useEffect(() => {
  fetchContacts();
}, [page, limit, stage, search]);
```

### 2. Validación Local
Implementar validación en tiempo real antes de submit:
- `name`: `/^[a-zA-Z\s]{3,}$/` - mínimo 3 letras, solo letras y espacios
- `email`: validación HTML5 native + regex basic
- `phone`: `/^\+?[\d\s]{7,20}$/` - solo números y espacios (opcional)

**Decisión**: Sincronizar validaciones con Zod schemas en `lib/db/contacts-schema.ts`.

### 3. Tipos TypeScript
Reutilizar tipos existentes desde `@/lib/db/contacts-schema`:
- `Contact`, `ContactCreate` - tipos principales
- `ContactsListResponse`, `PaginationMeta` - respuesta paginada
- `FunnelStage` - enum de etapas

### 4. Estado del Formulario
```tsx
interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  errors: Record<string, string>;
  submitting: boolean;
  serverError: string | null;
}
```

### 5. Manejo de Errores
| Código | Acción |
|--------|--------|
| 400 | Mostrar errores de validación del backend |
| 409 | Mostrar "Ya existe un contacto con ese email" |
| 401 | Redirect a login (session expirada) |
| 500 | Mostrar error genérico |

## Risks / Trade-offs

- **Riesgo**: Latencia en fetch - **Mitigación**: Loading state visible, skeleton opcional
- **Riesgo**: Validación frontend/backend desincronizada - **Mitigación**: Reutilizar schemas Zod del backend
- **Riesgo**: Email duplicado antes de submit - **Mitigación**: Validación en tiempo real + mensaje claro del backend
- **Trade-off**: No optimistic updates por simplicidad - aceptar刷新 después de create