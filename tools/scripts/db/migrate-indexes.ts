/**
 * Migration: Add indexes to messages table for WhatsApp optimization
 * Run: npx tsx tools/scripts/db/migrate-indexes.ts
 */

import { sql } from "drizzle-orm";
import { db } from "./index.js";

async function migrateIndexes() {
  console.log("🚀 Running migration: Add message indexes...");

  try {
    // Create indexes one by one (SQLite doesn't support IF NOT EXISTS for indexes)
    const indexes = [
      "CREATE INDEX IF NOT EXISTS messages_contactId_idx ON messages(contact_id)",
      "CREATE INDEX IF NOT EXISTS messages_canal_idx ON messages(canal)",
      "CREATE INDEX IF NOT EXISTS messages_contactId_canal_idx ON messages(contact_id, canal)",
      "CREATE INDEX IF NOT EXISTS messages_contactId_canal_createdAt_idx ON messages(contact_id, canal, created_at)",
      "CREATE INDEX IF NOT EXISTS messages_canal_direccion_leido_idx ON messages(canal, direccion, leido)",
      "CREATE INDEX IF NOT EXISTS messages_messageId_idx ON messages(message_id)",
    ];

    for (const indexSql of indexes) {
      console.log(`  Executing: ${indexSql}`);
      await db.run(sql.raw(indexSql));
    }

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateIndexes();
