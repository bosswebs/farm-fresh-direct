import { createHash, randomBytes } from "node:crypto";

import { deleteCookie, getCookie, getRequest, setCookie } from "@tanstack/react-start/server";

import { getDatabasePool } from "./database.server";

const SESSION_COOKIE = "__Host-deacomart_session";
const DEVELOPMENT_SESSION_COOKIE = "deacomart_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MINUTES = 15;

export type AuthenticatedUser = {
  id: string;
  email: string;
  displayName: string;
  role: string;
};

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function sessionCookieName(): string {
  return process.env.NODE_ENV === "production" ? SESSION_COOKIE : DEVELOPMENT_SESSION_COOKIE;
}

function requestFingerprint(email: string): string {
  const request = getRequest();
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "unknown";
  return sha256(`${address}:${email.toLowerCase()}`);
}

function assertSameOrigin(): void {
  const request = getRequest();
  const origin = request.headers.get("origin");
  if (!origin) return;

  const xProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = xProto || new URL(request.url).protocol.replace(":", "");

  const xHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = xHost || request.headers.get("host") || new URL(request.url).host;

  const expected = `${proto}://${host}`;
  if (origin === expected) return;

  // Fallback: Check if the origin matches our primary domain or localhost.
  try {
    const originUrl = new URL(origin);
    const hostname = originUrl.hostname.toLowerCase();
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
    const isPrimaryDomain = hostname === "deacomart.com" || hostname.endsWith(".deacomart.com");
    if (isLocal || isPrimaryDomain) {
      return;
    }
  } catch {}

  throw new Error(`Request origin is not allowed. Expected: ${expected}, Got: ${origin}`);
}

