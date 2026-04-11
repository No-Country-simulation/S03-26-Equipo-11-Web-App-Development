// Backup de datos locales antes de migrar a Turso
// Uso: npx tsx backup-local.ts

import { createClient } from "@libsql/client";
import fs from "fs/promises";
import path from "path";

const localDbPath = "file:./data/crm.db";
const backupPath = "./backup-local.json";

const client = createClient({ url: localDbPath });

async function backupTables() {
  const tables = ["users", "contacts", "messages", "reminders", "email_templates", "email_sync_control"];
  const backup: Record<string, unknown[]> = {};

  console.log("📦 Exportando datos locales...\n");

  for (const table of tables) {
    try {
      const result = await client.execute(`SELECT * FROM ${table}`);
      backup[table] = result.rows;
      console.log(`  ✅ ${table}: ${result.rows.length} registros`);
    } catch (err) {
      console.log(`  ⚠️  ${table}: tabla no existe o vacía`);
      backup[table] = [];
    }
  }

  // Guardar backup
  await fs.writeFile(backupPath, JSON.stringify(backup, null, 2));
  console.log(`\n💾 Backup guardado en: ${backupPath}`);
  
  return backup;
}

backupTables()
  .then(() => {
    console.log("\n✨ Backup completado!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
