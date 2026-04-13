import { randomUUID } from "crypto";
import { db } from "../db/index";
import { messages, contacts } from "../db/schema";
import { eq, desc, asc, and, or, like, sql } from "drizzle-orm";

export interface WhatsAppContact {
  contactId: string;
  name: string;
  phone: string;
  lastMessage: string;
  unreadCount: number;
  lastMessageAt: string;
}

export interface WhatsAppMessage {
  id: string;
  contenido: string;
  direccion: "entrante" | "saliente";
  fecha: string;
  leido: boolean;
}

export interface WhatsAppSendPayload {
  contactId?: string;
  phone?: string;
  to?: string;
  text: string;
  metadata?: Record<string, unknown>;
}

export interface WhatsAppSendResult {
  status: "sent" | "failed";
  messageId?: string;
  contactId?: string;
  error?: string;
}

export interface WhatsAppSyncResult {
  newMessages: number;
  contactsUpdated: number;
  errors?: string[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface WhatsAppContactsResponse {
  data: WhatsAppContact[];
  pagination: PaginationMeta;
}

export interface WhatsAppMessagesResponse {
  data: WhatsAppMessage[];
  pagination: PaginationMeta;
}

interface WahaMessageLike {
  id?: { _serialized?: string; id?: string } | string;
  key?: { id?: string };
  body?: string;
  content?: string;
  message?: {
    conversation?: string;
    extendedTextMessage?: { text?: string };
  };
  fromMe?: boolean;
  timestamp?: number;
  ack?: number;
}

function shouldUseRemoteHistory(): boolean {
  return process.env.WHATSAPP_USE_REMOTE_HISTORY === "true";
}

export async function sendWhatsAppMessage(payload: WhatsAppSendPayload): Promise<WhatsAppSendResult> {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiKey = process.env.WHATSAPP_API_KEY;
  const session = process.env.WHATSAPP_SESSION || "default";

  if (!apiUrl) {
    return { status: "failed", error: "WhatsApp API not configured" };
  }

  try {
    let phone = payload.phone || payload.to;
    const contactId = payload.contactId;

    if (!phone && contactId) {
      const contact = await db
        .select({ phone: contacts.phone, id: contacts.id })
        .from(contacts)
        .where(eq(contacts.id, contactId))
        .limit(1);

      if (contact.length > 0) {
        phone = contact[0].phone || undefined;
      }
    }

    if (!phone) {
      return { status: "failed", error: "Phone number not found" };
    }

    const cleanPhone = phone.replace(/[^\d+]/g, "");
    const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`;
    const chatId = formattedPhone.replace("+", "") + "@c.us";

    // Resolve contact ID
    let finalContactId = contactId;
    if (!finalContactId) {
      const existing = await db
        .select()
        .from(contacts)
        .where(eq(contacts.phone, formattedPhone))
        .limit(1);

      if (existing.length > 0) {
        finalContactId = existing[0].id;
      } else {
        const newContact = await db
          .insert(contacts)
          .values({
            name: `WhatsApp: ${formattedPhone}`,
            phone: formattedPhone,
            email: `${formattedPhone}@whatsapp.local`,
            stage: "new",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .returning({ id: contacts.id });
        finalContactId = newContact[0].id;
      }
    }

    // Generate message ID upfront
    const messageId = `wa_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    // Save to DB FIRST - this is the source of truth
    if (finalContactId) {
      await db.insert(messages).values({
        id: messageId,
        contactId: finalContactId,
        canal: "whatsapp",
        direccion: "saliente",
        contenido: payload.text,
        leido: true,
        entregado: true,
        messageId: messageId,
        createdAt: new Date().toISOString(),
      });

      await db
        .update(contacts)
        .set({ lastContact: new Date().toISOString(), updatedAt: new Date().toISOString() })
        .where(eq(contacts.id, finalContactId));
    }

    // Fire-and-forget: send to WAHA in background
    // Don't block the response on WAHA - the message is already saved
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    // Use setTimeout to detach from the response lifecycle
    setTimeout(async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(`${apiUrl}/api/sendText`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            session: session,
            chatId: chatId,
            text: payload.text,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("WAHA send error (background):", response.status, errorData);
        } else {
          const result = await response.json();
          const waMessageId = result.id || result.messageId || messageId;

          // Update the message with WAHA's real message ID
          if (typeof waMessageId === "string" && waMessageId !== messageId) {
            await db
              .update(messages)
              .set({ messageId: waMessageId })
              .where(eq(messages.id, messageId));
          }
        }
      } catch (error) {
        console.error("WAHA background send error:", error);
      }
    }, 0);

    return {
      status: "sent",
      messageId,
      contactId: finalContactId,
    };
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return {
      status: "failed",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function getWhatsAppContacts(
  page: number = 1,
  limit: number = 20,
  search?: string,
  _unreadOnly?: boolean
): Promise<WhatsAppContactsResponse> {
  const offset = (page - 1) * limit;

  // Optimized: Get contact IDs first, then fetch last messages and unread counts in batch
  // Reduces from N+1 queries (101 queries for 50 contacts) to just 3 queries total
  const searchLower = search ? `%${search.toLowerCase()}%` : null;

  // Step 1: Get all contact IDs that have WhatsApp messages
  const contactIdsResult = await db
    .selectDistinct({
      contactId: messages.contactId,
    })
    .from(messages)
    .innerJoin(contacts, eq(messages.contactId, contacts.id))
    .where(
      and(
        eq(messages.canal, "whatsapp"),
        searchLower ? or(like(contacts.name, searchLower), like(contacts.phone, searchLower)) : undefined
      )
    );

  const contactIds = contactIdsResult
    .map((c) => c.contactId)
    .filter((id): id is string => id !== null);

  if (contactIds.length === 0) {
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }

  const total = contactIds.length;
  const totalPages = Math.ceil(total / limit);
  const paginatedIds = contactIds.slice(offset, offset + limit);

  if (paginatedIds.length === 0) {
    return {
      data: [],
      pagination: { page, limit, total, totalPages },
    };
  }

  // Step 2: Get last messages for all paginated contacts in ONE query
  const lastMessagesResult = await db
    .select({
      contactId: messages.contactId,
      contenido: messages.contenido,
      createdAt: messages.createdAt,
    })
    .from(messages)
    .where(
      and(
        eq(messages.canal, "whatsapp"),
        sql`${messages.contactId} IN ${paginatedIds}`
      )
    )
    .orderBy(desc(messages.createdAt));

  // Deduplicate: keep only the last message per contact
  const lastMessageMap = new Map<string, { contenido: string | null; createdAt: string | null }>();
  for (const msg of lastMessagesResult) {
    if (msg.contactId && !lastMessageMap.has(msg.contactId)) {
      lastMessageMap.set(msg.contactId, {
        contenido: msg.contenido,
        createdAt: msg.createdAt,
      });
    }
  }

  // Step 3: Get unread counts for all paginated contacts in ONE query
  const unreadCountsResult = await db
    .select({
      contactId: messages.contactId,
      count: sql<number>`COUNT(*)`,
    })
    .from(messages)
    .where(
      and(
        eq(messages.canal, "whatsapp"),
        eq(messages.direccion, "entrante"),
        eq(messages.leido, false),
        sql`${messages.contactId} IN ${paginatedIds}`
      )
    )
    .groupBy(messages.contactId);

  const unreadMap = new Map(
    unreadCountsResult.map((c) => [c.contactId, Number(c.count)])
  );

  // Step 4: Get contact details
  const contactsResult = await db
    .select({
      id: contacts.id,
      name: contacts.name,
      phone: contacts.phone,
      lastContact: contacts.lastContact,
    })
    .from(contacts)
    .where(sql`${contacts.id} IN ${paginatedIds}`);

  // Combine all data
  const formattedContacts: WhatsAppContact[] = contactsResult.map((contact) => {
    const lastMsg = lastMessageMap.get(contact.id);
    const unreadCount = unreadMap.get(contact.id) || 0;

    return {
      contactId: contact.id,
      name: contact.name,
      phone: contact.phone || "",
      lastMessage: lastMsg?.contenido?.slice(0, 30) || "",
      unreadCount,
      lastMessageAt: lastMsg?.createdAt || contact.lastContact || "",
    };
  });

  // Sort by last message date
  formattedContacts.sort((a, b) => {
    const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return dateB - dateA;
  });

  return {
    data: formattedContacts,
    pagination: { page, limit, total, totalPages },
  };
}

export async function getWhatsAppMessages(
  contactId: string,
  page: number = 1,
  limit: number = 50
): Promise<WhatsAppMessagesResponse> {
  // Always read from local DB - it's the single source of truth
  // Sync brings new messages INTO the DB, this function reads them OUT
  const allMessages = await db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.contactId, contactId),
        eq(messages.canal, "whatsapp")
      )
    )
    .orderBy(asc(messages.createdAt));

