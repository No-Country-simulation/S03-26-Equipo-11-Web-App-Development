# Tasks: WhatsApp API Integration

## Status: Pending

## 1. Environment Variables

- [ ] 1.1 Agregar WHATSAPP_API_URL al .env
- [ ] 1.2 Agregar WHATSAPP_INSTANCE_NAME al .env

## 2. WhatsApp Service

- [ ] 2.1 Crear lib/whatsapp/types.ts con interfaces
- [ ] 2.2 Actualizar lib/whatsapp/whatsappService.ts para usar WPPConnect API real
- [ ] 2.3 Implementar método sendMessage(to, text)
- [ ] 2.4 Implementar método getMessages(contactId, limit, offset)
- [ ] 2.5 Implementar método getContacts()

## 3. API Endpoints

- [ ] 3.1 Crear app/api/whatsapp/route.ts (GET - contacts list, con auth)
- [ ] 3.2 Crear app/api/whatsapp/[contactId]/route.ts (GET - messages, con auth)
- [ ] 3.3 Verificar/actualizar app/api/whatsapp/send/route.ts (POST - send message, con auth)
- [ ] 3.4 Crear app/api/whatsapp/sync/route.ts (POST - sync messages, con auth)

## 4. Sync Service

- [ ] 4.1 Crear lib/whatsapp/syncService.ts
- [ ] 4.2 Implementar syncFromWPPConnect()
- [ ] 4.3 Implementar findOrCreateContactByPhone()
- [ ] 4.4 Implementar updateContactLastContact()

## 5. Frontend Page

- [ ] 5.1 Crear app/(crm)/whatsapp/page.tsx
- [ ] 5.2 Mostrar listado de contactos con preview
- [ ] 5.3 Implementar vista de mensajes por contacto
- [ ] 5.4 Implementar input para enviar mensaje
- [ ] 5.5 Agregar estados de loading y error
- [ ] 5.6 Conectar a endpoints API

## 6. Testing

- [ ] 6.1 Testear GET /api/whatsapp con datos mock
- [ ] 6.2 Testear GET /api/whatsapp/[contactId]
- [ ] 6.3 Testear POST /api/whatsapp/send
- [ ] 6.4 Testear POST /api/whatsapp/sync

## 7. Integration with WPPConnect

- [ ] 7.1 Configurar WPPConnect en Docker Desktop (desarrollo)
- [ ] 7.2 Configurar WPPConnect en Render (producción)
- [ ] 7.3 Conectar número de WhatsApp (escanear QR)
- [ ] 7.4 Probar flujo completo: enviar y recibir

## 8. Documentation

- [ ] 8.1 Crear docs/tests/whatsapp.http con endpoints de prueba
- [ ] 8.2 Actualizar public/openapi.json con nuevos endpoints WhatsApp

---

## Files Modified

- `.env` (variables nuevas WHATSAPP_API_URL, WHATSAPP_INSTANCE_NAME)
- `lib/whatsapp/types.ts` (nuevo)
- `lib/whatsapp/whatsappService.ts` (actualizar)
- `lib/whatsapp/syncService.ts` (nuevo)
- `app/api/whatsapp/route.ts` (nuevo - GET contacts)
- `app/api/whatsapp/[contactId]/route.ts` (nuevo - GET messages)
- `app/api/whatsapp/send/route.ts` (actualizar - verificar auth)
- `app/api/whatsapp/sync/route.ts` (nuevo)
- `app/(crm)/whatsapp/page.tsx` (nuevo)
- `docs/tests/whatsapp.http` (nuevo)
- `public/openapi.json` (actualizar)

## Verification Criteria

- [ ] GET /api/whatsapp retorna contactos con preview de último mensaje
- [ ] GET /api/whatsapp/[contactId] retorna mensajes del contacto
- [ ] POST /api/whatsapp/send envía mensaje y lo guarda en DB
- [ ] POST /api/whatsapp/sync sincroniza mensajes nuevos
- [ ] Página frontend muestra listado y permite enviar mensajes
- [ ] Todos los endpoints requieren autenticación (x-user-id header)
- [ ] docs/tests/whatsapp.http creado con ejemplos de requests
- [ ] public/openapi.json actualizado con endpoints WhatsApp
- [ ] Build sin errores
- [ ] Lint sin errores