import { receiveEmails } from "../email/imapService.js";

export async function handleReceiveEmail(req: Request): Promise<Response> {
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
  const limit = typeof payload.limit === "number" ? payload.limit : 10;
  const unreadOnly =
    typeof payload.unreadOnly === "boolean" ? payload.unreadOnly : false;
  const mailbox = typeof payload.mailbox === "string" ? payload.mailbox : "INBOX";

  const result = await receiveEmails({ limit, unreadOnly, mailbox });
  const status = result.status === "failed" ? 500 : 200;

  return new Response(
    JSON.stringify(result),
    { status, headers: { "Content-Type": "application/json" } },
  );
}
