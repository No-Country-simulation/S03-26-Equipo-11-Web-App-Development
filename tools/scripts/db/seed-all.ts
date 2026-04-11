// Script Principal de Seed - Ejecuta todos los seeds
// Uso: npx tsx db/seed-all.ts

import { client, databaseUrl, testConnection } from "./index.js";
import * as schema from "./schema.js";

console.log("");
console.log("################################################");
console.log("#  STARTUP CRM - SEED DE BASE DE DATOS      #");
console.log("################################################");
console.log("");

// Funcion para crear tablas si no existen
async function createTables() {
  console.log("Verificando estructura de tablas...\n");

  // Crear tablas manualmente con SQL raw
  // (En produccion usar drizzle-kit push)
  
  const tableCreationSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'agent', 'user')),
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      stage TEXT NOT NULL DEFAULT 'new' CHECK(stage IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
      tags TEXT,
      last_contact TEXT,
      notes TEXT,
      avatar TEXT,
      assigned_to TEXT REFERENCES users(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS email_templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'custom' CHECK(category IN ('welcome', 'followup', 'proposal', 'reminder', 'custom')),
      variables TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_by TEXT REFERENCES users(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      contact_id TEXT REFERENCES contacts(id),
      user_id TEXT REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT NOT NULL,
      due_time TEXT,
      priority TEXT NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'cancelled', 'overdue')),
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      contact_id TEXT REFERENCES contacts(id),
      canal TEXT NOT NULL DEFAULT 'email' CHECK(canal IN ('whatsapp', 'email', 'sms')),
      direccion TEXT NOT NULL CHECK(direccion IN ('entrante', 'saliente')),
      contenido TEXT,
      asunto TEXT,
      fecha TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      leido INTEGER NOT NULL DEFAULT 0,
      entregado INTEGER NOT NULL DEFAULT 1,
      message_id TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
    CREATE INDEX IF NOT EXISTS idx_contacts_stage ON contacts(stage);
    CREATE INDEX IF NOT EXISTS idx_messages_contact ON messages(contact_id);
    CREATE INDEX IF NOT EXISTS idx_messages_canal ON messages(canal);
    CREATE INDEX IF NOT EXISTS idx_reminders_status ON reminders(status);
  `;

  try {
    await client.batch(
      tableCreationSQL
        .split(";")
        .map((statement) => statement.trim())
        .filter(Boolean)
        .map((statement) => ({ sql: statement, args: [] }))
    );
    console.log("  Tablas verificadas/creadas correctamente\n");
    return true;
  } catch (error) {
    console.error("  Error al crear tablas:", error);
    return false;
  }
}

// Ejecutar seeds individuales
async function runSeed(script: string, name: string) {
  console.log(`-------------------------------------------`);
  console.log(`Ejecutando: ${name}`);
  console.log(`-------------------------------------------\n`);
  
  try {
    // Dinamicamente importar el modulo
    const module = await import(`./${script}`);
    await module.default();
    return true;
  } catch (error) {
    console.error(`Error ejecutando ${name}:`, error);
    return false;
  }
}

// Funcion principal
async function main() {
  // Test conexion
  if (!(await testConnection())) {
    console.error("\nNo se puede conectar a la base de datos");
    console.error(`Verifica DATABASE_URL/TURSO_DATABASE_URL. Valor actual: ${databaseUrl}`);
    process.exit(1);
  }

  // Crear tablas
  if (!(await createTables())) {
    process.exit(1);
  }

  // Ejecutar seeds en orden
  const seeds = [
    { file: "users", name: "Usuarios" },
    { file: "contacts", name: "Contactos" },
    { file: "templates", name: "Plantillas de Email" },
    { file: "messages", name: "Messages" },
  ];

  console.log("");
  console.log("Ejecutando seeds...\n");

  let allSuccess = true;
  for (const seed of seeds) {
    const success = await runSeed(seed.file, seed.name);
    if (!success) {
      allSuccess = false;
    }
    console.log("");
  }

  // Resumen final
  console.log("################################################");
  console.log("#  RESUMEN                                    #");
  console.log("################################################\n");

  if (allSuccess) {
    console.log("Todos los seeds se ejecutaron correctamente!\n");
    console.log("DATOS CARGADOS:");
    console.log("  - 3 usuarios (admin + agentes)");
    console.log("  - 3 contactos de ejemplo");
    console.log("  - 5 plantillas de email");
    console.log("  - 3 mensajes de ejemplo");
    console.log("");
    console.log("CREDENCIALES DE ACCESO:");
    console.log("  Admin:  admin@startupcrm.com / StartupCRM123!");
    console.log("  Agente: agente1@startupcrm.com / StartupCRM123!");
    console.log("");
    console.log("ADVERTENCIA: Cambiar contrasenas en produccion!");
  } else {
    console.log("Algunos seeds fallaron. Revisar errores arriba.");
    process.exit(1);
  }

  console.log("\n################################################\n");
}

// Ejecutar
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error fatal:", error);
    process.exit(1);
  });
