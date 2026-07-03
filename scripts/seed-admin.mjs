import { randomBytes } from "node:crypto";

import pg from "pg";

const email = (process.env.ADMIN_EMAIL || "bosco@deacomart.com").trim().toLowerCase();
const displayName = process.env.ADMIN_DISPLAY_NAME || "Bosco";
const password = process.env.ADMIN_PASSWORD || randomBytes(18).toString("base64url");

if (!process.env.DATABASE_URL) {
  throw new Error("Missing required environment variable DATABASE_URL.");
}

if (password.length < 10) {
  throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10_000,
});

try {
  await pool.query(
    `INSERT INTO application_users(email, password_hash, display_name, role, status)
     VALUES ($1, crypt($2, gen_salt('bf', 12)), $3, 'super_admin', 'active')
     ON CONFLICT (email) DO UPDATE SET
       password_hash = EXCLUDED.password_hash,
       display_name = EXCLUDED.display_name,
       role = 'super_admin',
       status = 'active',
       updated_at = now()`,
    [email, password, displayName],
  );

  await pool.query("DELETE FROM authentication_attempts WHERE identifier_hash IS NOT NULL");

  console.info(`[Database] Admin account is ready: ${email}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.info(`[Database] Temporary password: ${password}`);
  }
} finally {
  await pool.end();
}
