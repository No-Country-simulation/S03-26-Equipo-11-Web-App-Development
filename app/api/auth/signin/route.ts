import { auth } from "@/lib/auth";
import { ensureAuthSchema } from "@/lib/auth/ensure-auth-schema";
import { forwardAuthRequest } from "@/lib/auth/forward-auth-request";

export async function POST(request: Request): Promise<Response> {
  await ensureAuthSchema();
  const forwardedRequest = forwardAuthRequest(request, "/api/auth/sign-in/email");
  return auth.handler(forwardedRequest);
}
