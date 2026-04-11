import { NextResponse } from "next/server";
import { getContact, updateContact, deleteContact } from "@/lib/db/contacts-queries";
import { ContactUpdateSchema } from "@/lib/db/contacts-schema";

export const dynamic = "force-dynamic";

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function notFoundResponse() {
  return NextResponse.json({ error: "Contact not found" }, { status: 404 });
}

function errorResponse(error: string, status = 500) {
  return NextResponse.json({ error }, { status });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const contact = await getContact(id);

    if (!contact) {
      return notFoundResponse();
    }

    return NextResponse.json(contact);
  } catch (err) {
    console.error("GET /api/contacts/:id error:", err);
    return errorResponse("Internal server error");
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;

    const bodyText = await request.text();
    let bodyJson: unknown;
    try {
      bodyJson = bodyText ? JSON.parse(bodyText) : {};
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = ContactUpdateSchema.safeParse(bodyJson);

    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      }
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }

    const contact = await updateContact(id, parsed.data);

    if (!contact) {
      return notFoundResponse();
    }

    return NextResponse.json(contact);
  } catch (err) {
    if (err instanceof Error && err.name === "ZodError") {
      const errors: Record<string, string[]> = {};
      for (const issue of (err as unknown as { issues: Array<{ path: string[]; message: string }> }).issues) {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      }
      return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
    }
    console.error("PUT /api/contacts/:id error:", err);
    return errorResponse("Internal server error");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const deleted = await deleteContact(id);

    if (!deleted) {
      return notFoundResponse();
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("DELETE /api/contacts/:id error:", err);
    return errorResponse("Internal server error");
  }
}
