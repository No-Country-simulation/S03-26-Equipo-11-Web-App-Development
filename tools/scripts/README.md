# Scripts de Base de Datos - Startup CRM

Scripts para gestion de base de datos SQLite/libSQL con Drizzle ORM.

## Contenido

| Archivo | Descripcion |
|---------|-------------|
| `db/schema.ts` | Definicion de todas las tablas |
| `db/index.ts` | Conexion a SQLite |
| `db/queries.ts` | Funciones utilitarias de queries |
| `db/users.ts` | Seed de usuarios (admin + agentes) |
| `db/contacts.ts` | Seed de contactos de ejemplo |
| `db/templates.ts` | Seed de plantillas de email |
| `db/seed-all.ts` | Ejecuta todos los seeds |
| `db/reset.ts` | Reset de base de datos |
| `drizzle.config.ts` | Configuracion Drizzle Kit |
| `package.json` | Dependencias |

---

## Instalacion

```bash
# Entrar al directorio
cd tools/scripts

# Instalar dependencias
npm install

# Crear .env local para scripts
copy .env.example .env
```

---

## Uso Rapido

```bash
# Ejecutar todos los seeds (crea todo de una vez)
npm run db:seed

# O directamente con tsx
npx tsx db/seed-all.ts
```

---

## Comandos Disponibles

### Seeds Individuales

```bash
# Solo usuarios
npm run db:seed:users

# Solo contactos
npm run db:seed:contacts

# Solo plantillas
npm run db:seed:templates
```

### Drizzle Kit

```bash
# Generar migraciones
npm run db:generate

# Push schema a BD
npm run db:push

# Abrir Drizzle Studio
npm run db:studio

# Verificar schema
npm run db:check
```

### Reset

```bash
# Reset completo (requiere confirmacion)
npx tsx db/reset.ts

# Reset forzado (sin confirmacion)
npx tsx db/reset.ts --force
```

---

## Datos Creados

### Usuarios

| Email | Password | Rol | Nombre |
|-------|----------|-----|--------|
| admin@startupcrm.com | StartupCRM123! | Admin | Administrador Sistema |
| agente1@startupcrm.com | StartupCRM123! | Agent | Juan Perez |
| agente2@startupcrm.com | StartupCRM123! | Agent | Maria Garcia |

### Contactos (3 de ejemplo)

| Nombre | Email | Empresa | Etapa |
|--------|-------|---------|-------|
| Carlos Mendoza | carlos.mendoza@techstartup.io | TechStartup S.A.C | Nuevo |
| Ana Lucia Fernandez | ana.fernandez@retailplus.pe | Retail Plus EIRL | Calificado |
| Roberto Silva | rsilva@consultoraabg.com | Consultora ABG | Propuesta |

### Plantillas de Email (5)

| Nombre | Categoria | Asunto |
|--------|-----------|--------|
| Bienvenida - Primer Contacto | welcome | Gracias por tu interes en Startup CRM |
| Seguimiento - 3 dias | followup | Tenemos algo especial para ti |
| Propuesta Comercial | proposal | Propuesta personalizada para tu empresa |
| Recordatorio de Demo | reminder | Recordatorio: Demo programada para manana |
| Solicitud de Reunion | custom | Agenda una reunion para conocer Startup CRM |

---

## Esquema de Base de Datos

### Tablas

```
users              - Usuarios del sistema
contacts           - Contactos/Leads
email_templates    - Plantillas de email
reminders          - Recordatorios/Tareas
messages           - Tabla unificada de mensajes
```

### Relaciones

```
users (1) ---> (N) contacts
users (1) ---> (N) reminders
users (1) ---> (N) email_templates
contacts (1) ---> (N) reminders
contacts (1) ---> (N) messages (historial unificado)
```

---

## Configuracion de Entorno

Crear archivo `.env` en `tools/scripts/`:

```env
DATABASE_URL=file:./data/crm.db
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
```

Opciones:

- `DATABASE_URL=file:./data/crm.db` usa SQLite/libSQL local.
- `TURSO_DATABASE_URL=libsql://...` y `TURSO_AUTH_TOKEN=...` usa Turso remoto.

Si `TURSO_DATABASE_URL` esta definido, tiene prioridad sobre `DATABASE_URL`.

Los scripts cargan variables desde:

- `.env` en la raiz del repo.
- `.env` dentro de `tools/scripts/` si existe, con prioridad sobre la raiz.

---

## Credenciales

> **ADVERTENCIA:** Cambiar contrasenas en produccion!

```
Admin:  admin@startupcrm.com / StartupCRM123!
Agente: agente1@startupcrm.com / StartupCRM123!
```

---

## Estructura de Archivos

```
tools/scripts/
|
|-- db/
|   |-- schema.ts       # Esquema Drizzle
|   |-- index.ts        # Conexion BD
|   |-- queries.ts      # Queries utiles
|   |-- users.ts       # Seed usuarios
|   |-- contacts.ts     # Seed contactos
|   |-- templates.ts    # Seed plantillas
|   |-- seed-all.ts    # Ejecuta todos
|   |-- reset.ts        # Reset BD
|
|-- drizzle.config.ts   # Config Drizzle
|-- package.json       # Dependencias
|-- README.md          # Este archivo
```

---

## Queries Comunes

Ver `db/queries.ts` para funciones como:

```typescript
import { getContactsByStage, searchContacts, getActiveAgents } from "./queries";

// Obtener contactos por etapa
const nuevos = await getContactsByStage("new");

// Buscar contactos
const results = await searchContacts("mendoza");

// Obtener agentes activos
const agents = await getActiveAgents();
```

---

## Links

- [Drizzle ORM Docs](https://orm.drizzle.team)
- [SQLite](https://sqlite.org)
- [ADR-001: SQLite + Drizzle](../../desitions/adr-001-sqlite-drizzle.md)

---

**Volver a**: [Documentacion](../../architecture/architecture.md)
