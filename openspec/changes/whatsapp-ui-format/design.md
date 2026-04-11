# Design: WhatsApp UI - Correcciones de Formato y Orden

## Estado: PLANIFICADO

## Análisis de Observaciones

### Observación 1: Mostrar fecha + hora

**Ubicación actual:**
- Lista contactos: `formatTime()` línea ~235 de page.tsx
- Detalle mensajes: `formatTime()` línea ~291 de page.tsx

**Solución:**
```typescript
function formatDateTime(ts: string) {
  if (!ts) return "";
  const date = new Date(ts);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}
```

**Aplicar en:**
- Lista contactos: `{formatDateTime(c.lastMessageAt)}`
- Detalle mensajes: `{formatDateTime(msg.fecha)}`

---

### Observación 2: Ordenar contactos

**Estado:** ✅ Ya funciona correctamente.

El código en `whatsappService.ts` líneas 296-300:
```typescript
formattedContacts.sort((a, b) => {
  const dateA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
  const dateB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
  return dateB - dateA;  // Más reciente primero
});
```

Orden: Mayor a menor = más reciente primero ✅

---

### Observación 3: Ordenar mensajes (primero a último)

**Problema actual:**
- WAHA devuelve mensajes ordenados DESC (más reciente primero)
- Fallback también usa `orderBy(desc(messages.createdAt))`

**Solución en whatsappService.ts:**

Para WAHA (línea ~421):
```typescript
// Invertir después de obtener
const paginatedMessages = messagesArray.slice((page - 1) * limit, page * limit).reverse();
```

Para fallback (línea ~463):
```typescript
// Cambiar desc por asc
.orderBy(asc(messages.createdAt))
```

---

## Archivos a Modificar

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `app\(crm)\whatsapp\page.tsx` | Agregar formatDateTime(), usar en lista y detalle |
| 2 | `lib/whatsapp/whatsappService.ts` | Invertir orden mensajes (ASC) |

---

## Detalle de Cambios

### app\(crm)\whatsapp\page.tsx

```typescript
// Agregar nueva función
function formatDateTime(ts: string) {
  if (!ts) return "";
  const date = new Date(ts);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Cambiar formatTime por formatDateTime en:
// - Lista contactos (línea ~235)
// - Detalle mensajes (línea ~291)
```

### lib/whatsapp/whatsappService.ts

```typescript
// En getWhatsAppMessages:
// WAHA path - línea ~421
const paginatedMessages = messagesArray.slice((page - 1) * limit, page * limit).reverse();

// Fallback path - línea ~463
.orderBy(asc(messages.createdAt))
```