function setSessionCookie(token: string): void {
  setCookie(sessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

function clearSessionCookie(): void {
  deleteCookie(sessionCookieName(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

async function recordEvent(
  eventType: string,
  outcome: "success" | "failure" | "blocked",
  userId?: string,
): Promise<void> {
  await getDatabasePool().query(
    "INSERT INTO security_events(user_id, event_type, outcome) VALUES ($1, $2, $3)",
    [userId ?? null, eventType, outcome],
  );
}

export async function login(email: string, password: string): Promise<AuthenticatedUser | null> {
  assertSameOrigin();
  const pool = getDatabasePool();
  const normalizedEmail = email.trim().toLowerCase();
  const fingerprint = requestFingerprint(normalizedEmail);

  const attempt = await pool.query<{
    failed_count: number;
    window_started_at: Date;
    blocked_until: Date | null;
  }>(
    "SELECT failed_count, window_started_at, blocked_until FROM authentication_attempts WHERE identifier_hash = $1",
    [fingerprint],
  );

  const now = Date.now();
  const state = attempt.rows[0];
  if (state?.blocked_until && state.blocked_until.getTime() > now) {
    await recordEvent("login", "blocked");
    return null;
  }

  const result = await pool.query<AuthenticatedUser & { password_hash: string; status: string }>(
    `SELECT id, email::text, display_name AS "displayName", role, password_hash, status
       FROM application_users WHERE email = $1 LIMIT 1`,
    [normalizedEmail],
  );
  const account = result.rows[0];

  let validPassword = false;
  if (account) {
    const verified = await pool.query<{ valid: boolean }>("SELECT crypt($1, $2) = $2 AS valid", [
      password,
      account.password_hash,
    ]);
    validPassword = verified.rows[0]?.valid === true;
  } else {
    // Equalize missing-account work to reduce account enumeration timing signals.
    await pool.query("SELECT crypt($1, gen_salt('bf', 12))", [password]);
  }

  if (!account || account.status !== "active" || !validPassword) {
    const windowExpired =
      !state || now - state.window_started_at.getTime() > ATTEMPT_WINDOW_MINUTES * 60_000;
    const failedCount = windowExpired ? 1 : state.failed_count + 1;
    const blockedUntil =
      failedCount >= MAX_FAILED_ATTEMPTS ? new Date(now + ATTEMPT_WINDOW_MINUTES * 60_000) : null;

    await pool.query(
      `INSERT INTO authentication_attempts(identifier_hash, failed_count, window_started_at, blocked_until)
       VALUES ($1, $2, now(), $3)
       ON CONFLICT (identifier_hash) DO UPDATE SET
         failed_count = $2,
         window_started_at = CASE WHEN $4 THEN now() ELSE authentication_attempts.window_started_at END,
         blocked_until = $3,
         updated_at = now()`,
      [fingerprint, failedCount, blockedUntil, windowExpired],
    );
    await recordEvent("login", blockedUntil ? "blocked" : "failure", account?.id);
    return null;
  }

  await pool.query("DELETE FROM authentication_attempts WHERE identifier_hash = $1", [fingerprint]);
  const token = randomBytes(32).toString("base64url");
  await pool.query(
    `INSERT INTO application_sessions(user_id, token_hash, expires_at)
     VALUES ($1, $2, now() + ($3 * interval '1 second'))`,
    [account.id, sha256(token), SESSION_MAX_AGE_SECONDS],
  );
  setSessionCookie(token);
  await recordEvent("login", "success", account.id);

  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    role: account.role,
  };
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const token = getCookie(sessionCookieName());
  if (!token) return null;

  const result = await getDatabasePool().query<AuthenticatedUser>(
    `UPDATE application_sessions AS session
        SET last_seen_at = now()
       FROM application_users AS app_user
      WHERE session.token_hash = $1
        AND session.user_id = app_user.id
        AND session.revoked_at IS NULL
        AND session.expires_at > now()
        AND app_user.status = 'active'
      RETURNING app_user.id, app_user.email::text, app_user.display_name AS "displayName", app_user.role`,
    [sha256(token)],
  );

  if (!result.rows[0]) clearSessionCookie();
  return result.rows[0] ?? null;
}

export async function requireRole(allowedRoles: readonly string[]): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user || !allowedRoles.includes(user.role)) {
    await recordEvent("authorization", "failure", user?.id);
    throw new Error("Forbidden");
  }
  return user;
}

export async function logout(): Promise<void> {
  assertSameOrigin();
  const token = getCookie(sessionCookieName());
  if (token) {
    await getDatabasePool().query(
      "UPDATE application_sessions SET revoked_at = now() WHERE token_hash = $1 AND revoked_at IS NULL",
      [sha256(token)],
    );
  }
  clearSessionCookie();
}

export async function changePassword(
  currentPassword: string,
  nextPassword: string,
): Promise<boolean> {
  assertSameOrigin();
  const user = await getCurrentUser();
  if (!user) return false;

  const pool = getDatabasePool();
  const result = await pool.query<{ valid: boolean }>(
    `SELECT password_hash = crypt($1, password_hash) AS valid
       FROM application_users WHERE id = $2`,
    [currentPassword, user.id],
  );
  if (!result.rows[0]?.valid) {
    await recordEvent("password_change", "failure", user.id);
    return false;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE application_users SET password_hash = crypt($1, gen_salt('bf', 12)) WHERE id = $2",
      [nextPassword, user.id],
    );
    const currentToken = getCookie(sessionCookieName());
    await client.query(
      "UPDATE application_sessions SET revoked_at = now() WHERE user_id = $1 AND ($2::text IS NULL OR token_hash <> $2)",
      [user.id, currentToken ? sha256(currentToken) : null],
    );
    await client.query("COMMIT");
    await recordEvent("password_change", "success", user.id);
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function resetPasswordWithCode(
  email: string,
  resetCode: string,
  nextPassword: string,
): Promise<boolean> {
  assertSameOrigin();
  const expectedCode = process.env.ADMIN_PASSWORD_RESET_CODE;
  if (!expectedCode || resetCode !== expectedCode) {
    await recordEvent("password_reset", "failure");
    return false;
  }

  const pool = getDatabasePool();
  const normalizedEmail = email.trim().toLowerCase();
  const result = await pool.query<{ id: string }>(
    "SELECT id FROM application_users WHERE email = $1 AND status = 'active' LIMIT 1",
    [normalizedEmail],
  );
  const userId = result.rows[0]?.id;
  if (!userId) {
    await recordEvent("password_reset", "failure");
    return false;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE application_users SET password_hash = crypt($1, gen_salt('bf', 12)) WHERE id = $2",
      [nextPassword, userId],
    );
    await client.query(
      "UPDATE application_sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL",
      [userId],
    );
    await client.query("DELETE FROM authentication_attempts WHERE identifier_hash = $1", [
      requestFingerprint(normalizedEmail),
    ]);
    await client.query("COMMIT");
    await recordEvent("password_reset", "success", userId);
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
