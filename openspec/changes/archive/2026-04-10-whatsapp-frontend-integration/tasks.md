# OpenSpec: Frontend WhatsApp - Integración con Endpoints

## Estado: ✅ COMPLETADO

## Objetivo

Conectar el frontend de WhatsApp (`app\(crm)\whatsapp\page.tsx`) con los endpoints funcionales, mostrando listado de conversaciones y permitiendo enviar mensajes.

---

## Tareas

### Tarea 1: Corregir `getWhatsAppContacts` - devolver múltiples contactos

- **Archivo:** `lib/whatsapp/whatsappService.ts`
- **Problema:** Solo devuelve 1 contacto (bug en paginación)
- **Solución:** Usar WHERE IN clause para devolver todos los contactos paginados
- **Estimación:** 30 min
- **Estado:** ✅ COMPLETADO

### Tarea 2: Endpoint mensajes - usar WAHA messagesHistory

- **Archivo:** `lib/whatsapp/whatsappService.ts` (getWhatsAppMessages)
- **Problema:** WAHA `/chats/{id}` devuelve 500 para mensajes de chat específico
- **Solución:** Usar WAHA `/api/{session}/chats/{chatId}/messagesHistory`
- **Estimación:** 45 min
- **Estado:** ✅ COMPLETADO

### Tarea 3: Corregir payload de envío en frontend

- **Archivo:** `app\(crm)\whatsapp\page.tsx`
- **Problema:** Frontend envía `contactId`, backend espera `to` (teléfono)
- **Solución:** Cambiar payload a usar `to: selectedContact.phone`
- **Estimación:** 15 min
- **Estado:** ✅ COMPLETADO

---

## Criterios de Éxito

- [x] Lista de contactos muestra todas las conversaciones de WhatsApp
- [x] Al hacer click en contacto, se muestran los mensajes
- [x] Enviar mensaje funciona correctamente
- [x] Botón sincronizar ejecuta sync y actualiza lista

---

## Archivos Modificados

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `lib/whatsapp/whatsappService.ts` | getWhatsAppContacts: devuelve múltiples contactos + getWhatsAppMessages: usa WAHA messagesHistory |
| 2 | `app\(crm)\whatsapp\page.tsx` | Cambiar payload de envío a usar `to` (teléfono) |

---

## Dependencias

- WAHA corriendo en puerto 4000
- Base de datos con mensajes de WhatsApp
- Frontend existente en `app\(crm)\whatsapp\page.tsx`
