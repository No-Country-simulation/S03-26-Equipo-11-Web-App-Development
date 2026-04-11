# ADR-001: Base de Datos SQLite con Drizzle ORM

**Estado:** Accepted  
**Fecha:** 2026-04-04  
**Decisor(es):** Equipo 11

---

## Resumen

Usar **SQLite** como base de datos local con **Drizzle ORM** para la persistencia de datos del CRM, permitiendo una migracion sencilla a PostgreSQL en el futuro si es necesario.

---

## Contexto

Startup CRM es un sistema CRM disenado para startups que necesitan gestionar contactos, mensajes y recordatorios. El equipo de desarrollo es pequeno (7 personas) y se requiere:

1. **Simplicidad operacional** - Sin necesidad de administrar servidores de base de datos externos
2. **Desarrollo rapido** - Schema simple y migrations automaticas
3. **Portabilidad** - Base de datos que pueda incluirse en el repositorio para desarrollo local
4. **Costo cero** - Sin costos de hosting para la base de datos
5. **Escalabilidad futura** - Capacidad de migrar a PostgreSQL si el proyecto crece

### Restricciones Identificadas

- **Recursos limitados**: El equipo no tiene experiencia con administracion de PostgreSQL/MySQL
- **Tiempo de desarrollo**: Necesidad de iterar rapidamente sin overhead de configuracion
- **Prototipo**: Se busca validar el producto antes de invertir en infraestructura compleja

---

## Decision

**Usar SQLite como motor de base de datos primario con Drizzle ORM como capa de abstraccion.**

### Tecnologias Seleccionadas

| Componente | Tecnologia | Version |
|------------|-----------|---------|
| Motor BD | SQLite | 3.x |
| ORM | Drizzle ORM | Latest |
| Migration | Drizzle Kit | Latest |

### Schema Inicial

```typescript
// lib/db/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  stage: text("stage", { enum: ["new", "contacted", "qualified", "proposal", "won", "lost"] }).notNull().default("new"),
  tags: text("tags"), // JSON array
  lastContact: text("last_contact"),
  avatar: text("avatar"),
  notes: text("notes"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const whatsappMessages = sqliteTable("whatsapp_messages", {
  id: text("id").primaryKey(),
  contactId: text("contact_id").references(() => contacts.id),
  text: text("text").notNull(),
  timestamp: text("timestamp").notNull(),
  sent: integer("sent", { mode: "boolean" }).notNull().default(false),
});

export const emailMessages = sqliteTable("email_messages", {
  id: text("id").primaryKey(),
  contactId: text("contact_id").references(() => contacts.id),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  timestamp: text("timestamp").notNull(),
  sent: integer("sent", { mode: "boolean" }).notNull().default(false),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  labels: text("labels"), // JSON array
});

export const reminders = sqliteTable("reminders", {
  id: text("id").primaryKey(),
  contactId: text("contact_id").references(() => contacts.id),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: text("due_date").notNull(),
  dueTime: text("due_time"),
  priority: text("priority", { enum: ["low", "medium", "high"] }).notNull().default("medium"),
  status: text("status", { enum: ["pending", "completed", "overdue"] }).notNull().default("pending"),
  createdAt: text("created_at").notNull(),
});
```

### Ubicacion del Archivo

```
drizzle/
├── db/
│   ├── index.ts        # Cliente de conexion
│   ├── schema.ts      # Definicion de tablas
│   └── migrations/    # Archivos de migracion
├── drizzle.config.ts   # Configuracion de Drizzle Kit
└── .env.local         # DATABASE_URL=file:./data/crm.db
```

---

## Consecuencias

### Positivas

1. **Simplicidad**: No requiere instalacion de software adicional (MySQL/PostgreSQL)
2. **Portabilidad**: La base de datos es un archivo que se puede compartir facilmente
3. **Desarrollo local**: Ideal para desarrollo sin conexion a internet
4. **Rendimiento**: Excelente para operaciones de lectura/escritura simples
5. **Costo**: Cero costo de infraestructura
6. **Drizzle ORM**: 
   - Type-safety completo con TypeScript
   - Migrations automaticas con drizzle-kit
   - Query builder tipado
   - Migracion futura sencilla a PostgreSQL

### Negativas

1. **Concurrencia limitada**: SQLite usa bloqueos de escritura (no ideal para muchas writes simultaneas)
2. **Escala horizontal**: No soporta multiples instancias de escritura
3. **No recomendado para produccion de alto trafico**: Vercel usa sistemas de archivos efimeros
4. **Caracteristicas limitadas**: Sin stored procedures, triggers avanzados

### Compensaciones

| Aspecto | SQLite + Drizzle | PostgreSQL |
|---------|-------------------|------------|
| Setup inicial | Minutos | Horas |
| Costo hosting | $0 | $5-20/mes |
| Concurrencia | Baja | Alta |
| Full-text search | Limitado | Avanzado |
| Migracion futura | Drizzle lo soporta | - |

---

## Alternativas Consideradas

### 1. PostgreSQL (Vercel Postgres)

```typescript
// Pros: Alta concurrencia, escalabilidad, full-text search
// Contras: Costo adicional, complejidad operacional
```

**Razon de rechazo:** Mayor complejidad para un prototipo, costo adicional innecesario.

### 2. MongoDB

```typescript
// Pros: Flexible schema, documentado
// Contras: Curva de aprendizaje, no relacional
```

**Razon de rechazo:** El modelo de datos es fundamentalmente relacional (contacts -> messages).

### 3. Supabase (PostgreSQL)

```typescript
// Pros: Backend listo, APIs automaticas
// Contras: Costo, vendor lock-in
```

**Razon de rechazo:** Demasiado para la fase actual del proyecto.

### 4. JSON en archivos locales

```typescript
// Pros: Maxima simplicidad
// Contras: Sin queries, corrupcion de datos, sin schema enforcement
```

**Razon de rechazo:** No escala, propenso a errores.

---

## Plan de Implementacion

### Fase 1: SQLite Local (Prototipo)
```
1. Instalar drizzle-orm y better-sqlite3
2. Definir schema inicial
3. Generar migraciones con drizzle-kit
4. Implementar CRUD operations
5. Testing local
```

### Fase 2: Produccion Vercel
```
Opcion A: Turso (SQLite edge)
  - LibSQL compatible
  - Replicacion global
  - $0 para dev, $5/mes para prod

Opcion B: Migrar a Vercel Postgres
  - Usar migrate() de Drizzle
  - Compatible con schema actual
```

---

## Notas

- **Fecha de revision**: 2026-07-04 (3 meses)
- **Trigger de revision**: Si el tiempo de respuesta > 500ms o trafico > 1000 usuarios activos

---

**Anterior**: N/A  
**Posterior**: [ADR-002](adr-002-single-agent-scheduler.md)
