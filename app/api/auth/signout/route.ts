import { auth } from "@/lib/auth";
import { ensureAuthSchema } from "@/lib/auth/ensure-auth-schema";

export async function POST(request: Request): Promise<Response> {
  await ensureAuthSchema();

  const targetUrl = new URL("/api/auth/sign-out", request.url);
  const headers = new Headers(request.headers);

  if (!headers.get("origin")) {
    headers.set("origin", process.env.BETTER_AUTH_URL?.replace(/\/$/, "") || new URL(request.url).origin);
  }

  headers.delete("content-type");
  headers.delete("content-length");

  const forwardedRequest = new Request(targetUrl, {
    method: "POST",
    headers,
  });

  return auth.handler(forwardedRequest);
}
