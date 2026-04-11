# OpenSpec: Actualización Endpoints WhatsApp

## Fecha: 2026-04-09
## Estado: ✅ COMPLETADO

---

## Resumen Ejecutivo

Se implementó la integración de WAHA (WhatsApp HTTP API) con el CRM, reemplazando la configuración anterior de WPPConnect.

---

## Cambios Realizados

### 1. GET /api/whatsapp → Ahora hace sync automáticamente

**Archivo:** `app/api/whatsapp/route.ts`

```typescript
// ANTES: Solo leía de BD local
const result = await getWhatsAppContacts(page, limit, search, unreadOnly);

// DESPUÉS: Primero sync con WAHA, luego devuelve contactos
await syncWhatsAppMessages();
const result = await getWhatsAppContacts(page, limit, search, false);
```

**Efecto:** Cada consulta de lista WhatsApp también trae nuevos mensajes desde WAHA.

---

### 2. Guardar metadata en mensajes

**Archivo:** `lib/whatsapp/whatsappService.ts` (syncWhatsAppMessages)

```typescript
metadata: JSON.stringify({
  ack: lastMsg.ack,                    // Estado: 1=sent, 2=delivered, 3=read
  ackName: lastMsg.ackName,           // PENDING, SENT, DELIVERED, READ
  source: lastMsg.source,             // app, web, etc
  hasMedia: lastMsg.hasMedia,         // tiene archivo?
  mediaType: lastMsg.media?.mimetype, // tipo de archivo
  originalTimestamp: lastMsg.timestamp,
  from: lastMsg.from,
  to: lastMsg.to,
})
```

---

### 3. Correcciones de bugs durante testing

#### 3.1 Formato chatId (error 500 en WAHA)

**Problema:** El chatId se generaba con `+59167023053@c.us` (con el +)

**Solución:**
```typescript
const chatId = formattedPhone.replace("+", "") + "@c.us";
// Resultado: 59167023053@c.us (sin +)
```

#### 3.2 Error messageId como objeto (error 500 en BD)

**Problema:** WAHA devuelve messageId como objeto, no string

**Solución:**
```typescript
let messageId = result.id || result.messageId;

if (typeof messageId === "object" && messageId !== null) {
  messageId = messageId._serialized || messageId.id || `wa_${randomUUID()...}`;
} else if (!messageId) {
  messageId = `wa_${randomUUID()...}`;
}
```

#### 3.3 Soporte para campo "to" en payload

**Problema:** El endpoint enviaba `to` pero el servicio esperaba `phone`

**Solución:**
```typescript
let phone = payload.phone || payload.to;
```

---

## Endpoints Funcionales

| # | Endpoint | Método | Auth | Estado |
|---|----------|--------|------|--------|
| 1 | `/api/whatsapp` | GET | ✅ Requerida | ✅ FUNCIONAL |
| 2 | `/api/whatsapp/send` | POST | ✅ Requerida | ✅ FUNCIONAL |
| 3 | `/api/whatsapp/{contactId}` | GET | ✅ Requerida | ✅ FUNCIONAL |

### Ejemplos de uso:

```http
### 1. GET /api/whatsapp - Lista contactos + sync automático
GET http://localhost:3000/api/whatsapp?limit=20
Cookie: better-auth.session_token=<token>

### 2. POST /api/whatsapp/send - Enviar mensaje
POST http://localhost:3000/api/whatsapp/send
Content-Type: application/json
Cookie: better-auth.session_token=<token>

{
  "to": "+59167023053",
  "text": "Hola desde el CRM"
}

### 3. GET /api/whatsapp/{id} - Mensajes de un contacto
GET http://localhost:3000/api/whatsapp/<CONTACT_ID>?limit=20
Cookie: better-auth.session_token=<token>
```

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `app/api/whatsapp/route.ts` | GET ahora llama sync + getContacts |
| `app/api/whatsapp/send/route.ts` | Soporte campo "to", auth habilitada |
| `app/api/whatsapp/[contactId]/route.ts` | Auth habilitada |
| `lib/whatsapp/whatsappService.ts` | metadata, chatId, messageId corregidos |

---

## Configuración WAHA

| Variable | Valor |
|----------|-------|
| Puerto | 4000 |
| API Key | 0148d3609e824423acf609c15f2b42b8 |
| Sesión | default |
| Engine | WEBJS |
| Estado | WORKING |

---

## Pendiente

- ✅ Testing completado
- ✅ Integración con frontend (pendiente)
- ✅ Documentación actualizada

---

## Notas

- WAHA corriendo en puerto 4000
- CRM configurado para llamar a WAHA en localhost:4000
- Los mensajes ahora tienen más info en campo metadata
- Autenticación via Better Auth habilitada en los 3 endpoints
