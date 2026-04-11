## Context

El endpoint `/api/email/receive` actualmente conecta directamente a IMAP cada vez que el usuario lo solicita, lo cual es lento y no persiste los emails. Se necesita un proceso automático que sincronice emails hacia la tabla `messages`.

**Estado actual:**
- `/api/email/receive` → conecta a IMAP, retorna lista, no persiste
- Schema tiene `email_sync_control` y `messages` con soporte para direccion
- No hay proceso automático de sync

**Restricciones:**
- Mantener `/api/email/receive` funcionando (sin cambios)
- Usar checkpoint para evitar duplicados
- Límite configurable por batch

## Goals / Non-Goals

**Goals:**
- Implementar sync automático de emails entrantes
- Usar checkpoint (last_processed_uid) para deduplicación
- Registrar en messages con direccion="entrante"
- Batch configurable por variable de entorno

**Non-Goals:**
- No modificar `/api/email/receive` existente
- No procesar emails salientes
- No modificar frontend

## Decisions

### 1. ¿Dónde implementar la lógica de sync?
**Decisión:** Nueva función en `lib/email/syncService.ts`
**Razón:** Separa responsabilidades de imapService y mantiene código limpio
**Alternativa:** Agregar a imapService → NO, mezclado con recibir

### 2. ¿Cómo manejar el checkpoint?
**Decisión:** Tabla `email_sync_control` con last_processed_uid
**Razón:** Simple y efectivo, ya definido en schema
**Alternativa:** Usar archivo → NO,-db es más confiable

### 3. ¿Cron o triggered?
**Decisión:** Ambos - cron para automático, endpoint para manual
**Razón:** El usuario puede querer forzar sync
**Alternativa:** Solo cron → No permite control manual

### 4. ¿Cuántos emails por batch?
**Decisión:** Paramétrico (EMAIL_SYNC_BATCH_SIZE, default 5)
**Razón:** Controlable para evitar saturación
**Alternativa:** Fixed → Menos flexible

## Risks / Trade-offs

- **[Riesgo]** IMAP puede fallar → **Mitigación**: Try-catch con logging, continuar aunque falle uno
- **[Riesgo]** UID no disponible en algunos servidores → **Mitigación**: Usar date como fallback
- **[Trade-off]** Procesamiento puede demorar → **Mitigación**: Batch pequeño, async

## Migration Plan

1. Agregar variables de entorno
2. Crear syncService.ts
3. Crear API route /api/email/receive-sync
4. Configurar cron job
5. Probar endpoint manual
6. Verificar registros en messages