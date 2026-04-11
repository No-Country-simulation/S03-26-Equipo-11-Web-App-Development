// Conexion a Base de Datos SQLite/libSQL (Turso)

import "./env.js";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";
import * as schema from "./schema.js";

const localDatabaseUrl = process.env.DATABASE_URL || "file:./data/crm.db";
const tursoDatabaseUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

export function resolveDatabaseUrl(): string {
  return tursoDatabaseUrl || localDatabaseUrl;
}

export function isLocalFileDatabase(url: string): boolean {
  return url.startsWith("file:");
}

const databaseUrl = resolveDatabaseUrl();

if (isLocalFileDatabase(databaseUrl)) {
  const dbFilePath = databaseUrl.replace("file:", "");
  const dbDir = dirname(dbFilePath);

  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
    console.log(`Created database directory: ${dbDir}`);
  }
}

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

export async function closeConnection(): Promise<void> {
  client.close();
}

export { client, databaseUrl };
