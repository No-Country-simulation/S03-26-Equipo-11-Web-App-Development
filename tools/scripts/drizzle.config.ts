// Configuracion de Drizzle Kit
// Uso: npx drizzle-kit generate | push | studio

import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || "file:./data/crm.db";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: databaseUrl,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  verbose: true,
  strict: true,
  tablesFilter: ["*"],
});
