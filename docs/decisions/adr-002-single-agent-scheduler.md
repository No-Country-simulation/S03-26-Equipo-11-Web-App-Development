# ADR-002: Sistema de Agente Unico para Scheduling de Tareas

**Estado:** Accepted  
**Fecha:** 2026-04-04  
**Decisor(es):** Equipo 11

---

## Resumen

Implementar un **sistema de scheduling basado en un solo agente** que procese todas las tareas en cola, evitando la complejidad de round-robin y la saturacion de multiples agentes.

---

## Contexto

En un sistema CRM con automatizaciones (recordatorios, envios de email programados, seguimientos), se necesita un mecanismo para procesar tareas programadas y eventos asincronos.

### Problemas Identificados con Multi-Agente

1. **Round-Robin clasico**
   - Agentes pueden estar saturados mientras otros estan ociosos
   - Dificil conocer la carga real de cada agente
   - Deadlocks cuando se agotan los agentes disponibles

2. **Saturacion de agentes**
   - Un agente recibe mas tareas de las que puede procesar
   - Backlog crece sin control
   - Tareas criticas pueden retrasarse

3. **Estado distribuido**
   - Dificil mantener estado consistente entre agentes
   - Necesidad de lock/distributed mutex
   - Complejidad en manejo de errores

### Requisitos del Sistema

- Procesar recordatoriosautomaticos
- Enviar emails programados
- Actualizar estados de contactos segun cron
- Notificaciones de seguimiento
- Manejo de retries en caso de fallo

---

## Decision

**Usar un solo agente (worker) con cola de prioridad para procesar todas las tareas asincronas.**

### Arquitectura Propuesta

```
+------------------+     +------------------+     +------------------+
|   API Routes    | --> |   Task Queue     | --> |   Agent Worker   |
|   (Enqueue)     |     |   (BullMQ/Redis) |     |   (Single)       |
+------------------+     +------------------+     +------------------+
                                                          |
                                                          v
                                                 +------------------+
                                                 |   Task Handler   |
                                                 |   - Email Send   |
                                                 |   - Reminders    |
                                                 |   - Updates      |
                                                 +------------------+
```

### Implementacion Simplificada

```typescript
// lib/scheduler/agent.ts
import { Queue, Worker } from "bullmq";
import { drizzle } from "@/lib/db";

// Cola unica con prioridades
const taskQueue = new Queue("crm-tasks", {
  connection: { host: process.env.REDIS_HOST, port: 6379 }
});

// Un solo worker procesando tareas
const agentWorker = new Worker(
  "crm-tasks",
  async (job) => {
    const { type, payload, priority } = job.data;
    
    switch (type) {
      case "email":
        return await processEmailTask(payload);
      case "reminder":
        return await processReminderTask(payload);
      case "contact_update":
        return await processContactUpdate(payload);
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  },
  { connection: { host: process.env.REDIS_HOST, port: 6379 } }
);

// Enqueue tareas con prioridad
async function scheduleTask(
  type: "email" | "reminder" | "contact_update",
  payload: Record<string, unknown>,
  priority: number = 0
) {
  await taskQueue.add(type, payload, { priority });
}
```

### Modelo de Prioridades

| Prioridad | Rango | Uso |
|-----------|-------|-----|
| Critica | 1-10 | Notificaciones de alta urgencia |
| Normal | 11-20 | Emails programados, recordatorios |
| Baja | 21-30 | Limpieza, sincronizaciones |

### Manejo de Concurrencia

```typescript
// Configuracion del worker
const agentWorker = new Worker("crm-tasks", handler, {
  connection: redisConfig,
  concurrency: 5,           // Maximo 5 tareas simultaneas
  maxStalledCount: 3,       // Reintentos maximos
  stalledInterval: 30000,   // Check de stalled cada 30s
});
```

---

## Consecuencias

### Positivas

1. **Simplicidad operacional**
   - Un solo punto de control
   - Logs centralizados
   - Monitoreo sencillo

2. **Evita saturacion**
   - Cola priorizada inteligente
   - Backpressure natural
   - Sin competencia entre agentes

