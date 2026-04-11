import { NextResponse } from "next/server";
import { syncNewEmails } from "@/lib/email/syncService";

export async function GET(request: Request) {
  console.log("[receive-sync] Starting sync...");
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId || !userRole) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await syncNewEmails();
    console.log("[receive-sync] Result:", JSON.stringify(result));

    if (result.status === "failed") {
      return NextResponse.json(
        { error: "Sync failed", details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "ok",
      processed: result.processed,
      lastProcessedMessageId: result.lastProcessedMessageId,
      lastProcessedUid: result.lastProcessedUid,
      lastSyncAt: result.lastSyncAt,
    });
  } catch (error) {
    console.error("[receive-sync] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
