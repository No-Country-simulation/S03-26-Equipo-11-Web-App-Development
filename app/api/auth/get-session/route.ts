import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

function getRole(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "role" in value &&
    typeof value.role === "string"
  ) {
    return value.role;
  }

  return "user";
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session || !session.user) {
      return Response.json({ user: null }, { 
        headers: { "Cache-Control": "no-store" } 
      });
    }

    return Response.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || "Usuario",
        role: getRole(session.user),
      },
    }, { 
      headers: { "Cache-Control": "no-store" } 
    });
  } catch (error) {
    console.error("get-session error:", error);
    return Response.json({ user: null }, { 
      headers: { "Cache-Control": "no-store" } 
    });
  }
}
