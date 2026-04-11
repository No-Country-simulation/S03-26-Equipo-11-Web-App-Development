## Why

La página de contactos actualmente usa datos mock locales, desconectada del backend API implementado (contacts-crud-api). Esto impide que los usuarios puedan crear, editar o eliminar contactos persistentemente. La integración real es necesaria para que el CRM funcione.

## What Changes

- Reemplazar datos mock con llamada fetch a `/api/contacts`
- Conectar formulario de nuevo contacto al endpoint POST `/api/contacts`
- Implementar validación frontend fields: name (mín 3 chars, solo letras), email (válido), phone (solo números)
- Mostrar errores del backend (email duplicado → 409)
- Conectar filtros de búsqueda y stages a query params del API
- **Implementar paginación con controles: Primero | Anterior | Siguiente | Último**
- **Implementar selector de límite: 10, 20, 30, 50, 100**
- Mostrar info de paginación: "Página X de Y"
- **No se implementará exportación CSV** - endpoint no existe en backend
- Remover функ exportUtils references del formulario

## Capabilities

### New Capabilities
- `contacts-list-api-integration`: Listar contactos desde API con filtros y paginación
- `contacts-create-form`: Formulario para crear contactos con validación

### Modified Capabilities
- Ninguno - el backend contacts-crud-api ya fue archivado

## Impact

- **Archivo modificado**: `app/(crm)/contacts/page.tsx`
- **API usada**: `/api/contacts` (GET, POST), `/api/contacts/stats` (GET)
- **Dependencias**: contacts-crud-api archivado en `2026-04-07-contacts-crud-api`

## Non-goals

- Edición inline de contactos (solo create en esta fase)
- Eliminación de contactos desde UI
- Exportación CSV/PDF
- Componente separado de formulario (se mantiene en Dialog)