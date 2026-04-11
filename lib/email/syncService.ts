import Imap from "imap";
import { simpleParser } from "mailparser";
import { client } from "@/lib/db";

function toFiniteNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const EMAIL_SYNC_BATCH_SIZE = Math.max(1, toFiniteNumber(process.env.EMAIL_SYNC_BATCH_SIZE, 5));

interface SyncResult {
  status: "ok" | "failed";
  processed: number;
  lastProcessedMessageId: string;
  lastProcessedUid: number;
  lastSyncAt: string;
  error?: string;
}

type MessageMetadata = {
  uid: number;
  messageId: string;
  rawMessageId: string;
  source: "imap-sync";
};

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

async function openBox(imap: Imap, mailbox: string): Promise<void> {
  return new Promise((resolve, reject) => {
    imap.openBox(mailbox, true, (err) => (err ? reject(err) : resolve()));
  });
}

function getEmailFromAddress(email: string): string {
  const match = email.match(/<([^>]+)>/);
  return match ? match[1] : email;
}

function getNameFromEmail(email: string): string {
  const match = email.match(/^([^<]+)/);
  let name = match ? match[1].trim() : email;
  name = name.replace(/["']/g, "");
  return name || email.split("@")[0];
}

function buildMessageMetadata(uid: number, messageId: string): MessageMetadata {
  return {
    uid,
    messageId,
    rawMessageId: messageId,
    source: "imap-sync",
  };
}

function parseEmail(imap: Imap, uid: number): Promise<{
  uid: number;
  from: string;
  subject: string;
  text: string;
  date: string;
  messageId: string;
  seen: boolean;
} | null> {
  return new Promise((resolve) => {
    const fetcher = imap.fetch(uid, { bodies: "" });
    let parsedPromise: Promise<Awaited<ReturnType<typeof simpleParser>>> | null = null;
    let flags: string[] = [];

    fetcher.on("message", (msg) => {
      msg.once("attributes", (attrs) => {
        flags = attrs.flags || [];
      });
      msg.on("body", (stream) => {
        parsedPromise = simpleParser(stream as never);
      });
      msg.once("end", async () => {
        try {
          const parsed = parsedPromise ? await parsedPromise : null;
          if (parsed) {
            resolve({
              uid,
              from: getAddressText(parsed.from),
              subject: parsed.subject || "",
              text: parsed.text || "",
              date: parsed.date?.toISOString() || new Date().toISOString(),
              messageId: (parsed.messageId || "").replace(/^<|>$/g, ""),
              seen: flags.includes("\\Seen"),
            });
          } else {
            resolve(null);
          }
        } catch {
          resolve(null);
        }
      });
    });
    fetcher.once("error", () => resolve(null));
    fetcher.once("end", () => {
      if (!parsedPromise) resolve(null);
    });
  });
}

async function ensureEmailSyncControlTable(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS email_sync_control (
      id INTEGER PRIMARY KEY DEFAULT 1,
      last_processed_uid INTEGER NOT NULL DEFAULT 0,
      last_sync_at TEXT
    )
  `);

  const columnsResult = await client.execute("PRAGMA table_info(email_sync_control)");
  const columnNames = new Set(
    (columnsResult.rows || []).map((row) => String((row as Record<string, unknown>).name || ""))
  );

  if (!columnNames.has("last_processed_uid")) {
    await client.execute(
      "ALTER TABLE email_sync_control ADD COLUMN last_processed_uid INTEGER NOT NULL DEFAULT 0"
    );
  }

  if (!columnNames.has("last_sync_at")) {
    await client.execute(
      "ALTER TABLE email_sync_control ADD COLUMN last_sync_at TEXT"
    );
  }

  await client.execute(`
    INSERT OR IGNORE INTO email_sync_control (id, last_processed_uid, last_sync_at)
    VALUES (1, 0, NULL)
  `);
}

async function ensureMessagesSyncColumns(): Promise<void> {
  const columnsResult = await client.execute("PRAGMA table_info(messages)");
  const columnNames = new Set(
    (columnsResult.rows || []).map((row) => String((row as Record<string, unknown>).name || ""))
  );

  if (!columnNames.has("message_id")) {
    await client.execute(
      "ALTER TABLE messages ADD COLUMN message_id TEXT"
    );
  }
}

export async function syncNewEmails(): Promise<SyncResult> {
  try {
    console.log("[syncService] Reading sync control from DB...");

    await ensureEmailSyncControlTable();
    await ensureMessagesSyncColumns();

    const syncResult = await client.execute(
      "SELECT last_processed_uid FROM email_sync_control WHERE id = 1"
    );

    let lastProcessedUid = 0;
    const lastProcessedMessageId = "";
    if (syncResult.rows && syncResult.rows.length > 0) {
      const row = syncResult.rows[0] as unknown as { last_processed_uid?: number | string };
      lastProcessedUid = toFiniteNumber(row.last_processed_uid, 0);
    }

    console.log("[syncService] lastProcessedUid:", lastProcessedUid);

    const imapConfig = {
        user: process.env.IMAP_USER!,
        password: process.env.IMAP_PASS!,
        host: process.env.IMAP_HOST!,
        port: toFiniteNumber(process.env.IMAP_PORT, 993),
        tls: String(process.env.IMAP_TLS || "true") === "true",
        tlsOptions: { rejectUnauthorized: false } as never,
      };

    const imap = new Imap(imapConfig);

    return new Promise((resolve) => {
      imap.once("ready", async () => {
        try {
          await openBox(imap, "INBOX");

          const allIds = await new Promise<number[]>((res, rej) => {
            imap.search(["ALL"], (err, results) => 
              err ? rej(err) : res((results as number[]).map((uid) => toFiniteNumber(uid, 0)).filter((uid) => uid > 0))
            );
          });

          const reversedIds = allIds.slice().reverse();
          const newIds = reversedIds
            .filter((uid) => uid > lastProcessedUid)
            .slice(0, EMAIL_SYNC_BATCH_SIZE);

          console.log(`[syncService] Total emails: ${allIds.length}, checking first ${newIds.length}`);

          let processed = 0;
          let processingErrors = 0;
          let lastErrorMessage = "";
          let latestProcessedUid = lastProcessedUid;
          let lastMessageId = lastProcessedMessageId;

          for (const uid of newIds) {
            try {
              const emailData = await parseEmail(imap, uid);
              if (!emailData || !emailData.from) continue;

              const effectiveMessageId = emailData.messageId || `imap-uid:${emailData.uid}`;
              const metadataJson = JSON.stringify(buildMessageMetadata(emailData.uid, effectiveMessageId));

              const fromEmail = getEmailFromAddress(emailData.from).toLowerCase();
              const fromName = getNameFromEmail(emailData.from);

              const contactResult = await client.execute(
                "SELECT id FROM contacts WHERE email = ?",
                [fromEmail]
              );

              let contactId: string;

              if (contactResult.rows && contactResult.rows.length > 0) {
                contactId = (contactResult.rows[0] as unknown as { id: string }).id;
              } else {
                const newContactId = crypto.randomUUID();
                await client.execute(
                  "INSERT INTO contacts (id, name, email, stage, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
                  [newContactId, fromName, fromEmail, "new", new Date().toISOString(), new Date().toISOString()]
                );
                contactId = newContactId;
              }

              const msgResult = await client.execute(
                `SELECT id
                 FROM messages
                 WHERE canal = 'email'
                   AND (
                     message_id = ?
                     OR json_extract(metadata, '$.messageId') = ?
                     OR json_extract(metadata, '$.rawMessageId') = ?
                     OR json_extract(metadata, '$.uid') = ?
                   )
                 LIMIT 1`,
                [effectiveMessageId, effectiveMessageId, effectiveMessageId, String(emailData.uid)]
              );

              if (!msgResult.rows || msgResult.rows.length === 0) {
                const newMsgId = crypto.randomUUID();
                await client.execute(
                  "INSERT INTO messages (id, contact_id, canal, direccion, contenido, asunto, fecha, leido, entregado, message_id, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                  [
                    newMsgId,
                    contactId,
                    "email",
                    "entrante",
                    emailData.text.slice(0, 5000),
                    emailData.subject,
                    emailData.date,
                    emailData.seen ? 1 : 0,
                    1,
                    effectiveMessageId,
                    metadataJson,
                    new Date().toISOString()
                  ]
                );

                console.log(`[syncService] Inserted: ${emailData.subject}`);
                processed++;
              }

              if (emailData.uid > latestProcessedUid) {
                latestProcessedUid = emailData.uid;
              }
              lastMessageId = effectiveMessageId;
            } catch (err) {
              console.error(`[syncService] Error processing UID ${uid}:`, err);
              processingErrors++;
              lastErrorMessage = err instanceof Error ? err.message : String(err);
            }
          }

          latestProcessedUid = toFiniteNumber(latestProcessedUid, lastProcessedUid);

          await client.execute(
            "UPDATE email_sync_control SET last_processed_uid = ?, last_sync_at = ? WHERE id = 1",
            [latestProcessedUid, new Date().toISOString()]
          );

          if (processed === 0 && newIds.length > 0 && processingErrors > 0) {
            imap.end();
            resolve({
              status: "failed",
              processed: 0,
              lastProcessedMessageId: lastMessageId,
              lastProcessedUid: latestProcessedUid,
              lastSyncAt: new Date().toISOString(),
              error: lastErrorMessage || "All candidate emails failed during processing",
            });
            return;
          }

          imap.end();
          resolve({
            status: "ok",
            processed,
            lastProcessedMessageId: lastMessageId,
            lastProcessedUid: latestProcessedUid,
            lastSyncAt: new Date().toISOString(),
          });
        } catch (err) {
          imap.end();
          const errorMsg = err instanceof Error ? err.message : "Unknown error";
          resolve({
            status: "failed",
            processed: 0,
            lastProcessedMessageId: lastProcessedMessageId,
            lastProcessedUid,
            lastSyncAt: new Date().toISOString(),
            error: errorMsg,
          });
        }
      });

      imap.once("error", (err) => {
        resolve({
          status: "failed",
          processed: 0,
          lastProcessedMessageId: lastProcessedMessageId,
          lastProcessedUid,
          lastSyncAt: new Date().toISOString(),
          error: err.message,
        });
      });

      imap.connect();
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return {
      status: "failed",
      processed: 0,
      lastProcessedMessageId: "",
      lastProcessedUid: 0,
      lastSyncAt: new Date().toISOString(),
      error: errorMsg,
    };
  }
}
