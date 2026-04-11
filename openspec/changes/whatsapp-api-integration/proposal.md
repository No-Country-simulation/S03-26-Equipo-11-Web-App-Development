# Proposal: WhatsApp API Integration

## Why

El CRM actualmente tiene integración con email (envío/recepción) pero no con WhatsApp. Necesitamos permitir que los usuarios:
1. Ver listados de contactos con quienes han conversado por WhatsApp
2. Ver el historial de mensajes de cada contacto
3. Enviar mensajes de WhatsApp desde el CRM

La integración usará WPPConnect (servidor self-hosted) desplegado en Render (Free tier + ping para mantener activo).

## What Changes

- **Nuevo endpoint GET /api/whatsapp**: Listado de contactos con resumen de último mensaje (máx 10 caracteres)
- **Nuevo endpoint GET /api/whatsapp/[contactId]**: Listado de mensajes de un contacto específico
- **Nuevo endpoint POST /api/whatsapp/send**: Enviar mensaje de texto a contacto
- **Nuevo endpoint POST /api/whatsapp/sync**: Sincronizar mensajes entrantes (como "El Cartero")
- **Actualizar lib/whatsapp/whatsappService.ts**: Implementación real con WPPConnect
- **Nueva página frontend app/(crm)/whatsapp/page.tsx**: UI para gestionar mensajes WhatsApp

## Autenticación

Todos los endpoints requieren autenticación mediante Better Auth:
- Se valida header `x-user-id` en cada request
- Si no hay sesión, retorna 401 Unauthorized
- Patrón idéntico a endpoints existentes (email, contacts)

## Capabilities

### New Capabilities
- `whatsapp-contacts-list`: Listar contactos con conversaciones WhatsApp
- `whatsapp-messages-list`: Ver mensajes de un contacto específico
- `whatsapp-send-message`: Enviar mensaje de texto por WhatsApp
- `whatsapp-sync`: Sincronizar mensajes entrantes desde WPPConnect

### Modified Capabilities
- Ninguno (email ya existe, WhatsApp es nuevo canal)

## Impact

- **Archivos nuevos/modificados**:
  - `app/api/whatsapp/route.ts` (GET contactos, con auth)
  - `app/api/whatsapp/[contactId]/route.ts` (GET mensajes, con auth)
  - `app/api/whatsapp/send/route.ts` (POST enviar, verificar auth)
  - `app/api/whatsapp/sync/route.ts` (POST sincronizar, con auth)
  - `lib/whatsapp/whatsappService.ts` (actualizar)
  - `lib/whatsapp/syncService.ts` (nuevo)
  - `lib/whatsapp/types.ts` (nuevo)
  - `app/(crm)/whatsapp/page.tsx` (nuevo)
  - `docs/tests/whatsapp.http` (nuevo - tests HTTP)
  - `public/openapi.json` (actualizar - agregar endpoints WhatsApp)
- **Variables de entorno**:
  - `WHATSAPP_API_URL`: URL del servidor WPPConnect
  - `WHATSAPP_INSTANCE_NAME`: Nombre de instancia WPPConnect

## Non-goals

- Envío de medios (imágenes, documentos) - solo texto
- Envío de mensajes programados
- Plantillas de WhatsApp Business
- Chat en tiempo real (WebSocket)

## Architecture

```
┌─────────────┐                    ┌──────────────────┐
│   Vercel    │                    │     Render       │
│  (CRM API)  │  ──────HTTP─────▶│   (WPPConnect)   │
│  + Auth ✓   │                    │   (Free + Ping)  │
└─────────────┘                    └──────────────────┘
       │                                   │
       ▼                                   ▼
┌─────────────┐                    ┌──────────────────┐
│   Turso     │                    │  WhatsApp        │
│  (mensajes) │                    │  (dispositivo)   │
└─────────────┘                    └──────────────────┘
```

## Cost

- Vercel: $0 (Hobby)
- Render Free: $0 (WPPConnect con ping cada 10 min)
- Turso: $0 (5GB)
- Crons.dev: $0 (ping gratuito)
- **Total: $0**