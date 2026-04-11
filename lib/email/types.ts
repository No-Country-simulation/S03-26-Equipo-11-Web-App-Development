export type SendEmailPayload = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  contactId?: string;
  templateId?: string;
  metadata?: Record<string, string>;
};

export type SendEmailResult = {
  status: "queued" | "sent" | "failed";
  provider: "smtp";
  messageId?: string;
  error?: string;
};

export type ReceiveOptions = {
  limit: number;
  offset?: number;
  unreadOnly: boolean;
  mailbox: string;
};

export type ReceivedEmail = {
  from: string;
  to: string;
  subject: string;
  date?: string;
  messageId?: string;
  seen: boolean;
};

export type ReceivedEmailDetail = {
  from: string;
  to: string;
  subject: string;
  date?: string;
  text?: string;
  html?: string;
  seen: boolean;
};

export type ReceiveResult = {
  status: "ok" | "failed";
  count: number;
  emails: ReceivedEmail[];
  error?: string;
};

export type ReceiveOneResult = {
  status: "ok" | "failed";
  email: ReceivedEmailDetail[];
  error?: string;
};