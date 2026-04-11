# Architecture Decision Records (ADRs)

Este directorio contiene las decisiones arquitecturales del proyecto Startup CRM.

## Formato ADR

Cada ADR sigue el formato:
- **Estado**: Proposed, Accepted, Deprecated, Superseded
- **Contexto**: Situacion y restricciones
- **Decision**: La eleccion tomada
- **Consecuencias**: Positivas y negativas

## Indice de Decisiones

| ID | Titulo | Estado | Fecha |
|----|--------|--------|-------|
| [ADR-001](adr-001-sqlite-drizzle.md) | Base de Datos SQLite con Drizzle ORM | Accepted | 2026-04-04 |
| [ADR-002](adr-002-single-agent-scheduler.md) | Sistema de Agente Unico para Scheduling | Accepted | 2026-04-04 |
| [ADR-003](adr-03-receiveemail-flux.md) | Flujo de Recepción de Emails - "El Cartero Programado" | Accepted | 2026-04-04 |

---

## Resumen de Decisiones

### ADR-001: Base de Datos SQLite con Drizzle ORM

**Decision:** Usar SQLite como base de datos local con Drizzle ORM para persistencia.

**Razon Principal:** 
- Simplicidad operacional (sin servidor de BD externo)
- Ideal para startups con equipos pequenos
- Suficiente para datos relacionales simples
- Migracion futura facil a PostgreSQL si se requiere

### ADR-002: Sistema de Agente Unico para Scheduling

**Decision:** Implementar un solo agente que procese todas las tareas en cola.

**Razon Principal:**
- Evita complejidad de round-robin
- Elimina problemas de saturacion de agentes
- Simplifica el manejo de estado y errores
- Menor overhead de coordinacion

### ADR-003: Flujo de Recepción de Emails - "El Cartero Programado"

**Decision:** Implementar sync automático de emails entrantes mediante un proceso programado (cron) que consulta IMAP, procesa nuevos emails y los registra en la tabla messages.

**Razon Principal:**
- El frontend ya no espera. Solo lee de BD (casi 0 segundos)
- Procesamiento por lotes con checkpoint (max 5 emails por ronda)
- Deduplicación por UID de IMAP (rápido y eficiente)
- Escalabilidad: el cartero trabaja solo en segundo plano
- Mantiene back y front actuales (lento pero seguro)

**Tablas Involucradas:**
- `email_sync_control`: Control de checkpoint (lastProcessedMessageId, lastSyncAt)
- `messages`: Registro de emails entrantes (direccion = "entrante")
- `contacts`: Fichas de clientes (creación automática si no existe)

**Endpoints:**
- `/api/email/receive-sync`: Sync automático (cron cada 3 min)
- `/api/email/sync-status`: Verificar estado del sync

---

**Volver a**: [Architecture](../architecture/architecture.md)
