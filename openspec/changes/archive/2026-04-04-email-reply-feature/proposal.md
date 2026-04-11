# Proposal: Email Reply Feature

## Summary
Implementar funcionalidad de "Responder" en el panel de detalle del email: abrir formulario de composición prellenado con datos del email original y enviar via endpoint existente.

## Why
- Necesario permitir al usuario responder emails directamente desde la interfaz CRM
- El botón "Responder" ya existe pero no tiene funcionalidad
- Requiere autollenado del formulario y uso del endpoint /api/email/send

## Goals
- Botón "Responder" abre formulario de composición con título "Responder correo"
- Autollenado: Para (remitente original), Asunto ("Re: [asunto]"), Cuerpo (cita del original)
- Envío via POST /api/email/send
- Feedback: toast éxito/error

## Non-Goals
- No modificar endpoint /api/email/send existente
- No implementar "Reenviar" (queda para futuro)

## Links
- [Email Page](../app/(crm)/email/page.tsx)
- [Email Send API](../app/api/email/send/route.ts)