## 1. Configuración de Entorno

- [x] 1.1 Agregar `EMAIL_SYNC_BATCH_SIZE` en `.env` (default: 5)
- [x] 1.2 Agregar `EMAIL_SYNC_CRON_INTERVAL` en `.env` (default: "*/3 * * * *")
- [x] 1.3 Agregar variables en `.env.example`

## 2. Schema de Base de Datos

- [x] 2.1 Verificar tabla `email_sync_control` en `lib/db/schema.ts`
- [x] 2.2 Agregar columna `message_id` a tabla `messages` en DB

## 3. Servicio de Sync

- [x] 3.1 Crear `lib/email/syncService.ts` con función `syncNewEmails()`
- [x] 3.2 Implementar lectura de checkpoint (lastProcessedMessageId)
- [x] 3.3 Implementar búsqueda de emails en IMAP
- [x] 3.4 Implementar búsqueda/creación de contacto por email.remitente
- [x] 3.5 Implementar inserción en messages con direccion="entrante"
- [x] 3.6 Implementar actualización de checkpoint

## 4. API Route

- [x] 4.1 Crear `app/api/email/receive-sync/route.ts`
- [x] 4.2 Endpoint GET para ejecutar sync manual
- [x] 4.3 Leer batch size de variable de entorno
- [x] 4.4 Retornar cantidad procesada y timestamp

## 5. Documentación

- [x] 5.1 Crear ADR-03 en `docs/decisions/adr-03-receiveemail-flux.md`
- [x] 5.2 Actualizar README.md de decisions

## 6. Verificación y Pruebas

- [x] 6.1 Probar endpoint `/api/email/receive-sync` manualmente
- [x] 6.2 Verificar registros en tabla messages con direccion="entrante"
- [x] 6.3 Verificar actualización de email_sync_control
- [x] 6.4 Verificar Swagger UI muestra el endpoint