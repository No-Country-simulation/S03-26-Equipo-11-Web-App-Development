// Conexión a Base de Datos SQLite/libSQL (Turso) - Next.js
// Usado por Drizzle ORM

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const localDatabaseUrl = process.env.DATABASE_URL || "file:D:/nc/002/nextjs_crm/tools/scripts/data/crm.db";
const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

export function resolveDatabaseUrl(): string {
  return tursoDatabaseUrl || localDatabaseUrl;
}

export function isLocalFileDatabase(url: string): boolean {
  return url.startsWith("file:");
}

const databaseUrl = resolveDatabaseUrl();

const client = createClient({
  url: databaseUrl,
  authToken: tursoAuthToken,
});

export const db = drizzle(client, { schema });

export async function testConnection(): Promise<boolean> {
  try {
    await client.execute("SELECT 1");
    console.log(`Database connection: OK (${databaseUrl})`);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export { client, databaseUrl };