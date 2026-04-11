import { db } from "../../lib/db/index";
import { sql } from "drizzle-orm";

async function countRecords() {
  const tables = ["users", "contacts", "messages", "reminders"];
  for (const table of tables) {
    const result = await db.run(sql.raw(`SELECT count(*) as count FROM ${table}`));
    console.log(`${table}: ${result.rows[0].count}`);
  }
}

countRecords().catch(console.error);
