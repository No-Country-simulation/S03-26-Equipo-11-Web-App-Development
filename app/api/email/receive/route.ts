import { NextResponse } from "next/server";
import { receiveEmails } from "@/lib/email/imapService";

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId || !userRole) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");
    
    const result = await receiveEmails({ limit, offset, unreadOnly: false, mailbox: "INBOX" });
    const status = result.status === "failed" ? 500 : 200;
    return NextResponse.json(result, { status });
  } catch (error) {
    console.error("Email receive error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
