# Tasks: Email Detail View - Show Email Body

## Status: Done

## Implementation Tasks

- [x] T1: Agregar messageId, body, html a ReceivedEmailData
- [x] T2: Agregar estado loadingBody para indicador de carga
- [x] T3: Incluir messageId en mapping de receivedEmails
- [x] T4: Crear función loadEmailBody() que llama a /api/email/receiveOne
- [x] T5: Llamar loadEmailBody al hacer click en email recibido sin body
- [x] T6: Actualizar receivedEmails con body/html obtenido
- [x] T7: Mostrar indicador de carga (spinner) en panel de detalle
- [x] T8: Renderizar html con DOMPurify + dangerouslySetInnerHTML o text plano
- [x] T9: Para emails sent/mock mostrar body existente
- [x] T10: Agregar estilos CSS para contenido HTML del email (img, table, a, blockquote, pre, code)
- [x] T11: Agregar offset/limit en tipos ReceiveOptions
- [x] T12: Modificar imapService para soportar offset/limit
- [x] T13: Agregar endpoint GET con query params (limit, offset)
- [x] T14: Corregir orden de emails (invertir array para más recientes primero)
- [x] T15: Agregar estados para paginación (emailOffset, hasMoreEmails)
- [x] T16: Agregar botón "Cargar más correos" para carga infinita
- [x] T17: Actualizar refreshInbox para usar offset=0

## Files Modified
- `app/(crm)/email/page.tsx`
- `app/globals.css`
- `app/api/email/receive/route.ts`
- `lib/email/imapService.ts`
- `lib/email/types.ts`

## Verification
- [x] Click en email recibido llama a receiveOne
- [x] Muestra spinner + "Cargando..." mientras obtiene body
- [x] Después de obtener muestra contenido html (sanitizado) o text
- [x] Emails sent/mock muestran body directo
- [x] Imágenes, tablas, enlaces, blockquotes, código tienen estilos
- [x] Emails ordenados por fecha (más recientes primero)
- [x] Paginación con carga infinita funciona