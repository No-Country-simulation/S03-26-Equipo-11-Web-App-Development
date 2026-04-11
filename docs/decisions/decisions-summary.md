# Resumen Ejecutivo de Decisiones Tecnicas

**Proyecto:** Startup CRM  
**Fecha:** 2026-04-04  
**Equipo:** 11

---

## Decisiones Tomadas

### 1. Base de Datos: SQLite + Drizzle ORM

| Aspecto | Decision |
|---------|----------|
| Motor | SQLite |
| ORM | Drizzle ORM |
| Migraciones | Drizzle Kit |
| Ubicacion | Archivo local `data/crm.db` |

**Por que:**
- Cero costo de infraestructura
- Desarrollo local sin dependencias externas
- Migracion futura a PostgreSQL si es necesario
- Drizzle proporciona type-safety completo

**Futuro posible:**
- Turso (SQLite edge) para produccion
- O migracion a Vercel Postgres

---

### 2. Sistema de Scheduling: Agente Unico

| Aspecto | Decision |
|---------|----------|
| Arquitectura | Un solo worker |
| Cola | BullMQ + Redis |
| Concurrencia | 5 tareas simultaneas |
| Prioridades | 3 niveles (critica, normal, baja) |

**Por que:**
- Evita complejidad de round-robin
- Sin problemas de saturacion de agentes
- Estado consistente en un solo proceso
- Simple de debuggear y monitorear
- Ideal para volumen de startup

---

## Stack Tecnico Final

```
+------------------+
|    Frontend      |
|    Next.js 16    |
+------------------+
         |
         v
+------------------+
|    API Routes    |
|    (REST/JSON)   |
+------------------+
         |
    +----+----+
    |         |
    v         v
+-------+  +--------+
| SQLite|  | BullMQ |
| (Drizzle)| | (Redis)|
+-------+  +--------+
```

---

## Comparacion con Alternativas

| Decision | Elegido | Alternativa rechazada | Razon |
|----------|---------|----------------------|-------|
| BD | SQLite | PostgreSQL | Simplicidad, costo cero |
| ORM | Drizzle | Prisma | Type-safe, ligero |
| Scheduler | Agente Unico | Multi-agente | Menos complejidad |
| Cola | BullMQ | No queue | Persistencia, retries |

---

## Impacto en Desarrollo

### Ventajas para el equipo (7 personas)

1. **Tiempo de setup reducido**
   - SQLite: minutos vs horas de configuracion de PostgreSQL
   - Agente unico: no hay que coordinar multiples servicios

2. **Facilidad de onboarding**
   - Cualquier miembro puede levantar el proyecto localmente
   - Documentacion clara y concisa

3. **Debugging simple**
   - Un solo flujo: request -> BD
   - Un solo worker: cola -> proceso

### Desventajas aceptadas

1. **Escalabilidad limitada**
   - SQLite no maneja alta escritura concurrente
   - Decision: optimizar queries antes de migrar

2. **Single point of failure**
   - Si el agente cae, no hay procesamiento
   - Mitigacion: Redis provee persistencia de cola

---

## Roadmap de Migraciones Futuras

```
Fase Actual (Prototipo)
    |
    v
SQLite Local + Agente Unico + Redis

Fase 2 (Crecimiento)
    |
    v
Turso (SQLite Edge) + Agente Unico + Redis

Fase 3 (Escala)
    |
    v
PostgreSQL (Vercel Postgres) + Workers Multiples
```

---

## Links

- [ADR-001: SQLite + Drizzle](adr-001-sqlite-drizzle.md)
- [ADR-002: Agente Unico](adr-002-single-agent-scheduler.md)
- [Architecture](../architecture/architecture.md)

---

**Proxima revision:** 2026-07-04
