// Conexión a Base de Datos SQLite/libSQL (Turso) - Next.js
// Usado por Drizzle ORM

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

// Helper para obtener la configuración de la base de datos de forma dinámica
function getDbConfig() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  const localUrl = process.env.DATABASE_URL || "file:./data/crm.db";

  // Si tenemos URL de Turso, la priorizamos (Producción)
  if (tursoUrl) {
    return {
      url: tursoUrl,
      authToken: tursoToken,
    };
  }

  // Fallback a local
  return {
    url: localUrl,
  };
}

const config = getDbConfig();
const client = createClient(config);

export const db = drizzle(client, { schema });

export async function testConnection(): Promise<boolean> {
  try {
    await client.execute("SELECT 1");
    console.log(`Database connection: OK (${config.url})`);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export { client, config as dbConfig };
