import { z } from "zod";

const PHONE_REGEX = /^\+?[\d\s\-]{7,20}$/;

export const FunnelStageSchema = z.enum([
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
]);

export type FunnelStage = z.infer<typeof FunnelStageSchema>;

export const ContactCreateSchema = z.object({
  name: z
    .string()
    .min(2, "Nombre debe tener al menos 2 caracteres")
    .max(255),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .regex(PHONE_REGEX, "Teléfono inválido (solo números, mín 7 chars)")
    .optional()
    .nullable()
    .or(z.literal("")),
  company: z.string().optional().nullable(),
  stage: FunnelStageSchema.default("new"),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

export const ContactUpdateSchema = ContactCreateSchema.partial();

export type ContactCreate = z.infer<typeof ContactCreateSchema>;
export type ContactUpdate = z.infer<typeof ContactUpdateSchema>;

export interface Contact extends ContactCreate {
  id: string;
  lastContact: string | null | undefined;
  avatar: string | null | undefined;
  assignedTo: string | null | undefined;
  createdAt: string;
  updatedAt: string;
}

export interface ContactWithParsedTags extends Omit<Contact, "tags"> {
  tags: string[] | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContactsListResponse {
  data: ContactWithParsedTags[];
  pagination: PaginationMeta;
}

export interface ContactsStatsResponse {
  total: number;
  byStage: Record<FunnelStage, number>;
}

export interface ApiError {
  error: string;
  details?: Record<string, string[]>;
}

export function parseTags(tagsJson: string | null): string[] | null {
  if (!tagsJson) return null;
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function serializeTags(tags: string[] | null): string | null {
  if (!tags || tags.length === 0) return null;
  return JSON.stringify(tags);
}

export function dbRowToContact(row: Record<string, unknown>): ContactWithParsedTags {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: row.phone as string | null,
    company: row.company as string | null,
    stage: row.stage as FunnelStage,
    tags: parseTags(row.tags as string | null),
    lastContact: row.lastContact as string | null,
    notes: row.notes as string | null,
    avatar: row.avatar as string | null,
    assignedTo: row.assignedTo as string | null,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  };
}
