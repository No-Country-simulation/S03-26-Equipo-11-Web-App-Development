# Contacts CRUD API Specification

## Summary

API REST completa para gestión de contactos del CRM con operaciones CRUD, filtros, paginación y estadísticas del funnel de ventas.

## Domain

Startup CRM - Sistema CRM para startups con gestión de leads y clientes.

---

## ADDED Requirements

### Requirement: Contact data model

El modelo de datos `Contact` SHAL consistir en los siguientes campos:

| Campo | Tipo | Requerido | Validación | Descripción |
|-------|------|-----------|------------|-------------|
| id | string (UUID) | Sí | - | Identificador único |
| name | string | Sí | min 2 chars | Nombre del contacto |
| email | string | Sí | email válido | Email del contacto |
| phone | string | No | regex `^\+?[\d\s\-]{7,20}$` | Teléfono |
| company | string | No | - | Empresa (nullable) |
| stage | FunnelStage | Sí | enum válido | Etapa del funnel (default: "new") |
| tags | string[] | No | - | Array de etiquetas |
| lastContact | string (ISO 8601) | No | - | Fecha último contacto |
| notes | string | No | - | Notas adicionales |
| avatar | string | No | - | URL avatar |
| assignedTo | string (UUID) | No | - | FK a usuarios |
| createdAt | string (ISO 8601) | Sí | - | Timestamp creación |
| updatedAt | string (ISO 8601) | Sí | - | Timestamp actualización |

#### Scenario: Estructura de contacto
- **WHEN** se crea un contacto en el sistema
- **THEN** el contacto SHAL contener todos los campos definidos con tipos correctos

#### Scenario: Serialización de tags
- **WHEN** los tags son almacenados en la base de datos
- **THEN** SHAL serializarse como JSON array

#### Scenario: Validación de nombre
- **WHEN** se crea/actualiza un contacto
- **THEN** el nombre SHAL tener al menos 2 caracteres

#### Scenario: Validación de email
- **WHEN** se crea/actualiza un contacto
- **THEN** el email SHAL ser un email válido (formato user@domain.com)

#### Scenario: Validación de teléfono
- **WHEN** se proporciona un teléfono
- **THEN** SHAL contener solo números, espacios, guiones, o +, con mínimo 7 caracteres

---

### Requirement: FunnelStage enumeration

El campo `stage` SHAL aceptar únicamente los siguientes valores:

| Valor | Descripción UI | Color |
|-------|----------------|-------|
| new | Nuevo | - |
| contacted | Contactado | - |
| qualified | Calificado | - |
| proposal | Propuesta | - |
| won | Ganado | - |
| lost | Perdido | - |

#### Scenario: Stage válido
- **WHEN** se crea/actualiza un contacto con stage válido
- **THEN** la operación SHAL completarse exitosamente

#### Scenario: Stage inválido
- **WHEN** se intenta crear/actualizar un contacto con stage inválido
- **THEN** SHAL retornar error 400 con mensaje de validación

---

### Requirement: List contacts endpoint

El endpoint `GET /api/contacts` SHAL retornar una lista paginada de contactos.

#### Scenario: Listar todos los contactos
- **WHEN** GET /api/contacts es llamado sin filtros
- **THEN** SHAL retornar todos los contactos ordenados por createdAt DESC

#### Scenario: Paginación por offset
- **WHEN** GET /api/contacts?page=1&limit=10 es llamado
- **THEN** SHAL retornar máximo 10 contactos del offset calculado
- **AND** SHAL incluir objeto pagination con page, limit, total, totalPages

#### Scenario: Opciones de límite
- **WHEN** el cliente especifica el parámetro limit
- **THEN** SHAL validar que sea uno de: 10, 20, 30, 50, 100
- **AND** SHAL usar valor por defecto 20 si es inválido

#### Scenario: Filtrar por stage
- **WHEN** GET /api/contacts?stage=contacted es llamado
- **THEN** SHAL retornar solo contactos con stage = "contacted"

#### Scenario: Filtrar por tags
- **WHEN** GET /api/contacts?tags=vip,lead es llamado
- **THEN** SHAL retornar contactos que contengan alguno de los tags especificados

#### Scenario: Búsqueda por texto
- **WHEN** GET /api/contacts?search=Juan es llamado
- **THEN** SHAL buscar en campos name e email (case-insensitive)

#### Scenario: Filtros combinados
- **WHEN** GET /api/contacts?stage=new&search=Juan&limit=20 es llamado
- **THEN** SHAL aplicar todos los filtros simultáneamente

---

### Requirement: Create contact endpoint

El endpoint `POST /api/contacts` SHAL crear un nuevo contacto.

