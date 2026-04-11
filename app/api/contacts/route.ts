import { NextResponse } from "next/server";
import {
  listContacts,
  createContact,
  validateLimit,
  validatePage,
  DuplicateContactError,
} from "@/lib/db/contacts-queries";
import { ContactCreateSchema, FunnelStageSchema, type FunnelStage } from "@/lib/db/contacts-schema";

export const dynamic = "force-dynamic";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function badRequestResponse(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

function errorResponse(error: string, status = 500, details?: unknown) {
  const response: Record<string, unknown> = { error };
  if (process.env.NODE_ENV === "development" && details) {
    response.details = details;
  }
  return NextResponse.json(response, { status });
}

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    console.log(`RECEIVED x-user-id on ${request.method}:`, userId);
    if (!userId) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);

    const page = validatePage(searchParams.get("page"));
    const limit = validateLimit(searchParams.get("limit"));

    const stageParam = searchParams.get("stage");
    const stage = stageParam
      ? (FunnelStageSchema.parse(stageParam) as FunnelStage)
      : undefined;

    const search = searchParams.get("search") || undefined;

    const tagsParam = searchParams.get("tags");
    const tags = tagsParam ? tagsParam.split(",").map((t) => t.trim()) : undefined;

    const result = await listContacts({ page, limit, stage, search, tags });

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      return badRequestResponse("Parámetros de consulta inválidos");
    }
    console.error("GET /api/contacts error:", err);
    return errorResponse("Internal server error");
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    console.log(`RECEIVED x-user-id on ${request.method}:`, userId);
    if (!userId) {
      return unauthorizedResponse();
    }

    let bodyJson: unknown;
    const bodyText = await request.text();
    
    try {
      if (!bodyText) {
        throw new Error("EMPTY_BODY");
      }
      bodyJson = JSON.parse(bodyText);
    } catch (parseError: unknown) {
      console.error("POST /api/contacts JSON parse error:", parseError);
      return NextResponse.json({ 
        error: "Invalid JSON payload", 
        details: getErrorMessage(parseError),
        rawBodyReceived: bodyText || "EMPTY" 
      }, { status: 400 });
    }

    const parsed = ContactCreateSchema.safeParse(bodyJson);

    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      }
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const contact = await createContact(parsed.data);

    return NextResponse.json(contact, { status: 201 });
  } catch (err) {
    console.error("POST /api/contacts CRITICAL ERROR:", err);
    if (err instanceof Error && err.name === "ZodError") {
      const errors: Record<string, string[]> = {};
      for (const issue of (err as unknown as { issues: Array<{ path: string[]; message: string }> }).issues) {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      }
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }
    if (err instanceof DuplicateContactError) {
      return NextResponse.json(
        { error: "Ya existe un contacto con ese email" },
        { status: 409 }
      );
    }
    console.error("POST /api/contacts error:", err);
    return errorResponse("Internal server error", 500, err instanceof Error ? err.message : String(err));
  }
}
