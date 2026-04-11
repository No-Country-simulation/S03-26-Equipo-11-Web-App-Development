# Tasks: Email Reply Feature

## Status: Done

## Implementation Tasks

- [x] T1: Agregar estado replyMode para título dinámico
- [x] T2: Crear función extractEmail() para extraer email del remitente
- [x] T3: Crear función handleReply() que prellena campos
- [x] T4: Modificar botón "Responder" para llamar handleReply
- [x] T5: Agregar título dinámico "Responder correo" / "Nuevo correo"
- [x] T6: Limpiar replyMode al abrir compose nuevo (botón + Nuevo)
- [x] T7: Verificar envío vía POST /api/email/send
- [x] T8: Verificar toast feedback (éxito/error)

## Files Modified
- `app/(crm)/email/page.tsx`

## Verification
- [x] Click en "Responder" abre formulario prellenado
- [x] Título muestra "Responder correo"
- [x] Campo "Para:" tiene email del remitente
- [x] Campo "Asunto:" tiene "Re: [asunto original]"
- [x] Campo "Cuerpo:" tiene cita del mensaje original
- [x] Botón "Enviar" funciona correctamente
- [x] Toast muestra "Correo enviado" en éxito
- [x] Toast muestra error en caso de fallo
- [x] "+ Nuevo" abre formulario limpio con título "Nuevo correo"