# Tasks: Email Receive Integration

## Status: Done

## Implementation Tasks

- [x] T1: Agregar método GET en `/api/email/receive/route.ts`
- [x] T2: Definir tipo `ReceivedEmailData` en page.tsx
- [x] T3: Agregar estados `receivedEmails` e `isLoadingInbox`
- [x] T4: Crear función para fetch al endpoint
- [x] T5: Agregar useEffect para cargar emails al montar componente
- [x] T6: Combinar emails mock con recibidos en `allEmailsWithReceived`
- [x] T7: Aplicar estilos font-semibold para no leídos, font-medium para leídos
- [x] T8: Mostrar remitente (from) cuando no hay contacto vinculado
- [x] T9: Agregar paginación con estados currentPage y pageSize
- [x] T10: Agregar select para elegir pageSize (10, 20, 30, 50)
- [x] T11: Agregar botones de navegación (primera, anterior, siguiente, última)
- [x] T12: Resetear a página 1 al cambiar pageSize o search
- [x] T13: Mostrar controles de paginación solo si hay más de 1 página

## Files Modified
- `app/api/email/receive/route.ts`
- `app/(crm)/email/page.tsx`

## Verification
- [x] GET `/api/email/receive` retorna emails del IMAP
- [x] Bandeja de入口 muestra todos los emails (mock + recibidos)
- [x] Emails no leídos shown in bold
- [x] Emails leídos shown in normal text
- [x] Botón de refresh funciona