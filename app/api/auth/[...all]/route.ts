import { auth } from "@/lib/auth";
import { ensureAuthSchema } from "@/lib/auth/ensure-auth-schema";

export async function GET(request: Request): Promise<Response> {
  await ensureAuthSchema();
  return auth.handler(request);
}

export async function POST(request: Request): Promise<Response> {
  await ensureAuthSchema();
  return auth.handler(request);
}
