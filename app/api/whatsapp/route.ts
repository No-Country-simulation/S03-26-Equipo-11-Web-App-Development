import { NextResponse } from "next/server";
import { ensureAuthSchema } from "@/lib/auth/ensure-auth-schema";
import { getWhatsAppContacts, syncWhatsAppMessages } from "@/lib/whatsapp/whatsappService";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ensureAuthSchema();

    const result = await syncWhatsAppMessages();

    // Return detailed result for debugging
    return NextResponse.json({
      status: result.errors && result.errors.length > 0 ? "partial" : "ok",
      newMessages: result.newMessages,
      contactsUpdated: result.contactsUpdated,
      errors: result.errors || [],
    }, {
      status: result.errors && result.errors.length > 0 ? 206 : 200,
    });
  } catch (error) {
    console.error("WhatsApp sync API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
