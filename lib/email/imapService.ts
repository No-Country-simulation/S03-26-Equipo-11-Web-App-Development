import Imap from "imap";
import { simpleParser } from "mailparser";
import { ReceiveOptions, ReceivedEmail, ReceivedEmailDetail, ReceiveResult, ReceiveOneResult } from "./types";

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

function getAddressText(address: unknown): string {
  if (!address) return "";
  if (typeof address === "string") return address;
  const addr = address as { text?: string; value?: Array<{ address?: string }> };
  if (addr.text) return addr.text;
  if (addr.value && Array.isArray(addr.value)) {
    return addr.value.map((a) => a.address).filter(Boolean).join(", ");
  }
  return "";
}

function openBox(imap: Imap, mailbox: string): Promise<void> {
  return new Promise((resolve, reject) => {
    imap.openBox(mailbox, true, (err) => (err ? reject(err) : resolve()));
  });
}

function search(imap: Imap, criteria: string[]): Promise<number[]> {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    imap.search(criteria as any, (err, results) => (err ? reject(err) : resolve(results)));
  });
}

function sortEmailsByDateDesc<T extends { date?: string }>(emails: T[]): T[] {
  return emails.sort((a, b) => {
    const aTime = a.date ? new Date(a.date).getTime() : 0;
    const bTime = b.date ? new Date(b.date).getTime() : 0;
    return bTime - aTime;
  });
}

export async function receiveEmails(options: ReceiveOptions): Promise<ReceiveResult> {
  try {
    assertConfig();
    const imap = new Imap({
      user: imapUser!,
      password: imapPass!,
      host: imapHost!,
      port: imapPort,
      tls: imapTls,
      tlsOptions: { rejectUnauthorized: false },
    });
    const emails: ReceivedEmail[] = [];
    const result = await new Promise<ReceiveResult>((resolve, reject) => {
      imap.once("ready", async () => {
        try {
          await openBox(imap, options.mailbox);
          const criteria = options.unreadOnly ? ["UNSEEN"] : ["ALL"];
          const all = await search(imap, criteria);
          // Los IDs vienen en orden ascendente (más antiguos primero)
          // Invertimos para tener los más recientes primero
          const reversed = all.slice().reverse();
          const offset = options.offset || 0;
          const ids = reversed.slice(offset, offset + options.limit);
          if (ids.length === 0) {
            imap.end();
            resolve({ status: "ok", count: 0, emails: [] });
            return;
          }
          const fetcher = imap.fetch(ids, { bodies: "" });
          const messageTasks: Array<Promise<void>> = [];
          fetcher.on("message", (msg) => {
            const messageTask = new Promise<void>((resolveMessage, rejectMessage) => {
              let flags: string[] = [];
              let parsedBodyPromise: Promise<Awaited<ReturnType<typeof simpleParser>>> | null = null;

              msg.once("attributes", (attrs) => {
                flags = attrs.flags || [];
              });

              msg.on("body", (stream) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                parsedBodyPromise = simpleParser(stream as any);
              });

              msg.once("end", async () => {
                try {
                  const parsed = parsedBodyPromise ? await parsedBodyPromise : null;
                  if (parsed) {
                    emails.push({
                      from: getAddressText(parsed.from),
                      to: getAddressText(parsed.to),
                      subject: parsed.subject || "",
                      date: parsed.date?.toISOString(),
                      messageId: parsed.messageId || undefined,
                      seen: flags.includes("\\Seen"),
                    });
                  }
                  resolveMessage();
                } catch (error) {
                  rejectMessage(error);
                }
              });
            });

            messageTasks.push(messageTask);
          });
          fetcher.once("end", async () => {
            try {
              await Promise.all(messageTasks);
              imap.end();
              resolve({ status: "ok", count: emails.length, emails: sortEmailsByDateDesc(emails) });
            } catch (error) {
              imap.end();
              reject(error);
            }
          });
        } catch (err) { imap.end(); reject(err); }
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

export async function receiveEmailById(messageId: string, mailbox: string = "INBOX"): Promise<ReceiveOneResult> {
  try {
    assertConfig();
    const cleanMessageId = messageId.replace(/^<|>$/g, "");
    const imap = new Imap({
      user: imapUser!,
      password: imapPass!,
      host: imapHost!,
      port: imapPort,
      tls: imapTls,
      tlsOptions: { rejectUnauthorized: false },
    });
    const result = await new Promise<ReceiveOneResult>((resolve, reject) => {
      imap.once("ready", async () => {
        try {
          await openBox(imap, mailbox);
          const ids = await search(imap, ["ALL"]);
          const limitedIds = ids.slice(-50);
          if (limitedIds.length === 0) { imap.end(); resolve({ status: "failed", email: [], error: "Not found" }); return; }
          let foundEmail: ReceivedEmailDetail | null = null;
          const fetcher = imap.fetch(limitedIds, { bodies: "" });
          const messageTasks: Array<Promise<void>> = [];
          fetcher.on("message", (msg) => {
            const messageTask = new Promise<void>((resolveMessage, rejectMessage) => {
              let flags: string[] = [];
              let parsedBodyPromise: Promise<Awaited<ReturnType<typeof simpleParser>>> | null = null;

              msg.once("attributes", (attrs) => {
                flags = attrs.flags || [];
              });

              msg.on("body", (stream) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                parsedBodyPromise = simpleParser(stream as any);
              });

              msg.once("end", async () => {
                try {
                  const parsed = parsedBodyPromise ? await parsedBodyPromise : null;
                  if (parsed) {
                    const emailMessageId = (parsed.messageId || "").replace(/^<|>$/g, "");
                    if (emailMessageId === cleanMessageId || parsed.messageId === messageId) {
                      foundEmail = {
                        from: getAddressText(parsed.from),
                        to: getAddressText(parsed.to),
                        subject: parsed.subject || "",
                        date: parsed.date?.toISOString(),
                        text: parsed.text || undefined,
                        html: parsed.html || undefined,
                        seen: flags.includes("\\Seen"),
                      };
                    }
                  }
                  resolveMessage();
                } catch (error) {
                  rejectMessage(error);
                }
              });
            });

            messageTasks.push(messageTask);
          });
          fetcher.once("end", async () => {
            try {
              await Promise.all(messageTasks);
              imap.end();
              resolve(foundEmail ? { status: "ok", email: [foundEmail] } : { status: "failed", email: [], error: "Not found" });
            } catch (error) {
              imap.end();
              reject(error);
            }
          });
        } catch (err) { imap.end(); reject(err); }
      });
      imap.once("error", (err) => reject(err));
      imap.connect();
    });
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { status: "failed", email: [], error: message };
  }
}
