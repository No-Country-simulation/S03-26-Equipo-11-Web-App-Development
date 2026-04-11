// Seed de Usuarios - Startup CRM
// Crea usuarios admin y agent para pruebas

import { db, testConnection } from "./index.js";
import { users } from "./schema.js";
import { eq } from "drizzle-orm";
import { createHash } from "crypto";
import { SEED_USER_IDS } from "./seed-constants.js";
import { pathToFileURL } from "url";

// Password temporal para desarrollo (NO usar en produccion)
const DEV_PASSWORD = "StartupCRM123!";

// Generar hash bcrypt simple para desarrollo
// En produccion usar bcrypt real
function hashPassword(password: string): string {
  // Simple hash para desarrollo - en produccion usar bcrypt
  return createHash("sha256").update(password + "startup-crm-salt").digest("hex");
}

const now = new Date().toISOString();

// Usuarios iniciales
const seedUsers = [
  {
    id: SEED_USER_IDS.admin,
    email: "admin@startupcrm.com",
    password: hashPassword(DEV_PASSWORD),
    name: "Administrador Sistema",
    role: "admin" as const,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_USER_IDS.agentOne,
    email: "agente1@startupcrm.com",
    password: hashPassword(DEV_PASSWORD),
    name: "Juan Perez",
    role: "agent" as const,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_USER_IDS.agentTwo,
    email: "agente2@startupcrm.com",
    password: hashPassword(DEV_PASSWORD),
    name: "Maria Garcia",
    role: "agent" as const,
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

export default async function seedUsersData() {
  console.log("===========================================");
  console.log("SEED: Usuarios");
  console.log("===========================================\n");

  // Test conexion
  if (!(await testConnection())) {
    console.error("No se puede conectar a la base de datos");
    process.exit(1);
  }

  console.log(`Creando ${seedUsers.length} usuarios...\n`);

  let created = 0;
  let skipped = 0;

  for (const user of seedUsers) {
    // Verificar si existe
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  - SKIP: ${user.email} (ya existe)`);
      skipped++;
      continue;
    }

    // Crear usuario
    await db.insert(users).values(user);
    console.log(`  + CREATE: ${user.name} (${user.email}) - Rol: ${user.role}`);
    created++;
  }

  console.log(`\n-------------------------------------------`);
  console.log(`Usuarios creados: ${created}`);
  console.log(`Usuarios omitidos: ${skipped}`);
  console.log(`-------------------------------------------\n`);

  // Mostrar credenciales
  console.log("CREDENCIALES DE DESARROLLO:");
  console.log("===========================================");
  console.log(`Admin:  admin@startupcrm.com / ${DEV_PASSWORD}`);
  console.log(`Agente: agente1@startupcrm.com / ${DEV_PASSWORD}`);
  console.log(`===========================================\n`);
  
  console.log("ADVERTENCIA: Cambiar contrasenas en produccion!");
  console.log("");
}

const isDirectRun = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;

if (isDirectRun) {
  seedUsersData()
    .then(() => {
      console.log("Seed completado exitosamente!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error en seed:", error);
      process.exit(1);
    });
}
