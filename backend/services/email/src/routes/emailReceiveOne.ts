import { receiveEmailById } from "../email/imapService.js";

export async function handleReceiveOneEmail(req: Request): Promise<Response> {
  const bodyText = await req.text();
  let bodyJson: unknown;

  try {
    bodyJson = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const payload = bodyJson as Record<string, unknown>;
  const messageId = typeof payload.messageId === "string" ? payload.messageId : null;

  if (!messageId) {
    return new Response(
      JSON.stringify({ error: "messageId is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const mailbox = typeof payload.mailbox === "string" ? payload.mailbox : "INBOX";
  const result = await receiveEmailById(messageId, mailbox);

  if (result.status === "failed") {
    const isNotFound = result.error?.includes("not found");
    const status = isNotFound ? 404 : 500;
    
    return new Response(
      JSON.stringify({ status: "error", email: [], error: result.error }),
      { status, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify(result),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}
