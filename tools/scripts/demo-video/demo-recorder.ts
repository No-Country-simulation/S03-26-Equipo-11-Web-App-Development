/**
 * Startup CRM - Demo Video Recorder
 * Uses Playwright to automate browser navigation and record a demo video.
 *
 * Pre-requisites:
 *   1. npm run dev  (server running on localhost:3000)
 *   2. WAHA + ngrok active (for WhatsApp functionality)
 *
 * Usage:
 *   npx tsx tools/scripts/demo-video/demo-recorder.ts
 *
 * Output:
 *   tools/scripts/demo-video/output/demo.webm
 */

import { chromium, type Page } from "playwright";
import { join } from "path";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// ─── Configuration ───────────────────────────────────────────────
const BASE_URL = "http://localhost:3000";
const VIEWPORT = { width: 1280, height: 720 };
const OUTPUT_DIR = join(__dirname, "output");
const OUTPUT_FILE = join(OUTPUT_DIR, "demo.webm");

// Demo credentials
const DEMO_EMAIL = "favian.medina.gemio@gmail.com";
const DEMO_PASSWORD = "1";

// Helper: slow typed pause for voice-over timing
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Helper: smooth scroll
async function smoothScroll(page: Page, pixels: number, steps = 20) {
  const step = pixels / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, step * 5);
    await pause(80);
  }
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  console.log("🎬 Startup CRM Demo Video Recorder");
  console.log("─────────────────────────────────");
  console.log(`📺 Resolution: ${VIEWPORT.width}x${VIEWPORT.height}`);
  console.log(`🌐 URL: ${BASE_URL}`);
  console.log(`📁 Output: ${OUTPUT_FILE}`);
  console.log("");

  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false, // visible browser for demo
    slowMo: 50, // subtle slowdown for natural feel
  });

  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: {
      dir: OUTPUT_DIR,
      size: VIEWPORT,
    },
    locale: "es-BO",
  });

  const page = await context.newPage();

  try {
    // ─── Segment 1: Landing Page (0:00 - 0:40) ─────────────────
    console.log("[0:00] 🏠 Landing Page");
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await pause(3000);

    // Scroll through landing page sections
    console.log("  → Scrolling hero section");
    await smoothScroll(page, 600);
    await pause(2000);

    console.log("  → Scrolling features");
    await smoothScroll(page, 800);
    await pause(2500);

    console.log("  → Scrolling products");
    await smoothScroll(page, 600);
    await pause(2000);

    console.log("  → Scrolling to footer");
    await smoothScroll(page, 600);
    await pause(2000);

    // ─── Segment 2: Register (0:40 - 1:10) ─────────────────────
    console.log("[0:40] 📝 Registro");
    const registerBtn = page.getByRole("link", { name: /registrarse|comenzar/i }).first();
    if (await registerBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await registerBtn.click();
    } else {
      await page.goto(`${BASE_URL}/register`);
    }
    await page.waitForURL("**/register", { timeout: 5000 }).catch(() => {});
    await pause(2000);

    // Show form fields
    console.log("  → Showing registration form");
    await pause(3000);

    // Navigate to login (skip actual registration to avoid duplicate)
    console.log("  → Going to Login");
    const loginLink = page.getByRole("link", { name: /iniciar|login/i }).first();
    if (await loginLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await loginLink.click();
    } else {
      await page.goto(`${BASE_URL}/login`);
    }
    await page.waitForURL("**/login", { timeout: 5000 }).catch(() => {});
    await pause(2000);

    // ─── Segment 3: Login (1:10 - 1:30) ────────────────────────
    console.log("[1:10] 🔐 Login");
    await pause(2000);

    // Fill login form
    const emailInput = page.getByRole("textbox", { name: /email|correo/i }).first();
    const passwordInput = page.getByLabel(/contraseña|password/i).first();

    if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await emailInput.click();
      await emailInput.fill(DEMO_EMAIL);
      await pause(1500);
    }

    if (await passwordInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await passwordInput.click();
      await passwordInput.fill(DEMO_PASSWORD);
      await pause(1500);
    }

    // Click login button
    const loginBtn = page.getByRole("button", { name: /iniciar|entrar|login/i }).first();
    if (await loginBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await loginBtn.click();
    }
    await pause(3000);

    // ─── Segment 4: Contacts (1:30 - 2:15) ─────────────────────
    console.log("[1:30] 👥 Contactos");
    await page.goto(`${BASE_URL}/contacts`, { waitUntil: "networkidle" });
    await pause(2000);

    // Show table
    console.log("  → Showing contacts table");
    await pause(2000);

    // Search for a contact
    const searchInput = page.getByPlaceholder(/buscar/i).first();
    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.click();
      await searchInput.fill("La Vaquer");
      await pause(2500);
      await searchInput.fill("");
      await pause(1000);
    }

    // Filter by stage
    const stageFilter = page.getByRole("combobox").first();
    if (await stageFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await stageFilter.click();
      await pause(500);
      const option = page.getByRole("option", { name: /calificado|qualified|contactado/i }).first();
      if (await option.isVisible({ timeout: 1000 }).catch(() => false)) {
        await option.click();
        await pause(2000);
      }
    }

    // Show new contact dialog briefly
    const newContactBtn = page.getByRole("button", { name: /nuevo contacto|\+ nuevo|agregar/i }).first();
    if (await newContactBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await newContactBtn.click();
      await pause(2000);
      // Close dialog
      await page.keyboard.press("Escape");
      await pause(500);
    }

    // ─── Segment 5: Email (2:15 - 2:40) ────────────────────────
    console.log("[2:15] 📧 Email");
    await page.goto(`${BASE_URL}/email`, { waitUntil: "networkidle" });
    await pause(2000);

    // Show compose
    const composeBtn = page.getByRole("button", { name: /nuevo|compose|redactar/i }).first();
    if (await composeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await composeBtn.click();
      await pause(2000);

      // Fill compose form (don't send)
      const toField = page.getByPlaceholder(/para:/i).first();
      if (await toField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await toField.fill("cliente@lavakeria.com");
        await pause(1500);
      }

      const subjectField = page.getByPlaceholder(/asunto/i).first();
      if (await subjectField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await subjectField.fill("Consulta sobre productos");
        await pause(1500);
      }

      const bodyField = page.getByPlaceholder(/mensaje/i).first();
      if (await bodyField.isVisible({ timeout: 2000 }).catch(() => false)) {
        await bodyField.fill("Hola, me gustaría conocer más sobre sus productos lácteos. ¿Tienen lista de precios actualizada?");
        await pause(3000);
      }

      // Close compose
      await page.keyboard.press("Escape");
      await pause(500);
    }

    // ─── Segment 6: WhatsApp (2:40 - 3:20) ─────────────────────
    console.log("[2:40] 💬 WhatsApp");
    await page.goto(`${BASE_URL}/whatsapp`, { waitUntil: "networkidle" });
    await pause(3000); // WhatsApp takes longer to load

    // Click on first contact
    const firstContact = page.locator("button").first();
    if (await firstContact.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstContact.click();
      await pause(2000);
    }

    // Type and send message
    const msgInput = page.getByPlaceholder(/mensaje|escribe/i).first();
    if (await msgInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await msgInput.click();
      await msgInput.fill("Hola! Somos Startup CRM. ¿Cómo podemos ayudarte? 🚀");
      await pause(2500);

      // Send button
      const sendBtn = page.getByRole("button", { name: /enviar|send/i }).first().or(page.locator("button[type='submit']").first());
      if (await sendBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await sendBtn.click();
      } else {
        await page.keyboard.press("Enter");
      }
      await pause(3000);
    }

    // ─── Segment 7: Dashboard (3:20 - 4:05) ────────────────────
    console.log("[3:20] 📊 Dashboard");
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle" });
    await pause(3000);

    // Highlight KPI cards
    console.log("  → Highlighting KPIs");
    await pause(2000);

    // Scroll through dashboard
    await smoothScroll(page, 400);
    await pause(2000);

    console.log("  → Showing charts");
    await smoothScroll(page, 400);
    await pause(2500);

    // ─── Segment 8: Closing (4:05 - 4:30) ──────────────────────
    console.log("[4:05] 🎯 Cierre");
    await smoothScroll(page, -400); // scroll back up
    await pause(3000);

    // Final pause for voice-over
    console.log("  → Final pause for voice-over");
    await pause(5000);

    console.log("");
    console.log("✅ Grabación completada!");
    console.log(`📁 Video guardado en: ${OUTPUT_FILE}`);
    console.log("");
    console.log("💡 Tip: Para convertir a MP4:");
    console.log(`   ffmpeg -i "${OUTPUT_FILE}" -c:v libx264 -crf 23 "demo.mp4"`);

  } catch (error) {
    console.error("❌ Error during recording:", error);
  } finally {
    await context.close();
    await browser.close();
  }
}

main();
