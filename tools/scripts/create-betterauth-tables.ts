import { createClient } from "@libsql/client";

const tursoUrl = "libsql://crm-db-favian-medina-gemio.aws-us-east-1.turso.io";
const tursoToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU4NTgyNTIsImlkIjoiMDE5ZDc5NjUtNGMwMS03YjQ3LWIzNjktY2I3YjFlOWYxMzk4IiwicmlkIjoiN2I0ZmRlNzAtYzM1Zi00NGVjLWE4N2MtODcxYmFkNjllODExIn0.R275s9Bx0kTdRHHwmZYnu5iEvAP7XBLAtD9aSFZQ3MEou9fHhezsGv64Uvm7ahEvs2El15CG_L6qd6PsOYpBCw";

const client = createClient({ url: tursoUrl, authToken: tursoToken });

const tables = [
  `CREATE TABLE IF NOT EXISTS sessions (
    id text PRIMARY KEY NOT NULL,
    user_id text NOT NULL,
    expires_at integer NOT NULL,
    token text NOT NULL,
    created_at integer NOT NULL,
    updated_at integer NOT NULL,
    ip_address text,
    user_agent text
  )`,
  `CREATE INDEX IF NOT EXISTS session_user_id_idx ON sessions (user_id)`,
  `CREATE INDEX IF NOT EXISTS session_token_idx ON sessions (token)`,
  
  `CREATE TABLE IF NOT EXISTS accounts (
    id text PRIMARY KEY NOT NULL,
    user_id text NOT NULL,
    account_id text NOT NULL,
    provider_id text NOT NULL,
    access_token text,
    refresh_token text,
    id_token text,
    access_token_expires_at integer,
    refresh_token_expires_at integer,
    scope text,
    password text,
    created_at integer NOT NULL,
    updated_at integer NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS account_user_id_idx ON accounts (user_id)`,
  `CREATE INDEX IF NOT EXISTS account_provider_id_idx ON accounts (provider_id, account_id)`,
  
  `CREATE TABLE IF NOT EXISTS verifications (
    id text PRIMARY KEY NOT NULL,
    identifier text NOT NULL,
    value text NOT NULL,
    expires_at integer NOT NULL,
    created_at integer,
    updated_at integer
  )`,
  `CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verifications (identifier)`
];

async function createBetterAuthTables() {
  console.log("🔧 Creando tablas de Better Auth...\n");
  
  for (const sql of tables) {
    try {
      await client.execute(sql);
      console.log("✅", sql.substring(0, 40) + "...");
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : String(e);
      if (err.includes("already exists")) {
        console.log("⚠️  Ya existe");
      } else {
        console.log("❌", err);
      }
    }
  }
  
  // Ver tablas
  const result = await client.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  console.log("\n📋 Tablas en Turso:");
  for (const row of result.rows as {name: string}[]) {
    console.log("  -", row.name);
  }
}

createBetterAuthTables().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });