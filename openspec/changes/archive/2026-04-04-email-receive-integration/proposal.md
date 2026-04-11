# Proposal: Email Receive Integration

## Summary
Implementar recepción de emails en el sistema CRM: conectar endpoint GET `/api/email/receive` y mostrar correos recibidos en la bandeja de entrada con diferenciación visual entre leídos y no leídos.

## Why
- Necesidad de recibir emails desde el servidor IMAP
- Mostrar bandeja de entrada unificada (recibidos + enviados + mock)
- Diferenciar visualmente emails leídos de no leídos

## Goals
- Conectar endpoint GET `/api/email/receive` 
- Listar correos recibidos en bandeja de entrada con campos: from, fecha, subject
- Mostrar emails no leídos en bold (font-semibold), leídos en texto normal (font-medium)
- Botón de refresh para recargar bandeja de entrada

## Non-Goals
- No modificar el servicio IMAP existente
- No implementar marcado como leído en el servidor

## Links
- [Email Page](../app/(crm)/email/page.tsx)
- [Email Receive API](../app/api/email/receive/route.ts)
- [IMAP Service](../lib/email/imapService.ts)