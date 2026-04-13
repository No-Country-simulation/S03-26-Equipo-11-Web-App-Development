import { client } from "@/lib/db";
import { fixLegacyAuthReferences } from "./fix-schema";

type ColumnMap = Record<string, string>;

async function getTableColumns(tableName: string): Promise<Set<string>> {
  const result = await client.execute(`PRAGMA table_info(${tableName})`);
  const columns = new Set<string>();

  for (const row of result.rows) {
    const rawName = row.name;

    if (typeof rawName === "string" && rawName.length > 0) {
      columns.add(rawName);
    }
  }

  return columns;
}

async function getTableInfo(
  tableName: string
): Promise<Array<{ name: string; notnull: number; dflt_value: unknown }>> {
  const result = await client.execute(`PRAGMA table_info(${tableName})`);
  const rows: Array<{ name: string; notnull: number; dflt_value: unknown }> = [];

  for (const row of result.rows) {
    const name = typeof row.name === "string" ? row.name : "";

    if (!name) {
      continue;
    }

    rows.push({
      name,
      notnull: typeof row.notnull === "number" ? row.notnull : 0,
      dflt_value: row.dflt_value,
    });
  }

  return rows;
}

async function addMissingColumns(tableName: string, expectedColumns: ColumnMap): Promise<void> {
  const existingColumns = await getTableColumns(tableName);

  for (const [columnName, definition] of Object.entries(expectedColumns)) {
    if (!existingColumns.has(columnName)) {
      await client.execute(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
    }
  }
}

async function createUsersTable(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      email_verified INTEGER NOT NULL DEFAULT 0,
      image TEXT,
      role TEXT NOT NULL DEFAULT 'user',
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await addMissingColumns("users", {
    email_verified: "INTEGER NOT NULL DEFAULT 0",
    image: "TEXT",
    role: "TEXT NOT NULL DEFAULT 'user'",
    active: "INTEGER NOT NULL DEFAULT 1",
    created_at: "TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP",
  });

  const usersTableInfo = await getTableInfo("users");
  const passwordColumn = usersTableInfo.find((column) => column.name === "password");

  if (passwordColumn?.notnull === 1) {
    await client.execute("ALTER TABLE users RENAME TO users_legacy_auth");

    await client.execute(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT,
        name TEXT NOT NULL,
        email_verified INTEGER NOT NULL DEFAULT 0,
        image TEXT,
        role TEXT NOT NULL DEFAULT 'user',
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    await client.execute(`
      INSERT INTO users (
        id,
        email,
        password,
        name,
        email_verified,
        image,
        role,
        active,
        created_at,
        updated_at
      )
      SELECT
        id,
        email,
        password,
        name,
        COALESCE(email_verified, 0),
        image,
        COALESCE(role, 'user'),
        COALESCE(active, 1),
        created_at,
        updated_at
      FROM users_legacy_auth
    `);

    await client.execute("DROP TABLE users_legacy_auth");
  }
}

async function createSessionsTable(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      token TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      ip_address TEXT,
      user_agent TEXT
    )
  `);

  await addMissingColumns("sessions", {
    created_at: "INTEGER NOT NULL DEFAULT (unixepoch())",
    updated_at: "INTEGER NOT NULL DEFAULT (unixepoch())",
    ip_address: "TEXT",
    user_agent: "TEXT",
  });

  await client.execute("CREATE INDEX IF NOT EXISTS session_user_id_idx ON sessions(user_id)");
  await client.execute("CREATE INDEX IF NOT EXISTS session_token_idx ON sessions(token)");
}

async function createAccountsTable(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      access_token TEXT,
      refresh_token TEXT,
      id_token TEXT,
      access_token_expires_at INTEGER,
      refresh_token_expires_at INTEGER,
      scope TEXT,
      password TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  await client.execute("CREATE INDEX IF NOT EXISTS account_user_id_idx ON accounts(user_id)");
  await client.execute("CREATE INDEX IF NOT EXISTS account_provider_id_idx ON accounts(provider_id, account_id)");
}

async function createVerificationsTable(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS verifications (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  await client.execute("CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verifications(identifier)");
}

let ensurePromise: Promise<void> | null = null;

export async function ensureAuthSchema(): Promise<void> {
  if (!ensurePromise) {
    ensurePromise = (async () => {
      await fixLegacyAuthReferences();
      await createUsersTable();
      await createSessionsTable();
      await createAccountsTable();
      await createVerificationsTable();
    })().catch((error) => {
      ensurePromise = null;
      throw error;
    });
  }

  await ensurePromise;
}

