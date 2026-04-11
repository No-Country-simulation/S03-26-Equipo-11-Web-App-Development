import { NextResponse } from "next/server";
import { getWhatsAppContacts, syncWhatsAppMessages } from "@/lib/whatsapp/whatsappService";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token");
    if (!sessionToken?.value) {
      return NextResponse.json({ error: "Unauthorized - no cookie" }, { status: 401 });
    }
    const session = await auth.api.getSession({
      headers: { cookie: `better-auth.session_token=${sessionToken.value}` },
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    await syncWhatsAppMessages();

    const { searchParams } = new URL(request.url);
    const page = Math.min(parseInt(searchParams.get("page") || "1"), 100);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const search = searchParams.get("search") || undefined;
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const result = await getWhatsAppContacts(page, limit, search, unreadOnly);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("WhatsApp contacts API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token");
    if (!sessionToken?.value) {
      return NextResponse.json({ error: "Unauthorized - no cookie" }, { status: 401 });
    }
    const session = await auth.api.getSession({
      headers: { cookie: `better-auth.session_token=${sessionToken.value}` },
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const result = await syncWhatsAppMessages();

    if (result.errors && result.errors.length > 0) {
      return NextResponse.json(
        { error: "Sync failed", details: result.errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "ok",
      newMessages: result.newMessages,
      contactsUpdated: result.contactsUpdated,
    });
  } catch (error) {
    console.error("WhatsApp sync API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}