3. **Estado consistente**
   - Un solo proceso modifica datos
   - Sin race conditions
   - Transacciones simples

4. **Costos optimizados**
   - Un worker = menos recursos
   - Ideal para Vercel Serverless Functions

5. **Tolerancia a fallos**
   - BullMQ maneja retries
   - Cola persistente en Redis
   - Recovery automatico

### Negativas

1. **Punto unico de fallo**
   - Si el worker cae, no hay procesamiento
   - Necesita Redis siempre disponible

2. **Limite de throughput**
   - Un agente procesa secuencialmente (con concurrency)
   - Para alta carga, puede ser cuello de botella

3. **No aprovecha paralelismo multi-core**
   - Un proceso = una CPU (sin workers adicionales)

### Compensaciones

| Escenario | Un Agente | Multi-Agente |
|-----------|-----------|--------------|
| Carga normal | Suficiente | Overhead |
| Alta carga | Limitado | Escala mejor |
| Debugging | Simple | Complejo |
| Costo infra | Bajo | Alto (mas workers) |

---

## Alternativas Consideradas

### 1. Round-Robin Clasico

```
Agente1 -> Agente2 -> Agente3 -> Agente1
```

**Problemas:**
- No considera carga actual
- Agentes pueden saturarse
- Dificil balanceo dinamico

**Razon de rechazo:** Complejidad innecesaria para el volumen esperado.

### 2. Task Queue con Múltiples Consumers

```typescript
// 3 workers escuchando la misma cola
const workers = [
  new Worker("tasks", handler),
  new Worker("tasks", handler),
  new Worker("tasks", handler),
];
```

**Problemas:**
- Misma tarea puede ser tomada por multiples workers (requiere lock)
- Estado distribuido complejo
- Dificil debugging

**Razon de rechazo:** Overhead de sincronizacion.

### 3. Cron Jobs Individuales

```bash
# Cada tarea tiene su propio cron
*/5 * * * * node scripts/send-emails.js
*/10 * * * * node scripts/check-reminders.js
```

**Problemas:**
- Sin deduplicacion
- Sin retry automatico
- Cada script es un proceso independiente

**Razon de rechazo:** No hay visibility ni control centralizado.

### 4. Serverless Functions como Workers

```typescript
// Vercel Cron + API Routes
export async function GET() {
  await processTasks();
}
```

**Problemas:**
- Timeout de funciones serverless
- No hay persistencia de estado
- Ejecuta todo o nada

**Razon de rechazo:** No es ideal para tareas largas o con retries.

---

## Implementacion en Vercel

### Opcion A: BullMQ + Upstash Redis (Recomendado)

```typescript
// Usar Upstash Redis (serverless-friendly)
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});
```

### Opcion B: Vercel Cron + API Routes (Simplificado)

```typescript
// app/api/cron/agent/route.ts
export async function GET(request: Request) {
  // Verificar autenticacion del cron
  if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Procesar tareas pendientes
  const tasks = await db.select().from(pendingTasks).limit(10);
  for (const task of tasks) {
    await processTask(task);
    await db.update(pendingTasks).set({ status: "completed" }).where(eq(task.id, task.id));
  }

  return Response.json({ processed: tasks.length });
}
```

**Configuracion vercel.json:**
```json
{
  "crons": [
    {
      "path": "/api/cron/agent",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

---

## Comparacion Final

| Criterio | Agente Unico | Multi-Agente | Veredicto |
|----------|--------------|--------------|-----------|
| Complejidad | Baja | Alta | Un Agente |
| Costo | Bajo | Alto | Un Agente |
| Escalabilidad | Moderada | Alta | Depende |
| Debugging | Simple | Dificil | Un Agente |
| Tolerancia fallos | Media | Alta | Multi-Agente |
| Throughput | Suficiente | Mayor | Depende |

**Para Startup CRM (volumen medio-bajo): Un Agente Unico es la mejor eleccion.**

---

## Notas

- **Fecha de revision**: 2026-07-04
- **Trigger**: Si throughput < tareas generadas o latency > 5s promedio

---

**Anterior**: [ADR-001](adr-001-sqlite-drizzle.md)  
**Posterior**: N/A
