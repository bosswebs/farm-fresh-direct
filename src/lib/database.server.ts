import { Pool } from "pg";

import { getServerConfig } from "./config.server";

let pool: Pool | undefined;

export function getDatabasePool(): Pool {
  if (!pool) {
    const { databaseUrl } = getServerConfig();

    pool = new Pool({
      connectionString: databaseUrl,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

    pool.on("error", (error) => {
      console.error("[Database] Unexpected Neon PostgreSQL pool error", {
        name: error.name,
        code: "code" in error ? error.code : undefined,
      });
    });
  }

  return pool;
}

export async function verifyDatabaseConnection(): Promise<void> {
  try {
    await getDatabasePool().query("SELECT 1");
    console.info("[Database] Connected to Neon PostgreSQL.");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(
      `[Database] Unable to connect to Neon PostgreSQL. Check DATABASE_URL, network access, and SSL settings. ${detail}`,
      { cause: error },
    );
  }
}
