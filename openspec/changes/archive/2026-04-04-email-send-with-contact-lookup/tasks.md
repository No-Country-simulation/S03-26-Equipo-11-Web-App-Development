## 1. Dependencias

- [x] 1.1 Instalar `@libsql/client` y `drizzle-orm` en package.json

## 2. Schema de Base de Datos

- [x] 2.1 Copiar `tools/scripts/db/schema.ts` a `lib/db/schema.ts`

## 3. Configuración de DB

- [x] 3.1 Crear `lib/db/index.ts` con configuración Drizzle (client, drizzle, connection)

## 4. Tipos de Email

- [x] 4.1 Modificar `lib/email/types.ts` - cambiar `contactId?: number` a `contactId?: string`

## 5. API Route

- [x] 5.1 Modificar `app/api/email/send/route.ts` con flujo completo:
  - Buscar contacto por email
  - Crear nuevo contacto si no existe
  - Enviar email via SMTP
  - Insertar en tabla messages con transacción
  - Manejo de errores apropiados

## 6. Verificación y Pruebas

- [x] 6.1 Verificar que el endpoint funcione con Postman/curl
- [x] 6.2 Verificar que se cree el contacto en la DB
- [x] 6.3 Verificar que se registre en la tabla messages