import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { verifyDatabaseConnection } from "./lib/database.server";
import {
  applySecurityHeaders,
  enforceRequestLimits,
  safeErrorForLog,
} from "./lib/security.server";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;
let databaseConnectionPromise: Promise<void> | undefined;

function ensureDatabaseConnection(): Promise<void> {
  if (!databaseConnectionPromise) {
    databaseConnectionPromise = verifyDatabaseConnection().catch((error) => {
      databaseConnectionPromise = undefined;
      throw error;
    });
  }

  return databaseConnectionPromise;
}

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error("[Server] Request failed", safeErrorForLog(
    consumeLastCapturedError() ?? new Error(`SSR request failed with status ${response.status}`),
  ));
  return applySecurityHeaders(new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  }));
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const limitedResponse = enforceRequestLimits(request);
      if (limitedResponse) return applySecurityHeaders(limitedResponse);
      await ensureDatabaseConnection();
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applySecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error("[Server] Request failed", safeErrorForLog(error));
      return applySecurityHeaders(new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      }));
    }
  },
};
