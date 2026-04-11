## Context

El endpoint `/api/email/send` actualmente solo envía emails via SMTP sin interactuar con la base de datos. Se necesita integrar con la tabla de contactos y la tabla unificada de messages para mantener un registro completo de la comunicación.

**Estado actual:**
- `/api/email/send` → solo nodemailer
- Schema existe en `tools/scripts/db/schema.ts` (SQLite/libSQL)
- No hay configuración de DB en Next.js

**Restricciones:**
- Usar Drizzle ORM (mismo que scripts de DB)
- Mantener compatibilidad con Turso (libSQL)
- Minimal changes al frontend existente

## Goals / Non-Goals

**Goals:**
- Verificar si email destinatario existe como contacto
- Crear contacto si no existe
- Enviar email exitosamente
- Registrar en tabla messages (canal=email, dirección=saliente)
- Usar transacciones para consistencia

**Non-Goals:**
- No modificar UI existente
- No integrar con WhatsApp/SMS
- No agregar autenticación avanzada
- No modificar estructura de tablas existentes

## Decisions

### 1. ¿Dónde crear la configuración de DB?
**Decisión:** Crear `lib/db/index.ts` en el proyecto Next.js
**Razón:** Mantiene configuración рядом con el código de la app, separado de scripts de migración
**Alternativa:** Reutilizar `tools/scripts/db/index.ts` → NO porque está en subdirectorio y tiene imports .js

### 2. ¿Cómo manejar el contacto si no existe?
**Decisión:** Crear automáticamente con nombre derivado del email (parte local)
**Razón:** Flujo simple sin requerir datos adicionales del request
**Alternativa:** Rechazar email → NO, el objetivo es crear registro automático

### 3. ¿Transacciones?
**Decisión:** Usar `db.transaction()` para atomicidad
**Razón:** Si falla el insert de message, no debe quedar contacto creado a medias
**Alternativa:** Sin transacciones → Riesgo de datos inconsistentes

### 4. ¿Schema copy vs import?
**Decisión:** Copiar schema a `lib/db/schema.ts`
**Razón:** Evitar imports complejos desde tools/scripts, mantener autonomía del código de app
**Alternativa:** Importar desde tools/scripts → Requiere configuración de paths compleja

## Risks / Trade-offs

- **[Riesgo]** Dependencias nuevas pueden tener conflictos → **Mitigación**: Verificar compatibilidad con Next.js 16
- **[Riesgo]** Email sin formato válido → **Mitigación**: Validar formato email en request
- **[Riesgo]** DB connection failure → **Mitigación**: Try-catch con mensajes de error claros
- **[Trade-off]** Crear contacto automático puede crear duplicates → **Mitigación**: Búsqueda por email exacto antes de crear

## Migration Plan

1. Instalación de dependencias npm
2. Copiar schema a lib/db/schema.ts
3. Crear lib/db/index.ts
4. Modificar API route
5. Probar endpoint con request real
6. Verificar registros en DB