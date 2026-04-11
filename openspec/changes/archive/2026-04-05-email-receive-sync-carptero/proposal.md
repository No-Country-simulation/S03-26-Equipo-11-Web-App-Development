## Why

El sistema CRM necesita recibir emails entrantes de forma automática para mantener un registro completo de comunicaciones con contactos. Actualmente, el endpoint `/api/email/receive` conecta directamente a IMAP cada vez que el usuario lo solicita, lo cual es lento y no persiste los emails en la base de datos.

Se necesita implementar un proceso automático ("El Cartero Programado") que sincronice emails desde IMAP hacia la tabla `messages`, permitiendo que el frontend los muestre de forma instantánea sin esperar la conexión a IMAP.

## What Changes

- Crear API endpoint `/api/email/receive-sync` para sincronización
- Implementar proceso batch con checkpoint (last_processed_uid)
- Agregar variables de entorno configurables (batch size, cron interval)
- La tabla `messages` se actualiza con direction="entrante" para cada email procesado
- El endpoint `/api/email/receive` existente sigue funcionando sin cambios

## Capabilities

### New Capabilities
- `email-receive-sync`: Sincronización automática de emails entrantes con procesamiento por lotes y checkpoint

### Modified Capabilities
- (Ninguno - funcionalidad nueva)

## Impact

- **Dependencias**: Nuevas variables de entorno (EMAIL_SYNC_BATCH_SIZE, EMAIL_SYNC_CRON_INTERVAL)
- **API**: Nuevo endpoint `/api/email/receive-sync`
- **DB**: Tabla `messages` recibe registros de emails entrantes
- **Cron Job**: Procesamiento automático cada N minutos