# Tasks: Contacts Frontend API Connection

## Status: In Progress

## 1. Imports & Types

- [x] 1.1 Reemplazar imports mock con tipos desde `@/lib/db/contacts-schema`
- [x] 1.2 Agregar imports necesarios: `useState`, `useEffect`, `Loader2` (lucide)

## 2. Estados del Componente

- [x] 2.1 Agregar estado `contacts` (array vacío inicial)
- [x] 2.2 Agregar estado `loading` (true inicial)
- [x] 2.3 Agregar estado `error` (string | null)
- [x] 2.4 Agregar estado `pagination` (page, limit, total)
- [x] 2.5 Agregar estado `filters` (stage, search)

## 3. Fetch contactos desde API

- [x] 3.1 Crear función `fetchContacts(page, limit, stage?, search?)`
- [x] 3.2 Implementar useEffect para cargar contactos al mount
- [x] 3.3 Conectar filtros de stage a query params
- [x] 3.4 Conectar búsqueda a query params
- [x] 3.5 Implementar paginación
- [x] 3.6 Crear función `fetchContacts(page, limit)` con query params

## 4. Actualizar Tabla

- [x] 4.1 Reemplazar `contacts.filter()` con `contacts` del estado
- [x] 4.2 Actualizar contador total con pagination.total
- [x] 4.3 Mostrar skeleton durante loading
- [x] 4.4 Mostrar error si falla fetch

## 5. Validación del Formulario

- [x] 5.1 Crear regex para name: `/^[a-zA-Z\s]{3,}$/`
- [x] 5.2 Crear regex para phone: `/^\+?[\d\s]{7,20}$/`
- [x] 5.3 Crear función `validateField(field, value)`
- [x] 5.4 Agregar estado `formErrors` (Record<string, string>)
- [x] 5.5 Validar en tiempo real (onBlur o onChange)

## 6. Submit del Formulario

- [x] 6.1 Crear función `handleSubmit(e)`
- [x] 6.2 Prevenir default y validar todos los campos
- [x] 6.3 Agregar estado `submitting` (boolean)
- [x] 6.4 Llamar POST /api/contacts
- [x] 6.5 Manejar 409 (email duplicado)
- [x] 6.6 Manejar otros errores (400, 500)
- [x] 6.7 En success: cerrar dialog, refetch, reset form

## 7. Mejoras UI

- [x] 7.1 Deshabilitar botón durante submitting
- [x] 7.2 Mostrar spinner en botón guardar
- [x] 7.3 Mostrar errores de validación bajo cada campo
- [x] 7.4 Mostrar error del servidor si existe

## 8. Remover Código Muerto

- [x] 8.1 Remover import de `exportContactsCSV`
- [x] 8.2 Remover botón de exportar CSV
- [x] 8.3 Remover referencia a `stageLabels`, `stageColors` de mock
- [x] 8.4 Limpiar imports no usados

## 9. Paginación UI

- [x] 9.1 Agregar controles: Primero | Anterior | Siguiente | Último
- [x] 9.2 Agregar dropdown selector de límite (10, 20, 30, 50, 100)
- [x] 9.3 Deshabilitar Primero/Anterior cuando page === 1
- [x] 9.4 Deshabilitar Siguiente/Último cuando page === totalPages
- [x] 9.5 Mostrar "Página X de Y" con total de contactos

---

## Files Modified

- `app/(crm)/contacts/page.tsx` (modificación completa)

## Verification Criteria

- [x] Page carga contactos desde API al iniciar
- [x] Filtros de stage funcionan (query params)
- [x] Búsqueda funciona (query params)
- [x] Paginación funciona con Primero/Anterior/Siguiente/Último
- [x] Selector de límite cambia cantidad por página
- [x] Controles deshabilitados correctamente en extremos
- [x] Muestra "Página X de Y"
- [x] Formulario muestra errores de validación
- [x] Submit crea contacto exitosamente
- [x] Email duplicado muestra error 409
- [x] CSV export button eliminado
- [x] Build sin errores
- [x] Lint sin errores (warnings pre-existentes)