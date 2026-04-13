# 🎬 Guía Playwright - Grabación de Videos Demo

Guía rápida para generar videos demo de aplicaciones web usando Playwright.

---

## 1. Instalación

```bash
# Instalar Playwright como dev dependency
npm install -D @playwright/test

# Instalar Chromium (navegador para grabar)
npx playwright install chromium
```

> ⚠️ No necesitas crear `playwright.config.ts` si usas scripts directos con `tsx`.

---

## 2. Estructura de Archivos

```
tools/scripts/demo-video/
├── demo-recorder.ts         # Script CRM (aplicación principal)
├── vaqueria-recorder.ts     # Script La Vaquería (sitio externo)
├── output/                  # Videos generados (.webm)
│   ├── demo.webm
│   └── vaqueria-demo.webm
└── README.md                # Instrucciones por script
```

---

## 3. Crear un Nuevo Script de Grabación

### Template Base

```typescript
// tools/scripts/demo-video/mi-recorder.ts
import { chromium, type Page } from "playwright";
import { join } from "path";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

const BASE_URL = "http://localhost:3000";  // o URL externa
const VIEWPORT = { width: 1280, height: 720 };
const OUTPUT_DIR = join(__dirname, "output");
const OUTPUT_FILE = join(OUTPUT_DIR, "mi-video.webm");

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function smoothScroll(page: Page, pixels: number, steps = 20) {
  const step = pixels / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, step * 5);
    await pause(80);
  }
}

async function main() {
  console.log("🎬 Mi Demo Video Recorder");

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false,   // visible para ver lo que hace
    slowMo: 50,        // ralentiza acciones (natural feel)
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
    // ─── TU GUIÓN AQUÍ ─────────────────────────────────
    console.log("[0:00] 🏠 Mi primera escena");
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await pause(3000);

    // Ejemplo: hacer clic en un botón
    const btn = page.getByRole("button", { name: /click/i }).first();
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click();
    }
    await pause(2000);

    console.log("✅ Grabación completada!");
    console.log(`📁 Video: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await context.close();
    await browser.close();
  }
}

main();
```

### Locadores Comunes (de más a menos recomendado)

| Método | Uso | Ejemplo |
|--------|-----|---------|
| `getByRole` | Botones, links, inputs | `page.getByRole("button", { name: /enviar/i })` |
| `getByLabel` | Inputs con label | `page.getByLabel(/contraseña/i)` |
| `getByPlaceholder` | Inputs con placeholder | `page.getByPlaceholder(/buscar/i)` |
| `getByText` | Texto visible | `page.getByText("Contactos")` |
| `locator()` | Selector CSS | `page.locator("input[type='email']")` |

> ⚠️ **NO mezclar** CSS con `text=` en un solo locator como `'a, text=Click'`. Eso da error.

---

## 4. Cómo Darle un Guión

El guión define qué acciones hacer y cuándo. Estructura recomendada:

```
Escena 1: [0:00 - 0:30] Landing Page
  → Scroll suave por secciones
  → Pausa de 3s entre secciones

Escena 2: [0:30 - 1:00] Login
  → Ir a /login
  → Llenar email y password
  → Click en botón "Iniciar sesión"

Escena 3: [1:00 - 2:00] Feature principal
  → Navegar a la página
  → Mostrar funcionalidad
  → Resaltar elementos clave
```

Cada escena en código:

```typescript
// Escena 1: Landing Page
console.log("[0:00] 🏠 Landing Page");
await page.goto(BASE_URL, { waitUntil: "networkidle" });
await pause(3000);

// Scroll suave
await smoothScroll(page, 600);
await pause(2000);

// Escena 2: Login
console.log("[0:30] 🔐 Login");
await page.goto(`${BASE_URL}/login`);
await pause(2000);

// Llenar formulario
const email = page.getByPlaceholder(/email/i);
await email.fill("demo@email.com");
await pause(1500);

const btn = page.getByRole("button", { name: /iniciar/i });
await btn.click();
await pause(3000);
```

---

## 5. Ejecutar la Grabación

### Pre-requisitos

```bash
# 1. Servidor corriendo
npm run dev

# 2. Si necesitas datos externos (WAHA, APIs)
# Asegúrate de que estén activos
```

### Comando

```bash
npx tsx tools/scripts/demo-video/mi-recorder.ts
```

El navegador se abre y ejecuta el script automáticamente. El video se guarda en `output/`.

---

## 6. Convertir a MP4 (Opcional)

Playwright genera `.webm`. Para `.mp4` (más compatible):

```bash
# Requiere ffmpeg instalado
ffmpeg -i tools/scripts/demo-video/output/mi-video.webm \
  -c:v libx264 -crf 23 -preset medium \
  tools/scripts/demo-video/output/mi-video.mp4
```

---

## 7. Tips y Buenas Prácticas

| Tip | Detalle |
|-----|---------|
| **Pausas** | Usa `pause(2000-4000)` entre acciones para voice-over |
| **slowMo** | `50-100ms` hace las acciones más naturales |
| **headless: false** | Siempre visible para debugging |
| **isVisible().catch()** | Nunca asumas que un elemento existe |
| **`waitForURL`** | Úsalo tras clicks de navegación |
| **`networkidle`** | Espera a que carguen APIs antes de actuar |
| **Selectores resilientes** | `getByRole` > `getByPlaceholder` > `locator` |

---

## 8. Troubleshooting

| Problema | Solución |
|----------|----------|
| `__dirname is not defined` | Usa `fileURLToPath(import.meta.url)` |
| `Unexpected token "=" CSS` | No mezcles `text=` con CSS en un locator |
| `element not visible` | Usa `scrollIntoViewIfNeeded()` antes |
| `timeout exceeded` | Aumenta timeout o verifica que el servidor corre |
| Video sale vacío | Verifica que `npm run dev` esté activo |
| Chromium no abre | Ejuta `npx playwright install chromium` |
| Video muy rápido | Sube `slowMo` a 100-200ms |
| Elementos no encontrados | Usa DevTools para verificar selectores |

---

## 9. Scripts Existentes

| Archivo | Qué graba | Duración |
|---------|-----------|----------|
| `demo-recorder.ts` | CRM completo (landing → dashboard) | ~5 min |
| `vaqueria-recorder.ts` | Sitio La Vaquería (contacto) | ~23 seg |

### Ejecutar

```bash
# CRM completo
npx tsx tools/scripts/demo-video/demo-recorder.ts

# La Vaquería
npx tsx tools/scripts/demo-video/vaqueria-recorder.ts
```
