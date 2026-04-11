// Schema de Base de Datos - Startup CRM
// Usado por Drizzle ORM con SQLite/libSQL (Turso)

import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// ============================================
// BETTER AUTH TABLES
// ============================================
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    token: text("token").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ]
);

export const accounts = sqliteTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
    scope: text("scope"),
    password: text("password"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => [
    index("account_user_id_idx").on(table.userId),
    index("account_provider_id_idx").on(table.providerId, table.accountId),
  ]
);

export const verifications = sqliteTable(
  "verifications",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }),
    updatedAt: integer("updated_at", { mode: "timestamp" }),
  },
  (table) => [
    index("verification_identifier_idx").on(table.identifier),
  ]
);

// ============================================
// USUARIOS
// ============================================
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password: text("password"),
  name: text("name").notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role", { enum: ["admin", "agent", "user"] }).notNull().default("user"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============================================
// CONTACTOS (Leads/Clientes)
// ============================================
export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  stage: text("stage", { 
    enum: ["new", "contacted", "qualified", "proposal", "won", "lost"] 
  }).notNull().default("new"),
  tags: text("tags"),
  lastContact: text("last_contact"),
  notes: text("notes"),
  avatar: text("avatar"),
  assignedTo: text("assigned_to").references(() => users.id),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============================================
// PLANTILLAS DE EMAIL
// ============================================
export const emailTemplates = sqliteTable("email_templates", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  category: text("category", { 
    enum: ["welcome", "followup", "proposal", "reminder", "custom"] 
  }).notNull().default("custom"),
  variables: text("variables"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdBy: text("created_by").references(() => users.id),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============================================
// RECORDATORIOS / TAREAS
// ============================================
export const reminders = sqliteTable("reminders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  contactId: text("contact_id").references(() => contacts.id),
  userId: text("user_id").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: text("due_date").notNull(),
  dueTime: text("due_time"),
  priority: text("priority", { 
    enum: ["low", "medium", "high"] 
  }).notNull().default("medium"),
  status: text("status", { 
    enum: ["pending", "completed", "cancelled", "overdue"] 
  }).notNull().default("pending"),
  completedAt: text("completed_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// ============================================
// MENSAJES (Tabla unificada)
// ============================================
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  contactId: text("contact_id").references(() => contacts.id),
  canal: text("canal", { enum: ["whatsapp", "email", "sms"] }).notNull().default("email"),
  direccion: text("direccion", { enum: ["entrante", "saliente"] }).notNull(),
  contenido: text("contenido"),
  asunto: text("asunto"),
  fecha: text("fecha").notNull().$defaultFn(() => new Date().toISOString()),
  leido: integer("leido", { mode: "boolean" }).notNull().default(false),
  entregado: integer("entregado", { mode: "boolean" }).notNull().default(true),
  messageId: text("message_id"),
  metadata: text("metadata", { mode: "json" }),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

// ============================================
// CONTROL DE SINCRONIZACIÓN DE EMAIL
// ============================================
export const emailSyncControl = sqliteTable("email_sync_control", {
  id: integer("id").primaryKey().$defaultFn(() => 1),
  lastProcessedMessageId: text("last_processed_message_id"),
  lastProcessedUid: text("last_processed_uid"),
  lastSyncAt: text("last_sync_at"),
});

// ============================================
// TIPOS EXPORTADOS
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

export type EmailTemplate = typeof emailTemplates.$inferSelect;
export type NewEmailTemplate = typeof emailTemplates.$inferInsert;

export type Reminder = typeof reminders.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type EmailSyncControl = typeof emailSyncControl.$inferSelect;
