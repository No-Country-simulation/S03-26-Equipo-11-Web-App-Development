import { eq, like, or, sql, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";
import { db } from "./index";
import { contacts, reminders, messages } from "./schema";
import type {
  Contact,
  ContactCreate,
  ContactUpdate,
  FunnelStage,
} from "./contacts-schema";
import {
  serializeTags,
  dbRowToContact,
  type ContactWithParsedTags,
  type PaginationMeta,
} from "./contacts-schema";

export interface ListContactsFilters {
  page?: number;
  limit?: number;
  stage?: FunnelStage;
  search?: string;
  tags?: string[];
}

export interface ListContactsResult {
  data: ContactWithParsedTags[];
  total: number;
}

const VALID_LIMITS = [10, 20, 30, 50, 100] as const;
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

export function validateLimit(limit: unknown): number {
  const parsed = typeof limit === "number" ? limit : parseInt(String(limit), 10);
  if (isNaN(parsed) || !VALID_LIMITS.includes(parsed as typeof VALID_LIMITS[number])) {
    return DEFAULT_LIMIT;
  }
  return parsed;
}

export function validatePage(page: unknown): number {
  const parsed = typeof page === "number" ? page : parseInt(String(page), 10);
  if (isNaN(parsed) || parsed < 1) {
    return DEFAULT_PAGE;
  }
  return parsed;
}

export class DuplicateContactError extends Error {
  constructor(email: string) {
    super(`Contact with email ${email} already exists`);
    this.name = "DuplicateContactError";
  }
}

export async function getContactByEmail(email: string): Promise<ContactWithParsedTags | null> {
  const row = await db.select().from(contacts).where(eq(contacts.email, email)).limit(1);
  if (row.length === 0) return null;
  return dbRowToContact(row[0] as Record<string, unknown>);
}

export async function listContacts(
  filters: ListContactsFilters = {}
): Promise<{ data: ContactWithParsedTags[]; pagination: PaginationMeta }> {
  const page = validatePage(filters.page);
  const limit = validateLimit(filters.limit);
  const offset = (page - 1) * limit;

  let whereCondition;

  if (filters.stage && filters.search) {
    const searchTerm = `%${filters.search}%`;
    whereCondition = and(
      eq(contacts.stage, filters.stage),
      or(
        like(contacts.name, searchTerm),
        like(contacts.email, searchTerm)
      )
    );
  } else if (filters.stage) {
    whereCondition = eq(contacts.stage, filters.stage);
  } else if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    whereCondition = or(
      like(contacts.name, searchTerm),
      like(contacts.email, searchTerm)
    );
  }

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(contacts)
    .where(whereCondition);

  const total = countResult[0]?.count ?? 0;

  const rows = await db
    .select()
    .from(contacts)
    .where(whereCondition)
    .orderBy(desc(contacts.createdAt))
    .limit(limit)
    .offset(offset);

  const data = rows.map((row) => dbRowToContact(row as Record<string, unknown>));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getContact(id: string): Promise<ContactWithParsedTags | null> {
  const row = await db.select().from(contacts).where(eq(contacts.id, id)).limit(1);
  if (row.length === 0) return null;
  return dbRowToContact(row[0] as Record<string, unknown>);
}

export async function createContact(data: ContactCreate): Promise<Contact> {
  const existing = await getContactByEmail(data.email);
  if (existing) {
    throw new DuplicateContactError(data.email);
  }

  const now = new Date().toISOString();

  const insertData = {
    id: randomUUID(),
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    company: data.company || null,
    stage: data.stage || "new",
    tags: serializeTags(data.tags || null),
    notes: data.notes || null,
    assignedTo: data.assignedTo || null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(contacts).values(insertData);

  return {
    ...insertData,
    tags: data.tags || null,
    lastContact: null,
    avatar: null,
  } as Contact;
}

export async function updateContact(
  id: string,
  data: ContactUpdate
): Promise<ContactWithParsedTags | null> {
  const existing = await getContact(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const updateData: Record<string, unknown> = {
    updatedAt: now,
  };

  if (data.name !== undefined) updateData.name = data.name;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone || null;
  if (data.company !== undefined) updateData.company = data.company || null;
  if (data.stage !== undefined) updateData.stage = data.stage;
  if (data.tags !== undefined) updateData.tags = serializeTags(data.tags || null);
  if (data.notes !== undefined) updateData.notes = data.notes || null;
  if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo || null;

  await db.update(contacts).set(updateData).where(eq(contacts.id, id));

  return getContact(id);
}

export async function deleteContact(id: string): Promise<boolean> {
  const existing = await getContact(id);
  if (!existing) return false;

  try {
    // Manual cascade delete because of foreign key constraints
    // Using a transaction to ensure atomicity
    await db.transaction(async (tx) => {
      await tx.delete(reminders).where(eq(reminders.contactId, id));
      await tx.delete(messages).where(eq(messages.contactId, id));

      await tx.delete(contacts).where(eq(contacts.id, id));
    });
    return true;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}

export async function getContactStats(): Promise<{
  total: number;
  byStage: Record<FunnelStage, number>;
}> {
  const rows = await db
    .select({
      stage: contacts.stage,
      count: sql<number>`count(*)`,
    })
    .from(contacts)
    .groupBy(contacts.stage);

  const byStage: Record<FunnelStage, number> = {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    won: 0,
    lost: 0,
  };

  let total = 0;

  for (const row of rows) {
    if (row.stage && typeof row.stage === "string" && row.stage in byStage) {
      byStage[row.stage as FunnelStage] = row.count;
      total += row.count;
    }
  }

  return { total, byStage };
}
