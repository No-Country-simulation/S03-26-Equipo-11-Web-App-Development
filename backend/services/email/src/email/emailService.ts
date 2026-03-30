import nodemailer from "nodemailer";
import { SendEmailPayload, SendEmailResult } from "./types.js";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 465);
const smtpSecure = String(process.env.SMTP_SECURE || "true") === "true";
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

const fromEmail = process.env.FROM_EMAIL || smtpUser;
const fromName = process.env.FROM_NAME || "CRM";

function assertConfig(): void {
  const missing: string[] = [];
  if (!smtpHost) missing.push("SMTP_HOST");
  if (!smtpUser) missing.push("SMTP_USER");
  if (!smtpPass) missing.push("SMTP_PASS");
  if (!fromEmail) missing.push("FROM_EMAIL");
  if (missing.length > 0) {
    throw new Error(`Missing SMTP config: ${missing.join(", ")}`);
  }
}

export async function sendEmail(
  payload: SendEmailPayload,
): Promise<SendEmailResult> {
  try {
    assertConfig();

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      headers: {
        "X-Contact-Id": payload.contactId?.toString() || "",
        "X-Template-Id": payload.templateId || "",
      },
    });

    return {
      status: "sent",
      provider: "smtp",
      messageId: info.messageId,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      status: "failed",
      provider: "smtp",
      error: message,
    };
  }
}
