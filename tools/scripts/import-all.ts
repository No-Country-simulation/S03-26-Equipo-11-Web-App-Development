import { createClient } from "@libsql/client";
import { readFileSync } from "fs";

const tursoUrl = "libsql://crm-db-favian-medina-gemio.aws-us-east-1.turso.io";
const tursoToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU4NTgyNTIsImlkIjoiMDE5ZDc5NjUtNGMwMS03YjQ3LWIzNjktY2I3YjFlOWYxMzk4IiwicmlkIjoiN2I0ZmRlNzAtYzM1Zi00NGVjLWE4N2MtODcxYmFkNjllODExIn0.R275s9Bx0kTdRHHwmZYnu5iEvAP7XBLAtD9aSFZQ3MEou9fHhezsGv64Uvm7ahEvs2El15CG_L6qd6PsOYpBCw";

const client = createClient({ url: tursoUrl, authToken: tursoToken });
const backup = JSON.parse(readFileSync("./backup-local.json", "utf-8"));

async function importAll() {
  console.log("📥 Importando todos los datos a Turso...\n");

  // Users
  for (const u of backup.users || []) {
    try {
      await client.execute(
        `INSERT OR IGNORE INTO users (id, email, password, name, role, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.email, u.password || null, u.name, u.role || "user", u.active ?? 1, u.created_at, u.updated_at]
      );
      console.log(`✅ User: ${u.email}`);
    } catch (e) { console.log(`⚠️  User ${u.email}:`, e); }
  }

  // Contacts
  for (const c of backup.contacts || []) {
    try {
      await client.execute(
        `INSERT OR IGNORE INTO contacts (id, name, email, phone, company, stage, tags, last_contact, notes, avatar, assigned_to, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.name, c.email, c.phone || null, c.company || null, c.stage || "new", c.tags || null, c.last_contact || null, c.notes || null, c.avatar || null, c.assigned_to || null, c.created_at, c.updated_at]
      );
    } catch (e) {}
  }
  console.log(`✅ Contacts: ${backup.contacts?.length || 0}`);

  // Messages
  for (const m of backup.messages || []) {
    try {
      await client.execute(
        `INSERT OR IGNORE INTO messages (id, contact_id, canal, direccion, contenido, asunto, fecha, leido, entregado, message_id, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [m.id, m.contact_id || null, m.canal || "email", m.direccion, m.contenido || null, m.asunto || null, m.fecha, m.leido ?? 0, m.entregado ?? 1, m.message_id || null, m.metadata || null, m.created_at]
      );
    } catch (e) {}
  }
  console.log(`✅ Messages: ${backup.messages?.length || 0}`);

  // Email Templates
  for (const t of backup.email_templates || []) {
    try {
      await client.execute(
        `INSERT OR IGNORE INTO email_templates (id, name, subject, body, category, variables, active, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.id, t.name, t.subject, t.body, t.category || "custom", t.variables || null, t.active ?? 1, t.created_by || null, t.created_at, t.updated_at]
      );
    } catch (e) {}
  }
  console.log(`✅ Templates: ${backup.email_templates?.length || 0}`);

  // Reminders
  for (const r of backup.reminders || []) {
    try {
      await client.execute(
        `INSERT OR IGNORE INTO reminders (id, contact_id, user_id, title, description, due_date, due_time, priority, status, completed_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r.id, r.contact_id || null, r.user_id || null, r.title, r.description || null, r.due_date, r.due_time || null, r.priority || "medium", r.status || "pending", r.completed_at || null, r.created_at, r.updated_at]
      );
    } catch (e) {}
  }
  console.log(`✅ Reminders: ${backup.reminders?.length || 0}`);

  console.log("\n✨ Importación completa!");
}

importAll().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });