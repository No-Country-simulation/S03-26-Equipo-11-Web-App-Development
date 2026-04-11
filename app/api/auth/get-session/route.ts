import { auth } from "@/lib/auth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token");

    if (!sessionToken?.value) {
      return Response.json({ user: null }, { headers: { "Cache-Control": "no-store" } });
    }

    const session = await auth.api.getSession({
      headers: {
        cookie: `better-auth.session_token=${sessionToken.value}`,
      },
    });

    if (!session) {
      return Response.json({ user: null }, { headers: { "Cache-Control": "no-store" } });
    }

    const user = session.user as Record<string, unknown>;

    return Response.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: (user.name as string) || (user.email as string) || "Usuario",
        role: (user.role as string) || "user",
      },
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("get-session error:", error);
    return Response.json({ user: null }, { headers: { "Cache-Control": "no-store" } });
  }
}