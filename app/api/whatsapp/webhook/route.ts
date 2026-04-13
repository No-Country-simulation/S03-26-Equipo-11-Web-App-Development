import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { contacts, messages } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * WAHA Webhook endpoint - receives real-time message notifications
 * Configure in WAHA: POST /api/webhooks with this URL
 */
export async function POST(request: Request) {
  try {
    // Verify webhook signature if configured
    const apiKey = process.env.WHATSAPP_API_KEY;
    if (apiKey) {
      const receivedKey = request.headers.get("x-webhook-secret") || 
                          request.headers.get("x-api-key");
      if (receivedKey && receivedKey !== apiKey) {
        return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
      }
    }

    const body = await request.json();
    console.log("[WAHA Webhook] Received:", JSON.stringify(body).slice(0, 500));

    // WAHA webhook format: { session, payload: { messages: [...] } }
    // Or direct format: { id, from, body, fromMe, timestamp, ... }
    const msgData = body.payload?.messages?.[0] || body.message || body;

    if (!msgData) {
      return NextResponse.json({ status: "ignored", reason: "no message data" }, { status: 200 });
    }

    const chatId = msgData.chatId || msgData.from || "";
    if (!chatId) {
      return NextResponse.json({ status: "ignored", reason: "no chatId" }, { status: 200 });
    }

    const phone = chatId.replace("@g.us", "").replace("@c.us", "").replace("@s.whatsapp.net", "");
    if (!phone || phone.includes("@")) {
      return NextResponse.json({ status: "ignored", reason: "group or invalid" }, { status: 200 });
    }

    const content = msgData.body || msgData.content || msgData.message?.conversation || msgData.message?.extendedTextMessage?.text;
    if (!content) {
      return NextResponse.json({ status: "ignored", reason: "no content (media/system message)" }, { status: 200 });
    }

    const isFromMe = msgData.fromMe === true;
    const messageId = msgData.id?._serialized || msgData.id?.id || msgData.id || msgData.key?.id || `wh_${Date.now()}`;

    // Find or create contact
    let contactId: string;
    const existingContact = await db
      .select()
      .from(contacts)
      .where(eq(contacts.phone, phone))
      .limit(1);

    if (existingContact.length > 0) {
      contactId = existingContact[0].id;
    } else {
      const newContact = await db
        .insert(contacts)
        .values({
          name: msgData.pushName || msgData.name || `WhatsApp: ${phone}`,
          phone: phone,
          email: `${phone}@whatsapp.local`,
          stage: "new",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning({ id: contacts.id });
      contactId = newContact[0].id;
    }

    // Check if message already exists
    const existing = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.contactId, contactId),
          eq(messages.messageId, messageId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ status: "duplicate" }, { status: 200 });
    }

    // Save message
    await db.insert(messages).values({
      id: randomUUID(),
      contactId: contactId,
      canal: "whatsapp",
      direccion: isFromMe ? "saliente" : "entrante",
      contenido: content,
      leido: isFromMe ? true : false,
      entregado: true,
      messageId: messageId,
      createdAt: new Date((msgData.timestamp || Date.now() / 1000) * 1000).toISOString(),
      metadata: JSON.stringify({
        ack: msgData.ack,
        source: msgData.source,
        hasMedia: msgData.hasMedia,
        from: msgData.from,
        to: msgData.to,
        webhookReceived: true,
      }),
    });

    // Update contact's last contact time
    await db
      .update(contacts)
      .set({ lastContact: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(eq(contacts.id, contactId));

    console.log(`[WAHA Webhook] Saved ${isFromMe ? "outgoing" : "incoming"} message for ${phone}: ${content.slice(0, 40)}...`);

    return NextResponse.json({ status: "ok", contactId, messageId }, { status: 200 });
  } catch (error) {
    console.error("[WAHA Webhook] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// WAHA also sends GET requests to verify webhooks
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get("challenge");
  if (challenge) {
    return new Response(challenge, { status: 200 });
  }
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
