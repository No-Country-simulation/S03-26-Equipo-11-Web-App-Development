# Proposal: Connect Email Form to API

## Summary
Conectar el formulario de composición de email en `app/(crm)/email/page.tsx` al endpoint POST `/api/email/send` con validación, estados de carga y feedback al usuario.

## Why
- El formulario actual no está conectado a ningún endpoint
- Necesita validación de campos antes de enviar
- El usuario necesita feedback visual del resultado (éxito/error)
- Estado de carga para evitar envíos duplicados

## Goals
- Validar email con regex y campos requeridos (subject, body)
- Mensajes de error inline en rojo
- Llamar al endpoint con fetch
- Loading state en botón (disabled mientras envía)
- Toast de éxito "Correo enviado" o toast de error
- Limpiar formulario tras envío exitoso

## Non-Goals
- No modificar el endpoint API existente
- No agregar autenticación adicional

## Links
- [Email Page](../app/(crm)/email/page.tsx)
- [Email API](../app/api/email/send/route.ts)