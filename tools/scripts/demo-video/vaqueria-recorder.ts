/**
 * La Vaquería - Demo Video Recorder
 * Graba un video del sitio de La Vaquería mostrando el flujo de contacto
 * (Email + WhatsApp) integrado con el CRM.
 *
 * Pre-requisitos:
 *   1. Sitio de La Vaquería accesible en https://vaqueria.vercel.app/
 *   2. (Opcional) CRM corriendo en localhost:3000 para mostrar integración
 *
 * Usage:
 *   npx tsx tools/scripts/demo-video/vaqueria-recorder.ts
 *
 * Output:
 *   tools/scripts/demo-video/output/vaqueria-demo.webm
 */

import { chromium, type Page } from "playwright";
import { join } from "path";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// ─── Configuration ───────────────────────────────────────────────
const VAQUERIA_URL = "https://vaqueria.vercel.app/";
const CRM_URL = "http://localhost:3000";
const VIEWPORT = { width: 1280, height: 720 };
const OUTPUT_DIR = join(__dirname, "output");
const OUTPUT_FILE = join(OUTPUT_DIR, "vaqueria-demo.webm");

// Demo email data
const DEMO_EMAIL = "cliente@ejemplo.com";
const DEMO_SUBJECT = "Consulta sobre quesos";
const DEMO_MESSAGE = "¿Tienen queso sin lactosa?";

// Helper: pause
const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Helper: smooth scroll
async function smoothScroll(page: Page, pixels: number, steps = 20) {
  const step = pixels / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, step * 5);
    await pause(80);
  }
}

// Helper: scroll to element
async function scrollToElement(page: Page, selector: string) {
  const el = page.locator(selector).first();
  if (await el.isVisible({ timeout: 5000 }).catch(() => false)) {
    await el.scrollIntoViewIfNeeded();
    await pause(1000);
  }
}