  // Return only the last 5 messages (most recent)
  const lastMessages = allMessages.slice(-limit);

  const total = allMessages.length;
  const totalPages = Math.ceil(total / limit);

  const formattedMessages: WhatsAppMessage[] = lastMessages.map((msg) => ({
    id: msg.id,
    contenido: msg.contenido || "",
    direccion: msg.direccion as "entrante" | "saliente",
    fecha: msg.createdAt,
    leido: msg.leido,
  }));

  return {
    data: formattedMessages,
    pagination: { page, limit, total, totalPages },
  };
}

export async function syncWhatsAppMessages(): Promise<WhatsAppSyncResult> {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiKey = process.env.WHATSAPP_API_KEY;
  const session = process.env.WHATSAPP_SESSION || "default";
  const maxChats = parseInt(process.env.WHATSAPP_SYNC_MAX_CHATS || "10");

  if (!apiUrl) {
    return { newMessages: 0, contactsUpdated: 0, errors: ["WhatsApp API not configured"] };
  }

  console.log(`[WAHA Sync] Starting sync with ${apiUrl}, session: ${session}, maxChats: ${maxChats}`);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    // Step 1: Get chat overview (limited + with timeout)
    const overviewController = new AbortController();
    const overviewTimeout = setTimeout(() => overviewController.abort(), 8000);

    const response = await fetch(`${apiUrl}/api/${session}/chats/overview?limit=${maxChats}`, {
      method: "GET",
      headers,
      signal: overviewController.signal,
    });
    clearTimeout(overviewTimeout);

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[WAHA Sync] Overview failed: ${response.status} ${errorText.slice(0, 200)}`);
      return { newMessages: 0, contactsUpdated: 0, errors: [`WAHA overview error: ${response.status}`] };
    }

    const chatsData = (await response.json()) || [];
    console.log(`[WAHA Sync] Found ${chatsData.length} chats in overview`);

    // Filter to only chats with recent activity (last 24 hours)
    const now = Date.now();
    const recentChats = chatsData.filter((c: Record<string, unknown>) => {
      const lastMsg = c.lastMessage as Record<string, number> | undefined;
      const ts = lastMsg?.timestamp ? lastMsg.timestamp * 1000 : 0;
      return ts > 0 && (now - ts) < 24 * 60 * 60 * 1000;
    });

    console.log(`[WAHA Sync] ${recentChats.length} chats with recent activity`);

    if (recentChats.length === 0) {
      return { newMessages: 0, contactsUpdated: 0, errors: [] };
    }

    // Step 2: Fetch messages for all recent chats IN PARALLEL (not sequential)
    const messagesPerChat = parseInt(process.env.WHATSAPP_SYNC_MESSAGES_PER_CHAT || "5");
    const chatFetchPromises = recentChats.map(async (chat: Record<string, unknown>) => {
      const chatId = (chat.id as string) || "";
      const phone = chatId.replace("@g.us", "").replace("@c.us", "") || "";
      if (!phone || phone.includes("@")) return null;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          `${apiUrl}/api/${session}/chats/${chatId}/messages?limit=${messagesPerChat}`,
          { method: "GET", headers, signal: controller.signal }
        );
        clearTimeout(timeout);

        if (!res.ok) return null;
        const msgs = await res.json();
        return { chat, phone, messages: Array.isArray(msgs) ? msgs : [] };
      } catch {
        return null;
      }
    });

    const results = await Promise.all(chatFetchPromises);
    const validResults = results.filter((r): r is NonNullable<typeof r> => r !== null);
    console.log(`[WAHA Sync] Fetched messages for ${validResults.length} chats`);

    // Step 3: Flatten all messages and build contact map
    const uniquePhones = [...new Set(validResults.map((r) => r.phone))];
    const existingContacts = await db
      .select()
      .from(contacts)
      .where(sql`${contacts.phone} IN ${uniquePhones}`);

    const contactMap = new Map(existingContacts.map((c) => [c.phone, c.id]));

    // Create missing contacts in batch
    const contactsToCreate = uniquePhones.filter((p) => !contactMap.has(p));
    let contactsUpdatedCount = 0;

    if (contactsToCreate.length > 0) {
      const chatMap = new Map(
        recentChats.map((c: Record<string, unknown>) => {
          const cid = (c.id as string) || "";
          const p = cid.replace("@g.us", "").replace("@c.us", "") || "";
          return [p, c];
        })
      );

      const newContacts = await db
        .insert(contacts)
        .values(contactsToCreate.map((phone) => {
          const chat = chatMap.get(phone) as Record<string, unknown> | undefined;
          return {
            name: (chat?.name as string) || `WhatsApp: ${phone}`,
            phone,
            email: `${phone}@whatsapp.local`,
            stage: "new" as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }))
        .returning({ id: contacts.id, phone: contacts.phone });

      for (const nc of newContacts) contactMap.set(nc.phone, nc.id);
      contactsUpdatedCount = newContacts.length;
    }

    // Step 4: Collect all candidate messages
    interface MsgCandidate {
      phone: string;
      body: string;
      fromMe: boolean;
      msgId: string;
      timestamp: number;
    }
    const candidates: MsgCandidate[] = [];
    for (const result of validResults) {
      for (const msg of result.messages) {
        const msgRec = msg as Record<string, unknown>;
        const body = msgRec.body as string | undefined || msgRec.content as string | undefined || "";
        if (!body) continue;

        const idRec = msgRec.id as Record<string, string> | undefined;
        const structuredId = idRec && typeof idRec === "object" ? idRec : undefined;
        const msgId = (structuredId?._serialized || structuredId?.id || (msgRec.key as Record<string, string>)?.id || `${result.phone}_${msgRec.timestamp}`) as string;
        const fromMe = msgRec.fromMe === true;
        const timestamp = (msgRec.timestamp as number) || Math.floor(Date.now() / 1000);

        candidates.push({ phone: result.phone, body, fromMe, msgId, timestamp });
      }
    }

    if (candidates.length === 0) {
      return { newMessages: 0, contactsUpdated: contactsUpdatedCount, errors: [] };
    }

    // Step 5: Batch check existing messages
    const existingMsgIds = candidates.map((c) => c.msgId);
    const existingMessages = await db
      .select()
      .from(messages)
      .where(sql`${messages.messageId} IN ${existingMsgIds}`);
    const existingMsgSet = new Set(existingMessages.map((m) => m.messageId));

    // Step 6: Insert new messages in batch
    const messagesToInsert = candidates
      .filter((c) => !existingMsgSet.has(c.msgId))
      .map((c) => {
        const contactId = contactMap.get(c.phone);
        if (!contactId) return null;
        return {
          id: randomUUID(),
          contactId,
          canal: "whatsapp" as const,
          direccion: c.fromMe ? "saliente" as const : "entrante" as const,
          contenido: c.body,
          leido: c.fromMe,
          entregado: true,
          messageId: c.msgId,
          createdAt: new Date(c.timestamp * 1000).toISOString(),
        };
      })
      .filter(Boolean);

    let newMessagesCount = 0;
    if (messagesToInsert.length > 0) {
      await db.insert(messages).values(messagesToInsert as typeof messages.$inferInsert[]);
      newMessagesCount = messagesToInsert.length;
    }

    // Step 7: Update contact timestamps in batch
    const nowISO = new Date().toISOString();
    const contactsToUpdate = [...new Set(validResults.map((r) => r.phone).filter((p) => contactMap.has(p)))];
    const contactIdsToUpdate = contactsToUpdate.map((p) => contactMap.get(p)!);

    if (contactIdsToUpdate.length > 0) {
      await db
        .update(contacts)
        .set({ lastContact: nowISO, updatedAt: nowISO })
        .where(sql`${contacts.id} IN ${contactIdsToUpdate}`);
    }

    console.log(`[WAHA Sync] Complete: ${newMessagesCount} new messages, ${contactsUpdatedCount} contacts updated`);

    return {
      newMessages: newMessagesCount,
      contactsUpdated: contactsUpdatedCount,
      errors: [],
    };
  } catch (error) {
    console.error("[WAHA Sync] Fatal error:", error);
    return {
      newMessages: 0,
      contactsUpdated: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}
