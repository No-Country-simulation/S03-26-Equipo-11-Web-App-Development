# Design: Frontend WhatsApp - Integración con Endpoints

## Estado: ✅ COMPLETADO

## Análisis del Estado Actual

### Frontend (`app\(crm)\whatsapp\page.tsx`)

| Componente | Estado | Problema |
|------------|--------|----------|
| Lista contactos (izq) | ⚠️ Parcial | Solo muestra 1 contacto (bug en paginación) |
| Detalle mensajes (der) | ❌ No funciona | Endpoint WAHA devuelve 500 |
| Enviar mensaje | ⚠️ Parcial | Frontend envía `contactId`, backend espera `to` |
| Botón sincronizar | ✅ Funciona | Llama POST /api/whatsapp |

### Endpoints Existentes

| Endpoint | Método | Estado | Notas |
|----------|--------|--------|-------|
| `/api/whatsapp` | GET | ⚠️ Parcial | Solo devuelve 1 contacto |
| `/api/whatsapp/send` | POST | ✅ Funciona | Requiere campo `to` |
| `/api/whatsapp/{contactId}` | GET | ❌ No funciona | WAHA error 500 |

---

## Solución Propuesta

### 1. Corregir getWhatsAppContacts (whatsappService.ts)

**Problema:** La función solo obtiene 1 contacto de la lista paginada.

**Solución:** Iterar sobre todos los contactIds paginados y devolverlos.

```typescript
// Antes (bug): solo 1 contacto
const contactData = await db
  .select()
  .from(contacts)
  .where(eq(contacts.id, paginatedIds[0]));

// Después: múltiples contactos
const contactData = await db
  .select()
  .from(contacts)
  .where(sql`${contacts.id} IN ${paginatedIds}`);
```

### 2. Endpoint mensajes - WAHA messagesHistory

**Problema:** WAHA `/api/{session}/chats/{chatId}` devuelve 500 cuando se piden mensajes.

**Solución:** Usar endpoint alternativo:
- WAHA: `/api/{session}/chats/{chatId}/messagesHistory`

**Payload de transformación:**
```typescript
// Transformar respuesta WAHA al formato del frontend
const formattedMessages = wahaMessages.map((msg) => ({
  id: msg.id._serialized || msg.id,
  contenido: msg.body || msg.content || "",
  direccion: msg.fromMe ? "saliente" : "entrante",
  fecha: new Date(msg.timestamp * 1000).toISOString(),
  leido: msg.ack >= 2,
}));
```

### 3. Corregir payload de envío (frontend)

**Problema:** Frontend envía `contactId`, backend espera `to`.

**Solución:**
```typescript
// Antes
body: JSON.stringify({
  contactId: selectedContact.contactId,
  text: messageText,
})

// Después
body: JSON.stringify({
  to: selectedContact.phone,  // Enviar teléfono
  text: messageText,
})
```

---

## Archivos a Modificar

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `lib/whatsapp/whatsappService.ts` | Fix getWhatsAppContacts: devolver múltiples contactos |
| 2 | `app/api/whatsapp/[contactId]/route.ts` | Usar WAHA `/chats/{id}/messagesHistory` |
| 3 | `app\(crm)\whatsapp\page.tsx` | Cambiar payload de envío a usar `to` (teléfono) |

---

## Flujo de Datos

```
Frontend                      API                          WAHA (Puerto 4000)
   |                          |                               |
   |-- GET /whatsapp ------> |                               |
   |                         |-- syncWhatsAppMessages() --->| /api/session/chats/overview
   |                         |<------------------------------|
   |                         |-- getWhatsAppContacts() ----->| DB (messages table)
   |<-- { data: contacts } --|                               |
   |                          |                               |
   |-- GET /whatsapp/:id --> |                               |
   |                         |-- getWhatsAppMessages() ---->| /api/session/chats/{id}/messagesHistory
   |                         |<------------------------------|
   |<-- { data: messages } -|                               |
   |                          |                               |
   |-- POST /whatsapp/send ->|                               |
   |   { to, text }          |-- sendWhatsAppMessage() ---->| /api/sendText
   |                         |<------------------------------|
   |<-- { status: sent } ----|                               |
```
