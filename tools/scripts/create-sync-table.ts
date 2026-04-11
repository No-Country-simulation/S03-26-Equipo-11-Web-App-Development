import { client } from "./db/index.js";

await client.execute(`
  CREATE TABLE IF NOT EXISTS email_sync_control (
    id INTEGER PRIMARY KEY DEFAULT 1,
    last_processed_uid INTEGER NOT NULL DEFAULT 0,
    last_sync_at TEXT
  )
`);

console.log("Tabla email_sync_control creada");
process.exit(0);
