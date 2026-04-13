# 🎬 Startup CRM Demo Video Recorder

Script que automatiza la grabación de un video demo del CRM usando Playwright.

## Pre-requisitos

1. **Servidor dev corriendo**
   ```bash
   npm run dev
   ```

2. **WAHA + ngrok activos** (para funcionalidad de WhatsApp)

3. **Playwright + Chromium instalados**
   ```bash
   npm install -D @playwright/test
   npx playwright install chromium
   ```

## Ejecución

```bash
npx tsx tools/scripts/demo-video/demo-recorder.ts
```

## Output

- **Directorio**: `tools/scripts/demo-video/output/`
- **Formato**: `.webm` (WebM/VP8)
- **Resolución**: 1280x720 HD
- **Duración estimada**: ~4-5 minutos

## Conversión a MP4 (opcional)

```bash
# Requiere ffmpeg instalado
ffmpeg -i tools/scripts/demo-video/output/demo.webm \
  -c:v libx264 -crf 23 -preset medium \
  tools/scripts/demo-video/output/demo.mp4
```

## Personalización

Editar `demo-recorder.ts` para modificar:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `BASE_URL` | URL del servidor | `http://localhost:3000` |
| `DEMO_EMAIL` | Email de login | configurado |
| `DEMO_PASSWORD` | Password de login | configurado |
| `VIEWPORT` | Resolución | `1280x720` |
| `slowMo` | Velocidad de animación | `50ms` |

## Flujo del video

| Tiempo | Sección | Página |
|--------|---------|--------|
| 0:00-0:40 | Landing page | `/` |
| 0:40-1:10 | Registro | `/register` |
| 1:10-1:30 | Login | `/login` |
| 1:30-2:15 | Contactos | `/contacts` |
| 2:15-2:40 | Email | `/email` |
| 2:40-3:20 | WhatsApp | `/whatsapp` |
| 3:20-4:05 | Dashboard | `/dashboard` |
| 4:05-4:30 | Cierre | `/dashboard` |

## Troubleshooting

| Problema | Solución |
|----------|----------|
| "Cannot connect to localhost:3000" | Asegúrate de que `npm run dev` está corriendo |
| WhatsApp no carga | Verifica que WAHA + ngrok estén activos |
| Video muy rápido | Aumenta `slowMo` en el script |
| Elementos no encontrados | Verifica que los selectores CSS coincidan con la UI actual |
