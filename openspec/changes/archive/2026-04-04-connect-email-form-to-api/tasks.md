# Tasks: Connect Email Form to API

## Status: Done

## Implementation Tasks

- [x] T1: Agregar regex de validación de email al inicio del componente
- [x] T2: Agregar estados: isLoading, errors, toast
- [x] T3: Crear función validateForm() con mensajes de error inline
- [x] T4: Crear función handleSend() con fetch al endpoint
- [x] T5: Agregar errores inline en campos del formulario (To, Subject)
- [x] T6: Agregar disabled={isLoading} al botón de enviar
- [x] T7: Agregar Toast para feedback (éxito/error)
- [x] T8: Limpiar formulario tras envío exitoso

## Files Modified
- `app/(crm)/email/page.tsx`

## Verification
- [x] Email válido con subject → éxito + cleanup
- [x] Email inválido → error inline "Correo inválido"
- [x] Subject vacío → error inline "El asunto es requerido"
- [x] Botón deshabilitado mientras carga
- [x] Toast verde "Correo enviado" tras éxito
- [x] Toast rojo con mensaje de error tras fallo