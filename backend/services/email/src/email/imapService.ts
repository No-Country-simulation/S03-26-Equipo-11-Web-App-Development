import Imap from "node-imap";
import { simpleParser } from "mailparser";

export type ReceiveOptions = {
  limit: number;
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

export type ReceiveResult = {
  status: "ok" | "failed";
  count: number;
  emails: ReceivedEmail[];
  error?: string;
};

const imapHost = process.env.IMAP_HOST;
const imapPort = Number(process.env.IMAP_PORT || 993);
const imapTls = String(process.env.IMAP_TLS || "true") === "true";
const imapUser = process.env.IMAP_USER;
const imapPass = process.env.IMAP_PASS;

function assertConfig(): void {
  const missing: string[] = [];
  if (!imapHost) missing.push("IMAP_HOST");
  if (!imapUser) missing.push("IMAP_USER");
  if (!imapPass) missing.push("IMAP_PASS");
  if (missing.length > 0) {
    throw new Error(`Missing IMAP config: ${missing.join(", ")}`);
  }
}

function openBox(imap: Imap, mailbox: string): Promise<void> {
  return new Promise((resolve, reject) => {
    imap.openBox(mailbox, true, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function search(imap: Imap, criteria: any[]): Promise<number[]> {
  return new Promise((resolve, reject) => {
    imap.search(criteria, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

export async function receiveEmails(
  options: ReceiveOptions,
): Promise<ReceiveResult> {
  try {
    assertConfig();

    const imap = new Imap({
      user: imapUser!,
      password: imapPass!,
      host: imapHost!,
      port: imapPort,
      tls: imapTls,
    });

    const emails: ReceivedEmail[] = [];

    const result = await new Promise<ReceiveResult>((resolve, reject) => {
      imap.once("ready", async () => {
        try {
          await openBox(imap, options.mailbox);

          const criteria = options.unreadOnly ? ["UNSEEN"] : ["ALL"];
          const all = await search(imap, criteria);
          const ids = all.slice(-options.limit);

          if (ids.length === 0) {
            imap.end();
            resolve({ status: "ok", count: 0, emails: [] });
            return;
          }

          const fetcher = imap.fetch(ids, { bodies: "" });

          fetcher.on("message", (msg) => {
            let flags: string[] = [];

            msg.on("attributes", (attrs) => {
              flags = attrs.flags || [];
            });

            msg.on("body", async (stream) => {
              const parsed = await simpleParser(stream);

              emails.push({
                from: parsed.from?.text || "",
                to: parsed.to?.text || "",
                subject: parsed.subject || "",
                date: parsed.date?.toISOString(),
                messageId: parsed.messageId || undefined,
                seen: flags.includes("\\Seen"),
              });
            });
          });

          fetcher.once("error", (err) => {
            imap.end();
            reject(err);
          });

          fetcher.once("end", () => {
            imap.end();
            resolve({ status: "ok", count: emails.length, emails });
          });
        } catch (err) {
          imap.end();
          reject(err);
        }
      });

      imap.once("error", (err) => reject(err));
      imap.connect();
    });

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: "failed", count: 0, emails: [], error: message };
  }
}
