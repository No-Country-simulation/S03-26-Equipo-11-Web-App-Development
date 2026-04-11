import { createClient } from "@libsql/client";

const tursoUrl = "libsql://crm-db-favian-medina-gemio.aws-us-east-1.turso.io";
const tursoToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU4NTgyNTIsImlkIjoiMDE5ZDc5NjUtNGMwMS03YjQ3LWIzNjktY2I3YjFlOWYxMzk4IiwicmlkIjoiN2I0ZmRlNzAtYzM1Zi00NGVjLWE4N2MtODcxYmFkNjllODExIn0.R275s9Bx0kTdRHHwmZYnu5iEvAP7XBLAtD9aSFZQ3MEou9fHhezsGv64Uvm7ahEvs2El15CG_L6qd6PsOYpBCw";

const client = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});

const backup = {
  users: [
    { id: "i7MGBQvLljnHQuujzJBdYyVqb9PfTkZm", email: "favian.medina.gemio@gmail.com", password: null, name: "favian", email_verified: 0, image: null, role: "user", active: 1, created_at: "1775432866662.0", updated_at: "1775432866662.0" },
    { id: "BppjETqer0Jm4qlzeJ4hyX2SaWyu4PTu", email: "a@a.net", password: null, name: "fernando", email_verified: 0, image: null, role: "user", active: 1, created_at: "1775433035855.0", updated_at: "1775433035855.0" },
    { id: "2SnF3J7ZrmxDEvICdxkpeE5NawIMkZSY", email: "a@b.net", password: null, name: "otro", email_verified: 0, image: null, role: "user", active: 1, created_at: "1775433053484.0", updated_at: "1775433053484.0" }
  ]
};

async function importData() {
  console.log("📥 Importando datos a Turso...\n");

  // Importar users
  for (const user of backup.users) {
    await client.execute(
      `INSERT INTO users (id, email, password, name, role, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, user.email, user.password, user.name, user.role, user.active, user.created_at, user.updated_at]
    );
    console.log(`✅ User: ${user.email}`);
  }

  console.log("\n✨ Importación completada!");
}

importData().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
