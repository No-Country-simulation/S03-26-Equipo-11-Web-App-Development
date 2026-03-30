import { sendEmail } from "../email/emailService.js";
import { validateSendEmailPayload } from "../utils/validate.js";

export async function handleSendEmail(req: Request): Promise<Response> {
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

  const validation = validateSendEmailPayload(bodyJson);
  if (!validation.ok) {
    return new Response(
      JSON.stringify({ error: validation.error }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const result = await sendEmail(validation.data!);
  const status = result.status === "failed" ? 500 : 202;

  return new Response(
    JSON.stringify(result),
    { status, headers: { "Content-Type": "application/json" } },
  );
}
