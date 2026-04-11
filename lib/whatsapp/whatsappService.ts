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

export async function sendWhatsAppMessage(payload: WhatsAppSendPayload): Promise<WhatsAppSendResult> {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiKey = process.env.WHATSAPP_API_KEY;
  const session = process.env.WHATSAPP_SESSION || "default";

  if (!apiUrl) {
    return { status: "failed", error: "WhatsApp API not configured" };
  }

  try {
    let phone = payload.phone || payload.to;
    let contactId = payload.contactId;

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

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    const response = await fetch(`${apiUrl}/api/sendText`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        session: session,
        chatId: chatId,
        text: payload.text,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("WAHA send error:", errorData);
      return { status: "failed", error: `WAHA error: ${response.status}` };
    }

    const result = await response.json();
    let messageId = result.id || result.messageId;
    
    if (typeof messageId === "object" && messageId !== null) {
      messageId = messageId._serialized || messageId.id || `wa_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
    } else if (!messageId) {
      messageId = `wa_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
    }

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

    if (finalContactId) {
      await db.insert(messages).values({
        id: randomUUID(),
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
  unreadOnly?: boolean
): Promise<WhatsAppContactsResponse> {
  const offset = (page - 1) * limit;

  const whereConditions = [eq(messages.canal, "whatsapp")];

  let contactsWithMessages: { contactId: string }[] = [];

  if (search) {
    const searchLower = `%${search.toLowerCase()}%`;
    const contactsWithSearch = await db
      .selectDistinct({
        contactId: messages.contactId,
      })
      .from(messages)
      .innerJoin(contacts, eq(messages.contactId, contacts.id))
      .where(
        and(
          eq(messages.canal, "whatsapp"),
          or(
            like(contacts.name, searchLower),
            like(contacts.phone, searchLower)
          )
        )
      );
    contactsWithMessages = contactsWithSearch.filter((c): c is { contactId: string } => c.contactId !== null);
  } else {
    const allContactsWithMessages = await db
      .selectDistinct({
        contactId: messages.contactId,
      })
      .from(messages)
      .where(eq(messages.canal, "whatsapp"));
    contactsWithMessages = allContactsWithMessages.filter((c): c is { contactId: string } => c.contactId !== null);
  }

  const contactIds = contactsWithMessages.map((c) => c.contactId);

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

  const contactData = await db
    .select()
    .from(contacts)
    .where(sql`${contacts.id} IN ${paginatedIds}`);

  if (contactData.length === 0) {
    return {
      data: [],
      pagination: { page, limit, total, totalPages },
    };
  }

  const formattedContacts: WhatsAppContact[] = [];

  for (const contact of contactData) {
    const lastMessageResult = await db
      .select()
      .from(messages)
      .where(and(eq(messages.contactId, contact.id), eq(messages.canal, "whatsapp")))
      .orderBy(desc(messages.createdAt))
      .limit(1);

    const lastMessage = lastMessageResult[0];
    const lastMessagePreview = lastMessage
      ? lastMessage.contenido?.slice(0, 30) || ""
      : "";

    const unreadCountResult = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.contactId, contact.id),
          eq(messages.canal, "whatsapp"),
          eq(messages.direccion, "entrante"),
          eq(messages.leido, false)
        )
      );

    const unreadCount = unreadCountResult.length;

    formattedContacts.push({
      contactId: contact.id,
      name: contact.name,
      phone: contact.phone || "",
      lastMessage: lastMessagePreview,
      unreadCount,
      lastMessageAt: lastMessage?.createdAt || contact.lastContact || "",
    });
  }

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
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiKey = process.env.WHATSAPP_API_KEY;
  const session = process.env.WHATSAPP_SESSION || "default";

  const contactData = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, contactId))
    .limit(1);

  if (contactData.length === 0) {
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }

  const phone = contactData[0].phone;
  if (!phone) {
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }

  const cleanPhone = phone.replace(/[^\d+]/g, "");
  const formattedPhone = cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`;
  const chatId = formattedPhone.replace("+", "") + "@c.us";

  if (!apiUrl) {
    const allMessages = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.contactId, contactId),
          eq(messages.canal, "whatsapp")
        )
      )
      .orderBy(desc(messages.createdAt));

    const total = allMessages.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedMessages = allMessages.slice((page - 1) * limit, page * limit);

    const formattedMessages: WhatsAppMessage[] = paginatedMessages.map((msg) => ({
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

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    const response = await fetch(`${apiUrl}/api/${session}/chats/${chatId}/messagesHistory?limit=${limit}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      console.error("WAHA messagesHistory error:", response.status, await response.text());
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

      const total = allMessages.length;
      const totalPages = Math.ceil(total / limit);
      const paginatedMessages = allMessages.slice((page - 1) * limit, page * limit);

      const formattedMessages: WhatsAppMessage[] = paginatedMessages.map((msg) => ({
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

    const wahaMessages = await response.json();
    const messagesArray = Array.isArray(wahaMessages) ? wahaMessages : [];

    const total = messagesArray.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedMessages = messagesArray.slice((page - 1) * limit, page * limit).reverse();

    const formattedMessages: WhatsAppMessage[] = paginatedMessages.map((msg: any) => {
      const msgId = msg.id?._serialized || msg.id?.id || msg.key?.id || `wa_${Math.random().toString(36).slice(2)}`;
      return {
        id: msgId,
        contenido: msg.body || msg.content || msg.message?.conversation || msg.message?.extendedTextMessage?.text || "",
        direccion: msg.fromMe ? "saliente" : "entrante",
        fecha: msg.timestamp ? new Date(msg.timestamp * 1000).toISOString() : new Date().toISOString(),
        leido: msg.ack >= 2,
      };
    });

    if (formattedMessages.length > 0 && formattedMessages[0].direccion === "entrante") {
      await db
        .update(messages)
        .set({ leido: true })
        .where(
          and(
            eq(messages.contactId, contactId),
            eq(messages.canal, "whatsapp"),
            eq(messages.direccion, "entrante"),
            eq(messages.leido, false)
          )
        );
    }

    return {
      data: formattedMessages,
      pagination: { page, limit, total, totalPages },
    };
  } catch (error) {
    console.error("WhatsApp messages error:", error);
    const allMessages = await db
      .select()
      .from(messages)
      .where(
        and(
          eq(messages.contactId, contactId),
          eq(messages.canal, "whatsapp")
        )
      )
      .orderBy(desc(messages.createdAt));

    const total = allMessages.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedMessages = allMessages.slice((page - 1) * limit, page * limit);

    const formattedMessages: WhatsAppMessage[] = paginatedMessages.map((msg) => ({
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
}

export async function syncWhatsAppMessages(): Promise<WhatsAppSyncResult> {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const apiKey = process.env.WHATSAPP_API_KEY;
  const session = process.env.WHATSAPP_SESSION || "default";

  if (!apiUrl) {
    return { newMessages: 0, contactsUpdated: 0, errors: ["WhatsApp API not configured"] };
  }

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    const response = await fetch(`${apiUrl}/api/${session}/chats/overview?limit=50`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return { newMessages: 0, contactsUpdated: 0, errors: [`WAHA error: ${response.status}`] };
    }

    const data = await response.json();
    const chatsData = data || [];

    let newMessagesCount = 0;
    let contactsUpdatedCount = 0;

    for (const chat of chatsData) {
      const chatId = chat.id || "";
      const phone = chatId.replace("@g.us", "").replace("@c.us", "") || "";
      if (!phone) continue;

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
            name: chat.name || `WhatsApp: ${phone}`,
            phone: phone,
            email: `${phone}@whatsapp.local`,
            stage: "new",
            lastContact: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
          .returning({ id: contacts.id });
        contactId = newContact[0].id;
        contactsUpdatedCount++;
      }

      const lastMsg = chat.lastMessage;
      if (lastMsg && typeof lastMsg === "object" && lastMsg.body) {
        const messageId = lastMsg.id || `${chatId}_${lastMsg.timestamp}`;
        const existingMessage = await db
          .select()
          .from(messages)
          .where(eq(messages.messageId, messageId))
          .limit(1);

        if (existingMessage.length === 0) {
          await db.insert(messages).values({
            id: randomUUID(),
            contactId: contactId,
            canal: "whatsapp",
            direccion: lastMsg.fromMe ? "saliente" : "entrante",
            contenido: lastMsg.body,
            leido: false,
            entregado: true,
            messageId: messageId,
            createdAt: new Date((lastMsg.timestamp || Date.now() / 1000) * 1000).toISOString(),
            metadata: JSON.stringify({
              ack: lastMsg.ack,
              ackName: lastMsg.ackName,
              source: lastMsg.source,
              hasMedia: lastMsg.hasMedia,
              mediaType: lastMsg.media?.mimetype,
              originalTimestamp: lastMsg.timestamp,
              from: lastMsg.from,
              to: lastMsg.to,
            }),
          });
          newMessagesCount++;
        }
      }

      await db
        .update(contacts)
        .set({ 
          lastContact: lastMsg && typeof lastMsg === "object" && lastMsg.timestamp 
            ? new Date(lastMsg.timestamp * 1000).toISOString() 
            : new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        })
        .where(eq(contacts.id, contactId));
    }

    return {
      newMessages: newMessagesCount,
      contactsUpdated: contactsUpdatedCount,
    };
  } catch (error) {
    console.error("WhatsApp sync error:", error);
    return {
      newMessages: 0,
      contactsUpdated: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}