// ─── Main ────────────────────────────────────────────────────────
async function main() {
  console.log("🎬 La Vaquería Demo Video Recorder");
  console.log("──────────────────────────────────");
  console.log(`📺 Resolution: ${VIEWPORT.width}x${VIEWPORT.height}`);
  console.log(`🌐 URL: ${VAQUERIA_URL}`);
  console.log(`📁 Output: ${OUTPUT_FILE}`);
  console.log("");

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    slowMo: 50,
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
    // ─── Escena 1: Llegada a Contacto (0:00 - 0:03) ───────────
    console.log("[0:00] 🏠 Landing Page - Scroll a Contacto");
    await page.goto(VAQUERIA_URL, { waitUntil: "networkidle", timeout: 15000 });
    await pause(2000);

    // Scroll down to contact section
    console.log("  → Scrolling to contact section");
    // Try to find contact/contacto section
    const contactSelectors = [
      "section#contacto", "section#contact", "section:has-text('Contacto')",
      "section:has-text('contact')", "[id*='contact']",
      "footer", "section:last-of-type"
    ];

    let foundContact = false;
    for (const sel of contactSelectors) {
      try {
        const el = page.locator(sel).first();
        if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
          await el.scrollIntoViewIfNeeded();
          foundContact = true;
          break;
        }
      } catch { /* try next */ }
    }

    if (!foundContact) {
      // Fallback: scroll down manually
      await smoothScroll(page, 2000, 30);
    }
    await pause(2000);

    // ─── Escena 2: Formulario Email (0:03 - 0:08) ─────────────
    console.log("[0:03] 📧 Formulario Email");
    await pause(1000);

    // Find email input fields
    const emailSelectors = [
      'input[type="email"]', 'input[name="email"]', 'input[placeholder*="email" i]',
      'input[placeholder*="correo" i]', 'input[placeholder*="Email" i]'
    ];
    const emailInput = page.locator(emailSelectors.join(", ")).first();

    if (await emailInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log("  → Found email input");
      await emailInput.click();
      await pause(1000);
      await emailInput.fill(DEMO_EMAIL);
      await pause(1500);
    } else {
      console.log("  ⚠️ Email input not found, scrolling further");
      await smoothScroll(page, 500, 10);
      await pause(1000);
    }

    // Find subject input
    const subjectSelectors = [
      'input[name="subject"]', 'input[name="asunto"]',
      'input[placeholder*="asunto" i]', 'input[placeholder*="Asunto" i]',
      'input[placeholder*="subject" i]'
    ];
    const subjectInput = page.locator(subjectSelectors.join(", ")).first();

    if (await subjectInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log("  → Found subject input");
      await subjectInput.click();
      await pause(500);
      await subjectInput.fill(DEMO_SUBJECT);
      await pause(1500);
    }

    // Find message textarea
    const messageSelectors = [
      'textarea[name="message"]', 'textarea[name="mensaje"]',
      'textarea[placeholder*="mensaje" i]', 'textarea[placeholder*="Message" i]',
      'textarea[placeholder*="mensaje" i]', 'textarea'
    ];
    const messageInput = page.locator(messageSelectors.join(", ")).first();

    if (await messageInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log("  → Found message textarea");
      await messageInput.click();
      await pause(500);
      await messageInput.fill(DEMO_MESSAGE);
      await pause(2000);
    }

    // Find and click send button (don't actually submit if it would fail)
    const sendSelectors = [
      'button[type="submit"]', 'button:has-text("Enviar")', 'button:has-text("Send")',
      'input[type="submit"]'
    ];
    const sendBtn = page.locator(sendSelectors.join(", ")).first();

    if (await sendBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log("  → Found send button");
      await pause(1000);
      // Hover to highlight
      await sendBtn.hover();
      await pause(1000);
      // Don't actually click to avoid form submission errors
      console.log("  → Hovered (not submitting to avoid errors)");
    }

    await pause(2000);

    // ─── Escena 3: CRM Integration Visual (0:08 - 0:12) ───────
    console.log("[0:08] 🔄 Flujo CRM (visual)");
    await pause(2000);

    // Scroll to show any integration/CRM mention
    await smoothScroll(page, 300, 10);
    await pause(1000);

    // ─── Escena 4: WhatsApp (0:12 - 0:16) ─────────────────────
    console.log("[0:12] 📱 WhatsApp");
    await pause(1000);

    // Find WhatsApp button/link
    const whatsappSelectors = [
      'a[href*="wa.me"]', 'a[href*="whatsapp"]', 'a[href*="api.whatsapp"]',
      'button:has-text("WhatsApp")', 'a:has-text("WhatsApp")',
      'a:has-text("whatsapp" i)', 'img[alt*="WhatsApp" i]',
      '[class*="whatsapp"]', '[class*="WhatsApp"]'
    ];

    let whatsappFound = false;
    for (const sel of whatsappSelectors) {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1500 }).catch(() => false)) {
        console.log(`  → Found WhatsApp: ${sel}`);
        await el.scrollIntoViewIfNeeded();
        await pause(1000);
        await el.hover();
        await pause(2000);
        whatsappFound = true;
        break;
      }
    }

    if (!whatsappFound) {
      console.log("  ⚠️ WhatsApp element not found");
    }

    await pause(1000);

    // ─── Escena 5: CRM + WhatsApp Flow (0:16 - 0:20) ──────────
    console.log("[0:16] 💬 CRM + WhatsApp Flow");
    await pause(1500);

    // If WhatsApp link exists, show it opens wa.me
    if (whatsappFound) {
      const waLink = page.locator('a[href*="wa.me"], a[href*="whatsapp"]').first();
      if (await waLink.isVisible({ timeout: 1000 }).catch(() => false)) {
        const href = await waLink.getAttribute("href");
        console.log(`  → WhatsApp link: ${href}`);
        await pause(2000);
      }
    }

    await pause(1000);

    // ─── Escena 6: Cierre (0:20 - 0:23) ───────────────────────
    console.log("[0:20] 🎯 Cierre");
    // Scroll back to top for final view
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    await pause(2000);

    // Show full page overview
    await smoothScroll(page, 600, 15);
    await pause(2000);

    // Final pause for text overlay
    console.log("  → Final pause for text overlay");
    await pause(3000);

    console.log("");
    console.log("✅ Grabación completada!");
    console.log(`📁 Video guardado en: ${OUTPUT_FILE}`);
    console.log("");
    console.log("💡 Para convertir a MP4:");
    console.log(`   ffmpeg -i "${OUTPUT_FILE}" -c:v libx264 -crf 23 "vaqueria-demo.mp4"`);

  } catch (error) {
    console.error("❌ Error during recording:", error);
  } finally {
    await context.close();
    await browser.close();
  }
}

main();
