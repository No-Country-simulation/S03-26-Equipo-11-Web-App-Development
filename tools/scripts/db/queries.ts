// Query Utilities - Startup CRM
// Funciones utilitarias para queries comunes

import { db } from "./index.js";
import { contacts, users, emailTemplates, reminders } from "./schema.js";
import { eq, desc, and, or, like, sql } from "drizzle-orm";

// ============================================
// CONTACTOS
// ============================================

export async function getContactsByStage(stage: string) {
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.stage, stage as any))
    .orderBy(desc(contacts.updatedAt));
}

export async function getContactsByAssignee(userId: string) {
  return db
    .select()
    .from(contacts)
    .where(eq(contacts.assignedTo, userId))
    .orderBy(desc(contacts.updatedAt));
}

export async function searchContacts(query: string) {
  const searchTerm = `%${query}%`;
  return db
    .select()
    .from(contacts)
    .where(
      or(
        like(contacts.name, searchTerm),
        like(contacts.email, searchTerm),
        like(contacts.company, searchTerm)
      )
    )
    .orderBy(desc(contacts.updatedAt));
}

export async function getContactWithUser(contactId: string) {
  const result = await db
    .select({
      contact: contacts,
      assignee: users,
    })
    .from(contacts)
    .leftJoin(users, eq(contacts.assignedTo, users.id))
    .where(eq(contacts.id, contactId))
    .limit(1);
  
  return result[0] || null;
}

// ============================================
// USUARIOS
// ============================================

export async function getUsersByRole(role: "admin" | "agent" | "user") {
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      active: users.active,
    })
    .from(users)
    .where(and(eq(users.role, role), eq(users.active, true)))
    .orderBy(users.name);
}

export async function getActiveAgents() {
  return getUsersByRole("agent");
}

export async function getActiveAdmins() {
  return getUsersByRole("admin");
}

// ============================================
// PLANTILLAS
// ============================================

export async function getTemplatesByCategory(category: string) {
  return db
    .select()
    .from(emailTemplates)
    .where(
      and(
        eq(emailTemplates.category, category as any),
        eq(emailTemplates.active, true)
      )
    )
    .orderBy(emailTemplates.name);
}

export async function getAllActiveTemplates() {
  return db
    .select()
    .from(emailTemplates)
    .where(eq(emailTemplates.active, true))
    .orderBy(emailTemplates.category, emailTemplates.name);
}

// ============================================
// DASHBOARD METRICS
// ============================================

export async function getContactsCountByStage() {
  const result = await db
    .select({
      stage: contacts.stage,
      count: sql<number>`count(*)`.as("count"),
    })
    .from(contacts)
    .groupBy(contacts.stage);
  
  return result;
}

export async function getTotalContacts() {
  const result = await db
    .select({
      total: sql<number>`count(*)`.as("total"),
    })
    .from(contacts);
  
  return result[0]?.total || 0;
}

export async function getActiveRemindersCount() {
  const result = await db
    .select({
      pending: sql<number>`count(*)`.as("pending"),
    })
    .from(reminders)
    .where(eq(reminders.status, "pending"));
  
  return result[0]?.pending || 0;
}

// ============================================
// ACTUALIZACIONES
// ============================================

export async function updateContactStage(contactId: string, newStage: string) {
  return db
    .update(contacts)
    .set({
      stage: newStage as any,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(contacts.id, contactId));
}

export async function updateContactLastContact(contactId: string) {
  return db
    .update(contacts)
    .set({
      lastContact: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(contacts.id, contactId));
}

export async function completeReminder(reminderId: string) {
  return db
    .update(reminders)
    .set({
      status: "completed",
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(reminders.id, reminderId));
}
