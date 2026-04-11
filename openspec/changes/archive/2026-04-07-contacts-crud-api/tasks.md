# Tasks: Contacts CRUD API

## Status: Complete

## 1. Schema & Types ✅

- [x] 1.1 Crear `lib/db/contacts-schema.ts` con:
  - Tipos TypeScript: `Contact`, `ContactCreate`, `ContactUpdate`
  - Tipo `FunnelStage`
  - Schemas Zod con validaciones:
    - `name`: min 2 chars, max 255
    - `email`: formato email válido
    - `phone`: regex `^\+?[\d\s\-]{7,20}$` (7-20 chars, solo números/+/-/espacio)
    - `company`: opcional
    - `stage`: enum válido (default "new")
  - `ContactUpdateSchema`: versión partial para updates
  - Función de parsing para tags (JSON serialization)

- [x] 1.2 Exportar tipos desde `lib/db/contacts-schema.ts` (barrel export)

## 2. Database Queries ✅

- [x] 2.1 Crear `lib/db/contacts-queries.ts` con funciones:
  - `listContacts(filters)` - listar con filtros y paginación
  - `getContact(id)` - obtener uno por ID
  - `createContact(data)` - crear nuevo contacto
  - `updateContact(id, data)` - actualizar parcialmente
  - `deleteContact(id)` - eliminar
  - `getContactStats()` - conteos por stage

- [x] 2.2 Implementar serialización/deserialización de tags (JSON)

- [x] 2.3 Verificar que índices existentes (`idx_contacts_stage`, `idx_contacts_email`) funcionen con las queries

## 3. API Routes - CRUD ✅

- [x] 3.1 Crear `app/api/contacts/route.ts`:
  - `GET` - listar contactos con paginación y filtros
  - `POST` - crear contacto

- [x] 3.2 Crear `app/api/contacts/[id]/route.ts`:
  - `GET` - obtener contacto por ID
  - `PUT` - actualizar contacto
  - `DELETE` - eliminar contacto

- [x] 3.3 Crear `app/api/contacts/stats/route.ts`:
  - `GET` - retornar estadísticas del funnel

- [x] 3.4 Implementar validación Zod en todos los endpoints

- [x] 3.5 **Todos los endpoints SHAL requerir autenticación** (better-auth session)

## 4. Query Parameters & Validation ✅

- [x] 4.1 Implementar validación de `limit` (aceptar: 10, 20, 30, 50, 100)

- [x] 4.2 Implementar filtros:
  - `stage` - filtrar por etapa del funnel
  - `search` - buscar en name y email
  - `tags` - filtrar por tags (comma-separated)

- [x] 4.3 Implementar paginación offset-based con `page` y `limit`

## 5. Error Handling ✅

- [x] 5.1 Crear función helper `errorResponse(message, status, details?)`

- [x] 5.2 Implementar manejo de errores 400 (validación)

- [x] 5.3 Implementar manejo de errores 404 (no encontrado)

- [x] 5.4 Implementar manejo de errores 401 (no autenticado)

- [x] 5.5 Implementar manejo de errores 500 (internos)

## 6. Documentation - HTTP Tests ✅

- [x] 6.1 Agregar sección **CONTACTS** a `docs/tests/email.http`:
  - GET /api/contacts (listar con paginación)
  - GET /api/contacts?stage=new
  - GET /api/contacts?search=Juan
  - GET /api/contacts?tags=vip,lead
  - POST /api/contacts (crear)
  - GET /api/contacts/:id (obtener uno)
  - PUT /api/contacts/:id (actualizar)
  - DELETE /api/contacts/:id (eliminar)
  - GET /api/contacts/stats (estadísticas)

- [x] 6.2 Agregar casos de error en el archivo .http

## 7. Documentation - OpenAPI ✅

- [x] 7.1 Actualizar `public/openapi.json`:
  - Agregar tag "Contacts"
  - Agregar paths para todos los endpoints
  - Agregar schemas: Contact, ContactCreate, ContactUpdate, ContactsListResponse, ContactsStatsResponse
  - Agregar ejemplos de request/response

---

**Scope: Solo endpoints API REST. La integración frontend (contacts page, dashboard) será un change separado.**

---

## Files Created

- `lib/db/contacts-schema.ts` ✅
- `lib/db/contacts-queries.ts` ✅
- `app/api/contacts/route.ts` ✅
- `app/api/contacts/[id]/route.ts` ✅
- `app/api/contacts/stats/route.ts` ✅

## Files Modified

- `docs/tests/email.http` ✅
- `public/openapi.json` ✅

## Verification Criteria

### CRUD Operations
- [ ] POST /api/contacts crea contacto con ID generado
- [ ] GET /api/contacts retorna lista paginada
- [ ] GET /api/contacts?limit=10|20|30|50|100 funciona
- [ ] GET /api/contacts?stage=new filtra correctamente
- [ ] GET /api/contacts?search=Juan busca en name/email
- [ ] GET /api/contacts/:id retorna contacto existente
- [ ] PUT /api/contacts/:id actualiza campos
- [ ] DELETE /api/contacts/:id elimina contacto
- [ ] GET /api/contacts/stats retorna conteos por stage

### Validation (Zod)
- [ ] name < 2 chars → 400 "Nombre debe tener al menos 2 caracteres"
- [ ] email inválido → 400 "Email inválido"
- [ ] phone < 7 chars → 400 "Teléfono inválido"
- [ ] phone con letras → 400 "Teléfono inválido"
- [ ] stage inválido → 400 validación Zod
- [ ] company opcional → OK sin company

### Authentication
- [ ] Endpoints retornan 401 sin sesión
- [ ] Endpoints funcionan con sesión válida

### Documentation
- [ ] OpenAPI spec es válida
- [ ] Tests .http funcionan en VS Code REST Client
