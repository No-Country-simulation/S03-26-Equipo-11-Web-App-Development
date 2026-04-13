import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/api/auth", "/api/health", "/api/whatsapp/webhook"];

function getRole(value: unknown): Role {
  if (
    typeof value === "object" &&
    value !== null &&
    "role" in value
  ) {
    const role = value.role;
    if (role === "admin" || role === "agent" || role === "user") {
      return role;
    }
  }

  return "user";
}

async function getSessionUser(request: NextRequest): Promise<{ id: string; role: Role } | null> {
  try {
    const { auth } = await import("@/lib/auth");
    // Pasamos todos los headers de la petición original. 
    // Better Auth se encargará de buscar la cookie correcta (con o sin prefijo __Secure-)
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return null;
    }

    return {
      id: session.user.id,
      role: getRole(session.user),
    };
  } catch (error) {
    console.error("Middleware session error:", error);
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const publicPath of PUBLIC_PATHS) {
    if (pathname.startsWith(publicPath)) {
      return NextResponse.next();
    }
  }

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const user = await getSessionUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", user.id);
  requestHeaders.set("x-user-role", user.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/api/:path*"],
};
