import { NextResponse } from "next/server";
import { getWhatsAppMessages } from "@/lib/whatsapp/whatsappService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contactId } = await params;

    const { searchParams } = new URL(request.url);
    const page = Math.min(parseInt(searchParams.get("page") || "1"), 100);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

    const result = await getWhatsAppMessages(contactId, page, limit);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("WhatsApp messages API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}