import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/emailService";
import { db } from "@/lib/db";
import { contacts, messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId || !userRole) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bodyText = await request.text();
    let bodyJson: unknown;
    try { bodyJson = bodyText ? JSON.parse(bodyText) : {}; } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { to, subject, html, text, templateId, metadata } = bodyJson as Record<string, unknown>;

    if (!to || typeof to !== "string" || !to.includes("@")) {
      return NextResponse.json({ error: "Invalid 'to' email" }, { status: 400 });
    }
    if (!subject || typeof subject !== "string") {
      return NextResponse.json({ error: "Missing 'subject'" }, { status: 400 });
    }

    const emailLower = to.toLowerCase();

    const existingContact = await db
      .select()
      .from(contacts)
      .where(eq(contacts.email, emailLower))
      .limit(1);

    let contactId: string;
    let contactCreated = false;

    if (existingContact.length > 0) {
      contactId = existingContact[0].id;
    } else {
      const newContact = await db
        .insert(contacts)
        .values({
          name: to.split("@")[0],
          email: emailLower,
          stage: "new",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning({ id: contacts.id });
      
      contactId = newContact[0].id;
      contactCreated = true;
    }

    const emailResult = await sendEmail({
      to,
      subject,
      html: html as string | undefined,
      text: text as string | undefined,
      contactId,
      templateId: templateId as string | undefined,
      metadata: metadata as Record<string, string> | undefined,
    });

    if (emailResult.status === "failed") {
      return NextResponse.json(
        { error: "Failed to send email", details: emailResult.error },
        { status: 500 }
      );
    }

    const plainContent = text 
      ? text as string 
      : html 
        ? (html as string).replace(/<[^>]*>/g, "").slice(0, 500) 
        : "";

    await db
      .insert(messages)
      .values({
        contactId,
        canal: "email",
        direccion: "saliente",
        contenido: plainContent,
        asunto: subject as string,
        leido: true,
        entregado: true,
        metadata: { messageId: emailResult.messageId },
        createdAt: new Date().toISOString(),
      });

    return NextResponse.json({
      status: "sent",
      contactId,
      contactCreated,
      messageId: emailResult.messageId,
      message: "Email enviado correctamente",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}