#### Scenario: Crear contacto exitosamente
- **WHEN** POST /api/contacts es llamado con payload válido
- **THEN** SHAL crear el contacto con id generado (UUID)
- **AND** SHAL asignar createdAt y updatedAt con timestamp actual
- **AND** SHAL usar stage = "new" por defecto si no se especifica
- **AND** SHAL retornar código 201 con el contacto creado

#### Scenario: Crear con email inválido
- **WHEN** POST /api/contacts es llamado con email malformado
- **THEN** SHAL retornar error 400 con mensaje "Invalid email format"

#### Scenario: Crear con campos requeridos faltantes
- **WHEN** POST /api/contacts es llamado sin name o email
- **THEN** SHAL retornar error 400 listando campos faltantes

#### Scenario: Crear con stage inválido
- **WHEN** POST /api/contacts es llamado con stage no válido
- **THEN** SHAL retornar error 400 con mensaje de validación

---

### Requirement: Get contact endpoint

El endpoint `GET /api/contacts/:id` SHAL retornar un contacto específico.

#### Scenario: Obtener contacto existente
- **WHEN** GET /api/contacts/:id es llamado con id válido
- **THEN** SHAL retornar el contacto con código 200

#### Scenario: Obtener contacto inexistente
- **WHEN** GET /api/contacts/:id es llamado con id no existente
- **THEN** SHAL retornar código 404 con mensaje "Contact not found"

---

### Requirement: Update contact endpoint

El endpoint `PUT /api/contacts/:id` SHAL actualizar un contacto existente.

#### Scenario: Actualizar parcialmente
- **WHEN** PUT /api/contacts/:id es llamado con payload parcial
- **THEN** SHAL actualizar solo los campos incluidos
- **AND** SHAL actualizar updatedAt automáticamente
- **AND** SHAL retornar el contacto actualizado con código 200

#### Scenario: Actualizar stage
- **WHEN** PUT /api/contacts/:id es llamado con nuevo stage
- **THEN** SHAL validar que el stage sea válido
- **AND** SHAL actualizar correctamente

#### Scenario: Actualizar contacto inexistente
- **WHEN** PUT /api/contacts/:id es llamado con id no existente
- **THEN** SHAL retornar código 404

---

### Requirement: Delete contact endpoint

El endpoint `DELETE /api/contacts/:id` SHAL eliminar un contacto.

#### Scenario: Eliminar contacto existente
- **WHEN** DELETE /api/contacts/:id es llamado con id válido
- **THEN** SHAL eliminar el contacto de la base de datos
- **AND** SHAL retornar código 204 (No Content)

#### Scenario: Eliminar contacto inexistente
- **WHEN** DELETE /api/contacts/:id es llamado con id no existente
- **THEN** SHAL retornar código 404

---

### Requirement: Stats endpoint

El endpoint `GET /api/contacts/stats` SHAL retornar estadísticas del funnel.

#### Scenario: Obtener estadísticas
- **WHEN** GET /api/contacts/stats es llamado
- **THEN** SHAL retornar objeto con:
  - total: número total de contactos
  - byStage: objeto con conteo por cada FunnelStage

#### Scenario: Formato de respuesta stats
- **WHEN** el sistema tiene contactos en diferentes etapas
- **THEN** SHAL retornar conteos precisos para cada stage
- **AND** SHAL incluir todas las etapas, aunque tengan 0 contactos

---

### Requirement: Authentication requirement

Todos los endpoints SHAL requerir autenticación.

#### Scenario: Request sin autenticación
- **WHEN** cualquier endpoint de contacts es llamado sin sesión
- **THEN** SHAL retornar código 401 con mensaje "Unauthorized"

---

### Requirement: Error response format

Los errores SHAL seguir un formato consistente.

#### Scenario: Error de validación
- **WHEN** una request tiene datos inválidos
- **THEN** SHAL retornar código 400
- **AND** SHAL incluir objeto error con message y details

#### Scenario: Error interno
- **WHEN** ocurre un error inesperado en el servidor
- **THEN** SHAL retornar código 500
- **AND** SHAL incluir mensaje genérico en producción

---

## API Contract Summary

### Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | /api/contacts | Listar contactos | Sí |
| POST | /api/contacts | Crear contacto | Sí |
| GET | /api/contacts/:id | Obtener contacto | Sí |
| PUT | /api/contacts/:id | Actualizar contacto | Sí |
| DELETE | /api/contacts/:id | Eliminar contacto | Sí |
| GET | /api/contacts/stats | Estadísticas | Sí |

### Response Format - List

```json
{
  "data": [Contact],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

### Response Format - Error

```json
{
  "error": "string",
  "details": {}
}
```
