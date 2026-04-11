import { NextResponse } from "next/server";
import { receiveEmailById } from "@/lib/email/imapService";

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

    const payload = bodyJson as Record<string, unknown>;
    const messageId = typeof payload.messageId === "string" ? payload.messageId : "";
    const mailbox = typeof payload.mailbox === "string" ? payload.mailbox : "INBOX";

    if (!messageId) {
      return NextResponse.json({ error: "Missing 'messageId'" }, { status: 400 });
    }

    const result = await receiveEmailById(messageId, mailbox);
    const status = result.status === "failed" ? 500 : 200;
    return NextResponse.json(result, { status });
  } catch (error) {
    console.error("Email receiveOne error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
