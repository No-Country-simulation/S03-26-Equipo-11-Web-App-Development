## Why

Se necesita que el sistema de envío de email del CRM gestione automáticamente la relación con contactos: verificar si el destinatario existe como contacto, crearlo si no existe, y registrar el mensaje enviado en la tabla unificada de messages. Actualmente el endpoint `/api/email/send` solo envía el email sin ninguna integración con la base de datos.

## What Changes

- Crear helper de conexión a DB (`lib/db/index.ts`) usando Drizzle ORM con libSQL
- Copiar schema de DB a ubicación compartida (`lib/db/schema.ts`)
- Instalar dependencias `@libsql/client` y `drizzle-orm`
- Modificar `/api/email/send` para:
  - Buscar contacto existente por email destinatario
  - Crear nuevo contacto si no existe (nombre derivado del email)
  - Enviar email via SMTP
  - Insertar registro en tabla `messages` (canal=email, dirección=saliente)
- Usar transacciones Drizzle para consistencia de datos

## Capabilities

### New Capabilities
- `email-contact-integration`: Integración completa de envío de email con gestión de contactos y registro en messages

### Modified Capabilities
- (Ninguno - funcionalidad nueva)

## Impact

- **Dependencias**: Nuevas `@libsql/client`, `drizzle-orm`
- **API**: `/api/email/send` expande funcionalidad
- **DB**: Tabla `messages` recibe registros de emails enviados
- **Contactos**: Se crean nuevos registros si el destinatario no existe