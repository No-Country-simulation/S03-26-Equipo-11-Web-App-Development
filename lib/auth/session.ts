import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export type Role = "admin" | "agent" | "user";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getSession(request: Request): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token");

  if (!sessionToken?.value) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: {
      cookie: `better-auth.session_token=${sessionToken.value}`,
    },
  });

  if (!session) {
    return null;
  }

  const userRecord = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!userRecord) {
    return null;
  }

  return {
    id: userRecord.id,
    email: userRecord.email,
    name: userRecord.name,
    role: userRecord.role as Role,
    active: userRecord.active,
    createdAt: userRecord.createdAt,
    updatedAt: userRecord.updatedAt,
  };
}

export async function requireAuth(request: Request): Promise<AuthUser> {
  const user = await getSession(request);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

export async function requireRole(request: Request, allowedRoles: Role[]): Promise<AuthUser> {
  const user = await requireAuth(request);

  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}

export async function getCurrentUser(request: Request): Promise<AuthUser | null> {
  return getSession(request);
}
