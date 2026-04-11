import { NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp/whatsappService";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

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

    const bodyText = await request.text();
    let bodyJson: unknown;
    try {
      bodyJson = bodyText ? JSON.parse(bodyText) : {};
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const {
      to,
      text,
      contactId,
      metadata,
    } = bodyJson as Record<string, unknown>;

    if (!to || typeof to !== "string") {
      return NextResponse.json({ error: "Missing 'to' phone number" }, { status: 400 });
    }
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing 'text' content" }, { status: 400 });
    }

    let finalContactId = typeof contactId === "string" ? contactId : undefined;
    if (!finalContactId) {
      const existing = await db
        .select()
        .from(contacts)
        .where(eq(contacts.phone, to))
        .limit(1);
      
      if (existing.length > 0) {
        finalContactId = existing[0].id;
      }
    }

    const result = await sendWhatsAppMessage({
      to,
      text,
      contactId: finalContactId,
      metadata: typeof metadata === "object" && metadata !== null
        ? (metadata as Record<string, unknown>)
        : undefined,
    });

    if (result.status === "failed") {
      return NextResponse.json({ error: "Failed to send WhatsApp message", details: result.error }, { status: 500 });
    }

    return NextResponse.json({
      status: "sent",
      messageId: result.messageId,
      contactId: finalContactId,
      message: "Mensaje de WhatsApp enviado correctamente"
    });

  } catch (error) {
    console.error("WhatsApp send API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
