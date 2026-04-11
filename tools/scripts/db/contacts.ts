// Seed de Contactos - Startup CRM
// Crea 3 contactos de ejemplo con diferentes etapas del funnel

import { db, testConnection } from "./index.js";
import { contacts, users } from "./schema.js";
import { eq } from "drizzle-orm";
import { SEED_CONTACT_IDS, SEED_USER_IDS } from "./seed-constants.js";
import { pathToFileURL } from "url";

const now = new Date().toISOString();

// Contactos iniciales
const seedContacts = [
  {
    id: SEED_CONTACT_IDS.carlos,
    name: "Carlos Mendoza",
    email: "carlos.mendoza@techstartup.io",
    phone: "+51 987 654 321",
    company: "TechStartup S.A.C",
    stage: "new" as const,
    tags: JSON.stringify(["tech", "startup", "lead-frio"]),
    lastContact: new Date().toISOString(),
    notes: "Contacto inicial via LinkedIn. Interesado en CRM basico.",
    assignedTo: SEED_USER_IDS.agentOne,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_CONTACT_IDS.ana,
    name: "Ana Lucia Fernandez",
    email: "ana.fernandez@retailplus.pe",
    phone: "+51 912 345 678",
    company: "Retail Plus EIRL",
    stage: "qualified" as const,
    tags: JSON.stringify(["retail", "pyme", "lead-caliente"]),
    lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Reunio via Zoom. Necesita gestion de inventario + CRM. Budget: $500/mes.",
    assignedTo: SEED_USER_IDS.agentOne,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_CONTACT_IDS.roberto,
    name: "Roberto Silva",
    email: "rsilva@consultoraabg.com",
    phone: "+51 956 123 789",
    company: "Consultora ABG",
    stage: "proposal" as const,
    tags: JSON.stringify(["consultoria", "enterprise", "proposal"]),
    lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    notes: "Propuesta enviada el 15/03. Esperando respuesta. Necesita 5 licencias.",
    assignedTo: SEED_USER_IDS.agentTwo,
    createdAt: now,
    updatedAt: now,
  },
];

// Nombres de etapas para display
const stageNames: Record<string, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  proposal: "Propuesta",
  won: "Ganado",
  lost: "Perdido",
};

export default async function seedContactsData() {
  console.log("===========================================");
  console.log("SEED: Contactos");
  console.log("===========================================\n");

  // Test conexion
  if (!(await testConnection())) {
    console.error("No se puede conectar a la base de datos");
    process.exit(1);
  }

  // Verificar que existe usuario agente
  const agent = await db
    .select()
    .from(users)
    .where(eq(users.email, "agente1@startupcrm.com"))
    .limit(1);

  if (agent.length === 0) {
    console.log("ADVERTENCIA: No existe usuario agente. Ejecutar users.ts primero.");
    console.log("Los contactos se crearan sin asignacion.\n");
  }

  console.log(`Creando ${seedContacts.length} contactos...\n`);

  let created = 0;
  let skipped = 0;

  for (const contact of seedContacts) {
    // Verificar si existe
    const existing = await db
      .select()
      .from(contacts)
      .where(eq(contacts.email, contact.email))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  - SKIP: ${contact.name} (${contact.email}) ya existe`);
      skipped++;
      continue;
    }

    // Crear contacto
    await db.insert(contacts).values(contact);
    const stageLabel = stageNames[contact.stage] || contact.stage;
    console.log(`  + CREATE: ${contact.name}`);
    console.log(`           Empresa: ${contact.company}`);
    console.log(`           Email: ${contact.email}`);
    console.log(`           Etapa: ${stageLabel}`);
    console.log(`           Tags: ${contact.tags}`);
    created++;
    console.log("");
  }

  console.log(`-------------------------------------------`);
  console.log(`Contactos creados: ${created}`);
  console.log(`Contactos omitidos: ${skipped}`);
  console.log(`-------------------------------------------\n`);
}

const isDirectRun = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;

if (isDirectRun) {
  seedContactsData()
    .then(() => {
      console.log("Seed completado exitosamente!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error en seed:", error);
      process.exit(1);
    });
}
