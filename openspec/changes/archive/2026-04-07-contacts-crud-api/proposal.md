## Why

El sistema CRM necesita una API REST completa para gestión de contactos. Actualmente existe la tabla `contacts` en SQLite pero no hay endpoints para realizar operaciones CRUD, filtrado y consulta de estadísticas del funnel de ventas.

## What Changes

- **Nuevo módulo Contacts API**: Endpoints REST completos para CRUD de contactos
- **Filtros avanzados**: Por stage, tags, búsqueda por nombre/email
- **Paginación configurable**: Opciones de 10, 20, 30, 50, 100 registros
- **Estadísticas del funnel**: Conteo de contactos por etapa
- **Validación de dominio**: Stage solo acepta valores válidos del funnel
- **Timestamps automáticos**: created_at, updated_at en todas las operaciones
- **Integración con autenticación**: Endpoints protegidos por better-auth
- **Documentación API**: Actualización de OpenAPI spec y archivos .http para testing

## Non-Goals

- **Frontend**: La integración con `app/(crm)/contacts/page.tsx` y dashboard NO está incluida en este scope
- **Exportación CSV/PDF**: Ya existe función `exportContactsCSV()` en frontend
- **Soft-delete**: Se usa hard-delete por ahora

## Capabilities

### New Capabilities

- `contacts-crud-api`: API REST completa con endpoints para listar, crear, obtener, actualizar y eliminar contactos. Incluye paginación configurable, filtros por stage/tags/búsqueda, y endpoint de estadísticas del funnel.
- `contacts-schema`: Definición de tipos TypeScript y schemas Zod para validación de contactos.

## Impact

**Nuevos archivos:**
- `app/api/contacts/route.ts` - Listar/Crear contactos
- `app/api/contacts/[id]/route.ts` - Obtener/Actualizar/Eliminar contacto
- `app/api/contacts/stats/route.ts` - Estadísticas del funnel
- `lib/db/contacts-schema.ts` - Tipos y Zod schemas
- `lib/db/contacts-queries.ts` - Funciones CRUD de base de datos

**Archivos a modificar:**
- `docs/tests/email.http` - Agregar sección CONTACTS con todos los endpoints
- `public/openapi.json` - Agregar paths, schemas y tag para Contacts

**Dependencias:**
- better-auth (autenticación existente)
- better-sqlite3 (base de datos existente)
- Zod (validación, ya disponible)
