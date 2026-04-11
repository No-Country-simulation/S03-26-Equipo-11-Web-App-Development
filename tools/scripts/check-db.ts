import { createClient } from "@libsql/client";

const client = createClient({ url: "file:D:/nc/002/nextjs_crm/tools/scripts/data/crm.db" });

// Check all FK constraints
const tables = ["contacts", "emails", "reminders", "whatsapp_messages", "messages", "email_templates"];

for (const table of tables) {
  console.log(`\n=== ${table} ===`);
  const fkResult = await client.execute(`PRAGMA foreign_key_list(${table})`);
  console.log("FK:", fkResult.rows);
}
