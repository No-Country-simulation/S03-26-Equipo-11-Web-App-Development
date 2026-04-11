// Seed de Plantillas de Email - Startup CRM
// Crea plantillas predefinidas para diferentes etapas del funnel

import { db, testConnection } from "./index.js";
import { emailTemplates, users } from "./schema.js";
import { eq } from "drizzle-orm";
import { SEED_TEMPLATE_IDS, SEED_USER_IDS } from "./seed-constants.js";
import { pathToFileURL } from "url";

const now = new Date().toISOString();

// Variables disponibles para plantillas
// {{name}} - Nombre del contacto
// {{company}} - Empresa del contacto
// {{agentName}} - Nombre del agente
// {{date}} - Fecha actual

const seedTemplates = [
  {
    id: SEED_TEMPLATE_IDS.welcome,
    name: "Bienvenida - Primer Contacto",
    subject: "Bienvenido/a {{name}} - Gracias por tu interes en Startup CRM",
    body: `Hola {{name}},

Gracias por tu interes en Startup CRM!

Soy {{agentName}} y sere tu punto de contacto para ayudarte a conocer nuestra plataforma de gestion de relaciones con clientes.

En breve me pondre en contacto contigo para agendar una llamada donde podre entender mejor tus necesidades y mostrarte como podemos ayudarte.

 Mientras tanto, te comparto algunos recursos:

- Demo interactiva de la plataforma
- Casos de exito de empresas similares a {{company}}
- Comparativa de planes y precios

Quedo atento/a a tus comentarios.

Saludos cordiales,
{{agentName}}
Startup CRM`,
    category: "welcome" as const,
    variables: JSON.stringify(["{{name}}", "{{company}}", "{{agentName}}"]),
    active: true,
    createdBy: SEED_USER_IDS.admin,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_TEMPLATE_IDS.followup,
    name: "Seguimiento - 3 dias",
    subject: "{{name}}, tenemos algo especial para ti - Startup CRM",
    body: `Hola {{name}},

Espero que te encuentres bien!

Hace unos dias conversamos sobre como Startup CRM podria ayudar a {{company}} a mejorar la gestion de sus clientes.

Queria saber como vas con la evaluacion y si tienes alguna pregunta que pueda resolver.

Tengo algunas funcionalidades que podrian ser especialmente utiles para ustedes:

1. Dashboard con metricas en tiempo real
2. Integracion con WhatsApp y Email
3. Seguimiento automatico de tareas y recordatorios

Te parece si agendaos una llamada breve esta semana?

Quedo atento/a a tu respuesta.

Saludos,
{{agentName}}
Startup CRM`,
    category: "followup" as const,
    variables: JSON.stringify(["{{name}}", "{{company}}", "{{agentName}}"]),
    active: true,
    createdBy: SEED_USER_IDS.admin,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_TEMPLATE_IDS.proposal,
    name: "Propuesta Comercial",
    subject: "Propuesta personalizada para {{company}} - Startup CRM",
    body: `Hola {{name}},

Gracias por tu tiempo durante nuestra ultima llamada. Fue un placer conocer mas sobre {{company}} y como estan gestionando las relaciones con sus clientes actualmente.

Basandonos en lo que conversamos, he preparado una propuesta personalizada para ustedes:

DETALLES DE LA PROPUESTA
============================================
Plan: Profesional
Licencias: 5 usuarios
Precio: $299/mes

INCLUYE:
- Dashboard completo con metricas
- Integracion WhatsApp + Email
- Hasta 1,000 contactos
- 10 plantillas de email
- Recordatorios automaticos
- Soporte prioritario

La propuesta esta sujeta a cambios segun sus necesidades especificas.

Puedo agendar una llamada para revisar los detalles y resolver cualquier duda?

Quedo atento/a a tu confirmacion.

Saludos,
{{agentName}}
Startup CRM`,
    category: "proposal" as const,
    variables: JSON.stringify(["{{name}}", "{{company}}", "{{agentName}}"]),
    active: true,
    createdBy: SEED_USER_IDS.admin,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_TEMPLATE_IDS.reminder,
    name: "Recordatorio de Demo",
    subject: "Recordatorio: Demo programada para manana - Startup CRM",
    body: `Hola {{name}},

Este es un recordatorio de tu demo programada con Startup CRM.

Fecha: {{date}}
Hora: 10:00 AM
Duracion estimada: 30 minutos

Link de conexion: [INSERTAR LINK DE ZOOM/MEET]

Temas que cubriremos:
- Presentacion de la plataforma
- Casos de uso para {{company}}
- Preguntas y respuestas

Si necesitas reprogramar o tienes alguna consulta previa, no dudes en escribirme.

Nos vemos manana!

{{agentName}}
Startup CRM`,
    category: "reminder" as const,
    variables: JSON.stringify(["{{name}}", "{{company}}", "{{agentName}}", "{{date}}"]),
    active: true,
    createdBy: SEED_USER_IDS.admin,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: SEED_TEMPLATE_IDS.meeting,
    name: "Solicitud de Reunion",
    subject: "Agenda una reunion para conocer Startup CRM",
    body: `Hola {{name}},

Gracias por tu interes en Startup CRM!

Me gustaria agendar una breve llamada contigo para:

- Conocer mas sobre {{company}} y sus necesidades
- Mostrarte como Startup CRM puede ayudar
- Resolver cualquier pregunta que tengas

Tienes disponible alguna de estas franjas horarias esta semana?

- Lunes 10:00 - 11:00 AM
- Martes 2:00 - 3:00 PM
- Miercoles 10:00 - 11:00 AM
- Jueves 3:00 - 4:00 PM
- Viernes 11:00 - 12:00 PM

Tambien puedes sugerir el horario que mejor te convenga.

Quedo atento/a a tu confirmacion!

{{agentName}}
Startup CRM`,
    category: "custom" as const,
    variables: JSON.stringify(["{{name}}", "{{company}}", "{{agentName}}"]),
    active: true,
    createdBy: SEED_USER_IDS.admin,
    createdAt: now,
    updatedAt: now,
  },
];

