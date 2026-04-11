import { NextResponse } from "next/server";
import { client } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId || !userRole) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const syncResult = await client.execute(
      "SELECT * FROM email_sync_control WHERE id = 1"
    );

    const messagesResult = await client.execute(
      "SELECT COUNT(*) as total FROM messages WHERE canal = 'email' AND direccion = 'entrante'"
    );

    const recentMessages = await client.execute(
      `SELECT m.asunto, m.fecha, c.email as contact_email 
       FROM messages m 
       LEFT JOIN contacts c ON m.contact_id = c.id 
       WHERE m.canal = 'email' AND m.direccion = 'entrante' 
       ORDER BY m.fecha DESC 
       LIMIT 5`
    );

    const row = syncResult.rows?.[0] as unknown as {
      last_processed_message_id?: string;
      last_sync_at?: string;
    };

    const countRow = messagesResult.rows?.[0] as unknown as { total: number };

    return NextResponse.json({
      lastProcessedMessageId: row?.last_processed_message_id || null,
      lastSyncAt: row?.last_sync_at || null,
      totalEmailsEntrantes: countRow?.total || 0,
      recentEmails: recentMessages.rows || [],
    });
  } catch (error) {
    console.error("Error fetching sync status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
