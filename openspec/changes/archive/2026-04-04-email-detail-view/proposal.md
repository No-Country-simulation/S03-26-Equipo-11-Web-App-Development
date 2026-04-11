# Proposal: Email Detail View - Show Email Body

## Summary
Al hacer click en un email recibido en el listado, obtener el cuerpo completo (body/html) del email mediante el endpoint POST `/api/email/receiveOne` y mostrarlo en el panel de detalle.

## Why
- El listado actual solo muestra from, fecha, subject
- Falta el cuerpo del email en el panel de detalle
- Necesario llamar al endpoint con messageId para obtener contenido completo
- Emails enviados/mocks ya tienen body disponible

## Goals
- Agregar messageId al listado de emails recibidos
- Llamar a `/api/email/receiveOne` al hacer click en email recibido
- Mostrar body/html en panel de detalle con sanitización DOMPurify
- Estilos CSS para contenido HTML (img, table, a, blockquote, code)
- Paginación服务端 con offset/limit (20 por defecto)
- Carga infinita ("Cargar más correos")

## Non-Goals
- No modificar estructura de datos existente
- No cambiar comportamiento de otros listados

## Links
- [Email Page](../app/(crm)/email/page.tsx)
- [Email ReceiveOne API](../app/api/email/receiveOne/route.ts)
- [IMAP Service](../lib/email/imapService.ts)