import { client } from "@/lib/db";

interface SqliteMasterRow {
  name: string;
  sql: string;
}

interface ForeignKeyRow {
  table: string;
}

function quoteIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, "\"\"")}"`;
}

async function getTableSql(tableName: string): Promise<string | null> {
  const result = await client.execute({
    sql: "SELECT sql FROM sqlite_master WHERE type = 'table' AND name = ?",
    args: [tableName],
  });

  const row = result.rows[0];
  const sql = row?.sql;
  return typeof sql === "string" ? sql : null;
}

async function getForeignKeyTargets(tableName: string): Promise<string[]> {
  const result = await client.execute(`PRAGMA foreign_key_list(${quoteIdentifier(tableName)})`);

  return result.rows
    .map((row) => row as unknown as ForeignKeyRow)
    .map((row) => row.table)
    .filter((value): value is string => typeof value === "string");
}

async function rebuildTableWithUpdatedReference(tableName: string): Promise<void> {
  const originalSql = await getTableSql(tableName);
  if (!originalSql || !originalSql.includes("users_legacy_auth")) {
    return;
  }

  const tempTableName = `${tableName}__repair_tmp`;
  const tempTableSql = originalSql
    .replace(new RegExp(`CREATE TABLE\\s+["'\`]?${tableName}["'\`]?`, "i"), `CREATE TABLE ${quoteIdentifier(tempTableName)}`)
    .replace(/users_legacy_auth/g, "users");

  const tableInfo = await client.execute(`PRAGMA table_info(${quoteIdentifier(tableName)})`);
  const columns = tableInfo.rows
    .map((row) => row.name)
    .filter((name): name is string => typeof name === "string");

  if (columns.length === 0) {
    return;
  }

  const columnList = columns.map((column) => quoteIdentifier(column)).join(", ");

  await client.execute("PRAGMA foreign_keys = OFF");

  try {
    await client.execute(`DROP TABLE IF EXISTS ${quoteIdentifier(tempTableName)}`);
    await client.execute(tempTableSql);
    await client.execute(
      `INSERT INTO ${quoteIdentifier(tempTableName)} (${columnList}) SELECT ${columnList} FROM ${quoteIdentifier(tableName)}`
    );
    await client.execute(`DROP TABLE ${quoteIdentifier(tableName)}`);
    await client.execute(
      `ALTER TABLE ${quoteIdentifier(tempTableName)} RENAME TO ${quoteIdentifier(tableName)}`
    );
  } finally {
    await client.execute("PRAGMA foreign_keys = ON");
  }
}

export async function fixLegacyAuthReferences(): Promise<void> {
  try {
    const result = await client.execute(
      "SELECT name, sql FROM sqlite_master WHERE type = 'table' AND sql LIKE '%users_legacy_auth%' ORDER BY name"
    );

    const rows = result.rows as unknown as SqliteMasterRow[];
    if (rows.length === 0) {
      return;
    }

    for (const row of rows) {
      await rebuildTableWithUpdatedReference(row.name);
    }

    const remaining = await client.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND sql LIKE '%users_legacy_auth%' LIMIT 1"
    );

    if (remaining.rows.length > 0) {
      throw new Error("Legacy auth references still present after repair");
    }

    for (const tableName of ["contacts", "reminders", "email_templates"]) {
      const targets = await getForeignKeyTargets(tableName);
      if (targets.includes("users_legacy_auth")) {
        throw new Error(`Foreign key repair incomplete for table ${tableName}`);
      }
    }
  } catch (error) {
    console.error("Error fixing legacy auth references:", error);
    throw error;
  }
}
