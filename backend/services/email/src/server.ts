import "dotenv/config";
import { createServer } from "node:http";
import { handleSendEmail } from "./routes/emailSend.js";
import { handleReceiveEmail } from "./routes/emailReceive.js";
import { handleReceiveOneEmail } from "./routes/emailReceiveOne.js";

const port = Number(process.env.PORT || 3000);

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "POST" && url.pathname === "/email/send") {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      const body = Buffer.concat(chunks).toString("utf-8");
      const response = await handleSendEmail(
        new Request(url.toString(), {
          method: "POST",
          headers: req.headers as Record<string, string>,
          body,
        }),
      );

      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      res.end(await response.text());
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/email/receive") {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      const body = Buffer.concat(chunks).toString("utf-8");
      const response = await handleReceiveEmail(
        new Request(url.toString(), {
          method: "POST",
          headers: req.headers as Record<string, string>,
          body,
        }),
      );

      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      res.end(await response.text());
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/email/receiveOne") {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      const body = Buffer.concat(chunks).toString("utf-8");
      const response = await handleReceiveOneEmail(
        new Request(url.toString(), {
          method: "POST",
          headers: req.headers as Record<string, string>,
          body,
        }),
      );

      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      res.end(await response.text());
    });
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(port, () => {
  console.log(`Email endpoint listening on http://localhost:${port}`);
});
