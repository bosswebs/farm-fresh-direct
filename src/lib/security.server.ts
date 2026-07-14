const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 300;
const MAX_REQUEST_BYTES = 2 * 1024 * 1024;

const requestCounters = new Map<string, { count: number; resetAt: number }>();

function clientAddress(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function enforceRequestLimits(request: Request): Response | null {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (!Number.isFinite(contentLength) || contentLength < 0 || contentLength > MAX_REQUEST_BYTES) {
    return new Response("Request body too large", { status: 413 });
  }

  const now = Date.now();
  const address = clientAddress(request);
  const current = requestCounters.get(address);
  if (!current || current.resetAt <= now) {
    requestCounters.set(address, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return null;
  }

  current.count += 1;
  if (current.count > RATE_LIMIT) {
    return new Response("Too many requests", {
      status: 429,
      headers: { "retry-after": String(Math.ceil((current.resetAt - now) / 1000)) },
    });
  }

  if (requestCounters.size > 10_000) {
    for (const [key, value] of requestCounters) {
      if (value.resetAt <= now) requestCounters.delete(key);
    }
  }
  return null;
}

export function applySecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set(
    "content-security-policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "script-src 'self' 'unsafe-inline' blob:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "upgrade-insecure-requests",
    ].join("; "),
  );
  headers.set("cross-origin-opener-policy", "same-origin");
  headers.set("cross-origin-resource-policy", "same-origin");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("x-permitted-cross-domain-policies", "none");
  headers.delete("server");
  headers.delete("x-powered-by");

  if (process.env.NODE_ENV === "production") {
    headers.set("strict-transport-security", "max-age=31536000; includeSubDomains; preload");
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export function safeErrorForLog(error: unknown): { name: string; message: string } {
  if (!(error instanceof Error)) return { name: "UnknownError", message: "Unknown server error" };
  return {
    name: error.name.slice(0, 100),
    message: error.message
      .replace(/postgres(?:ql)?:\/\/[^\s]+/gi, "[REDACTED_DATABASE_URL]")
      .replace(/Bearer\s+[A-Za-z0-9._~+/-]+/gi, "Bearer [REDACTED]")
      .slice(0, 500),
  };
}
