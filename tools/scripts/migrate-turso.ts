import { createClient } from "@libsql/client";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tursoUrl = "libsql://crm-db-favian-medina-gemio.aws-us-east-1.turso.io";
const tursoToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU4NTgyNTIsImlkIjoiMDE5ZDc5NjUtNGMwMS03YjQ3LWIzNjktY2I3YjFlOWYxMzk4IiwicmlkIjoiN2I0ZmRlNzAtYzM1Zi00NGVjLWE4N2MtODcxYmFkNjllODExIn0.R275s9Bx0kTdRHHwmZYnu5iEvAP7XBLAtD9aSFZQ3MEou9fHhezsGv64Uvm7ahEvs2El15CG_L6qd6PsOYpBCw";

if (!tursoUrl || !tursoToken) {
  console.error("❌ Faltan TURSO_DATABASE_URL o TURSO_AUTH_TOKEN");
  process.exit(1);
}

const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

const sqlFile = "./drizzle/0000_slimy_post.sql";
const sql = readFileSync(sqlFile, "utf-8");

async function executeMigration() {
  console.log("📄 Ejecutando migración en Turso...\n");
  
  const statements = sql.split("--> statement-breakpoint").map(s => s.trim()).filter(Boolean);
  
  for (const stmt of statements) {
    try {
      await client.execute(stmt);
      console.log("✅:", stmt.substring(0, 50) + "...");
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes("already exists")) {
        console.log("⚠️  Tabla ya existe, saltando...");
      } else {
        console.log("❌ Error:", errMsg);
      }
    }
  }
  
  console.log("\n✨ Migración completada!");
}

executeMigration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
