import { createClient } from "@libsql/client";

const tursoUrl = "libsql://crm-db-favian-medina-gemio.aws-us-east-1.turso.io";
const tursoToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU4NTgyNTIsImlkIjoiMDE5ZDc5NjUtNGMwMS03YjQ3LWIzNjktY2I3YjFlOWYxMzk4IiwicmlkIjoiN2I0ZmRlNzAtYzM1Zi00NGVjLWE4N2MtODcxYmFkNjllODExIn0.R275s9Bx0kTdRHHwmZYnu5iEvAP7XBLAtD9aSFZQ3MEou9fHhezsGv64Uvm7ahEvs2El15CG_L6qd6PsOYpBCw";

const client = createClient({ url: tursoUrl, authToken: tursoToken });

async function test() {
  const r = await client.execute("SELECT COUNT(*) as total FROM users");
  console.log("Users:", r.rows[0].total);
  
  const c = await client.execute("SELECT COUNT(*) as total FROM contacts");
  console.log("Contacts:", c.rows[0].total);
  
  const m = await client.execute("SELECT COUNT(*) as total FROM messages");
  console.log("Messages:", m.rows[0].total);
  
  console.log("\n✅ Turso OK!");
}

test().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });