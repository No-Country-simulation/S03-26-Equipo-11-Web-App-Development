// Seed de Mensajes - Startup CRM
// Crea mensajes de ejemplo en la tabla unificada

import { eq } from "drizzle-orm";
import { pathToFileURL } from "url";
import { db, testConnection } from "./index.js";
import { messages } from "./schema.js";
import { SEED_CONTACT_IDS } from "./seed-constants.js";

const seedMessages = [
  {
    id: "c1f4f6a1-7d11-4f2f-8a21-100000000001",
    contactId: SEED_CONTACT_IDS.carlos,
    canal: "email" as const,
    direccion: "entrante" as const,
    contenido: "Hola, quiero una demo de Startup CRM para mi equipo.",
    asunto: "Solicitud de demo",
    fecha: "2026-04-04T18:30:00.000Z",
    leido: false,
    entregado: true,
    metadata: { source: "email", priority: "high" },
    createdAt: "2026-04-04T18:30:00.000Z",
  },
  {
    id: "c1f4f6a1-7d11-4f2f-8a21-100000000002",
    contactId: SEED_CONTACT_IDS.ana,
    canal: "whatsapp" as const,
    direccion: "saliente" as const,
    contenido: "Hola Ana, te comparto la propuesta y quedo atenta a tus comentarios.",
    asunto: null,
    fecha: "2026-04-04T18:35:00.000Z",
    leido: true,
    entregado: true,
    metadata: { source: "whatsapp", template: "proposal-followup" },
    createdAt: "2026-04-04T18:35:00.000Z",
  },
  {
    id: "c1f4f6a1-7d11-4f2f-8a21-100000000003",
    contactId: SEED_CONTACT_IDS.roberto,
    canal: "sms" as const,
    direccion: "entrante" as const,
    contenido: "Confirmo recepción de la propuesta. La reviso mañana.",
    asunto: null,
    fecha: "2026-04-04T18:40:00.000Z",
    leido: false,
    entregado: true,
    metadata: { source: "sms", status: "received" },
    createdAt: "2026-04-04T18:40:00.000Z",
  },
];

export default async function seedMessagesData() {
  console.log("===========================================");
  console.log("SEED: Messages");
  console.log("===========================================\n");

  if (!(await testConnection())) {
    console.error("No se puede conectar a la base de datos");
    process.exit(1);
  }

  console.log(`Creando ${seedMessages.length} mensajes...\n`);

  let created = 0;
  let skipped = 0;

  for (const message of seedMessages) {
    const existing = await db
      .select()
      .from(messages)
      .where(eq(messages.id, message.id))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  - SKIP: ${message.id} (ya existe)`);
      skipped++;
      continue;
    }

    await db.insert(messages).values(message);
    console.log(`  + CREATE: ${message.canal} / ${message.direccion}`);
    console.log(`           Contacto: ${message.contactId}`);
    console.log(`           Contenido: ${message.contenido}`);
    created++;
    console.log("");
  }

  console.log("-------------------------------------------");
  console.log(`Mensajes creados: ${created}`);
  console.log(`Mensajes omitidos: ${skipped}`);
  console.log("-------------------------------------------\n");
}

const isDirectRun = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;

if (isDirectRun) {
  seedMessagesData()
    .then(() => {
      console.log("Seed completado exitosamente!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error en seed:", error);
      process.exit(1);
    });
}
