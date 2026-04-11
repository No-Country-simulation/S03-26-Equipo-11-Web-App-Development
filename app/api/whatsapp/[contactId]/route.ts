import { NextResponse } from "next/server";
import { getWhatsAppMessages } from "@/lib/whatsapp/whatsappService";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("better-auth.session_token");
    if (!sessionToken?.value) {
      return NextResponse.json({ error: "Unauthorized - no cookie" }, { status: 401 });
    }
    const session = await auth.api.getSession({
      headers: { cookie: `better-auth.session_token=${sessionToken.value}` },
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
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