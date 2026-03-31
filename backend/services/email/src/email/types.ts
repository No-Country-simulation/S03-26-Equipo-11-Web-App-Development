export type SendEmailPayload = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  contactId?: number;
  templateId?: string;
  metadata?: Record<string, string>;
};

export type SendEmailResult = {
  status: "queued" | "sent" | "failed";
  provider: "smtp";
  messageId?: string;
  error?: string;
};
