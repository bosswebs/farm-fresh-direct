import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import pg from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("Missing required environment variable DATABASE_URL.");
}

const migrationsDirectory = resolve("migrations");
const migrationFiles = (await readdir(migrationsDirectory))
  .filter((file) => /^\d+_.*\.sql$/.test(file) && !file.endsWith(".down.sql"))
  .sort();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10_000,
});

try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  for (const file of migrationFiles) {
    const version = file.replace(/\.sql$/, "");
    const applied = await pool.query(
      "SELECT 1 FROM schema_migrations WHERE version = $1",
      [version],
    );

    if (applied.rowCount) {
      console.info(`[Database] Migration already applied: ${version}`);
      continue;
    }

    const sql = await readFile(resolve(migrationsDirectory, file), "utf8");
    await pool.query(sql);
    console.info(`[Database] Migration applied: ${version}`);
  }

  console.info("[Database] All migrations are current.");
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  throw new Error(`[Database] Migration failed. ${detail}`, { cause: error });
} finally {
  await pool.end();
}
