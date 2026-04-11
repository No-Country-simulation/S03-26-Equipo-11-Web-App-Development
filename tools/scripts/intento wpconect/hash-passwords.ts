// Script para hashear passwords de usuarios existentes con bcrypt
// Uso: npx tsx scripts/hash-passwords.ts

import { db } from "../lib/db/index.js";
import { users } from "../lib/db/schema.js";
import { eq } from "drizzle-orm";

const DEV_PASSWORD = "StartupCRM123!";

async function main() {
  console.log("===========================================");
  console.log("Hasheando passwords con bcrypt...");
  console.log("===========================================\n");

  const allUsers = await db.select().from(users);

  for (const user of allUsers) {
    const bcrypt = await import("bcrypt");
    const hashedPassword = await bcrypt.hash(DEV_PASSWORD, 10);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, user.id));

    console.log(`  Updated: ${user.email}`);
  }

  console.log("\n===========================================");
  console.log("Passwords actualizadas!");
  console.log("Credencial: StartupCRM123!");
  console.log("===========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