// Nombres de categorias para display
const categoryNames: Record<string, string> = {
  welcome: "Bienvenida",
  followup: "Seguimiento",
  proposal: "Propuesta",
  reminder: "Recordatorio",
  custom: "Personalizado",
};

export default async function seedTemplatesData() {
  console.log("===========================================");
  console.log("SEED: Plantillas de Email");
  console.log("===========================================\n");

  // Test conexion
  if (!(await testConnection())) {
    console.error("No se puede conectar a la base de datos");
    process.exit(1);
  }

  console.log(`Creando ${seedTemplates.length} plantillas...\n`);

  let created = 0;
  let skipped = 0;

  for (const template of seedTemplates) {
    // Verificar si existe
    const existing = await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.name, template.name))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  - SKIP: ${template.name} (ya existe)`);
      skipped++;
      continue;
    }

    // Crear plantilla
    await db.insert(emailTemplates).values(template);
    const categoryLabel = categoryNames[template.category] || template.category;
    console.log(`  + CREATE: ${template.name}`);
    console.log(`           Categoria: ${categoryLabel}`);
    console.log(`           Asunto: ${template.subject}`);
    created++;
    console.log("");
  }

  console.log(`-------------------------------------------`);
  console.log(`Plantillas creadas: ${created}`);
  console.log(`Plantillas omitidas: ${skipped}`);
  console.log(`-------------------------------------------\n`);

  // Mostrar resumen
  console.log("PLANTILLAS DISPONIBLES:");
  console.log("===========================================");
  for (const tpl of seedTemplates) {
    console.log(`[${tpl.id}] ${tpl.name}`);
  }
  console.log("===========================================\n");
}

const isDirectRun = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;

if (isDirectRun) {
  seedTemplatesData()
    .then(() => {
      console.log("Seed completado exitosamente!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error en seed:", error);
      process.exit(1);
    });
}
