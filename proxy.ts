import { NextRequest, NextResponse } from "next/server";
import type { Role } from "@/lib/auth/session";

const PUBLIC_PATHS = ["/api/auth", "/api/health"];

async function getSessionUser(request: NextRequest): Promise<{ id: string; role: Role } | null> {
  const sessionToken = request.cookies.get("better-auth.session_token");

  if (!sessionToken?.value) {
    return null;
  }

  try {
    const { auth } = await import("@/lib/auth");
    const session = await auth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${sessionToken.value}`,
      },
    });

    if (!session?.user) {
      return null;
    }

    const { db } = await import("@/lib/db");
    const { users } = await import("@/lib/db/schema");
    const { eq } = await import("drizzle-orm");

    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!userRecord) {
      return null;
    }

    return {
      id: userRecord.id,
      role: userRecord.role as Role,
    };
  } catch {
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
