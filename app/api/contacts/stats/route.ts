import { NextResponse } from "next/server";
import { getContactStats } from "@/lib/db/contacts-queries";

export const dynamic = "force-dynamic";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function errorResponse(error: string, status = 500) {
  return NextResponse.json({ error }, { status });
}

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    const stats = await getContactStats();

    return NextResponse.json(stats);
  } catch (err) {
    console.error("GET /api/contacts/stats error:", err);
    return errorResponse("Internal server error");
  }
}
