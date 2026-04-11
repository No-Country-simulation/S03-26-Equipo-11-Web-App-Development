# Design: WhatsApp API Integration

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     DESARROLLO                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Tu PC (Docker Desktop)                                        │
│   ├─ Next.js CRM: http://localhost:3000                        │
│   └─ WPPConnect: http://localhost:8080                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       PRODUCCIÓN                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐                    ┌──────────────────┐      │
│   │   Vercel    │                    │     Render      │      │
│   │  (CRM API)  │  ──────HTTP─────▶│   (WPPConnect)   │      │
│   │  + Auth ✓  │                    │   (Free + Ping)  │      │
│   └─────────────┘                    └──────────────────┘      │
│         │                                   │                  │
│         ▼                                   ▼                  │
│   ┌─────────────┐                    ┌──────────────────┐      │
│   │   Turso    │                    │  WhatsApp        │      │
│   │  (DB CRM)  │                    │  (tu número)     │      │
│   └─────────────┘                    └──────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication

Todos los endpoints requieren autenticación mediante Better Auth:

```typescript
// Pattern usado en todos los endpoints
function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return unauthorizedResponse();
  }
  // ... rest of handler
}
```

Esta validación es idéntica a los endpoints existentes (email, contacts).

## Component Design

### 1. WhatsApp Service (lib/whatsapp/whatsappService.ts)

```typescript
interface WhatsAppService {
  sendMessage(to: string, text: string): Promise<SendResult>;
  getMessages(contactId: string, limit: number, offset: number): Promise<Message[]>;
  getContacts(): Promise<WhatsAppContact[]>;
}

interface WhatsAppContact {
  contactId: string;
  name: string;
  phone: string;
  lastMessage: string;      // truncado a 10 chars
  unreadCount: number;
  lastMessageAt: string;
}

interface Message {
  id: string;
  contenido: string;
  direccion: 'entrante' | 'saliente';
  fecha: string;
  leido: boolean;
}
```

### 2. Sync Service (lib/whatsapp/syncService.ts)

- Polling cada X minutos (configurable via env)
- Consultar WPPConnect API para nuevos mensajes
- Insertar en tabla `messages` con `canal: 'whatsapp'`
- Actualizar `lastContact` en tabla `contacts`

### 3. API Endpoints

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/api/whatsapp` | GET | Listado de contactos WA | ✅ x-user-id |
| `/api/whatsapp/[contactId]` | GET | Mensajes de contacto | ✅ x-user-id |
| `/api/whatsapp/send` | POST | Enviar mensaje | ✅ x-user-id |
| `/api/whatsapp/sync` | POST | Sincronizar mensajes | ✅ x-user-id |

### 4. Frontend Page (app/(crm)/whatsapp/page.tsx)

Similar a página de Email:
- Listado de contactos con preview de último mensaje
- Filtro por no leídos
- Click en contacto → ver mensajes
- Input para enviar nuevo mensaje

## Data Flow

### Enviar mensaje (POST /api/whatsapp/send)
```
1. Frontend llama API con { contactId, text }
2. API valida x-user-id → 401 si no hay sesión
3. API busca número de contacto en DB
4. Llama WPPConnect POST /sendText
5. WPPConnect envía a WhatsApp
6. Si éxito → guardar en tabla messages (direccion: saliente)
7. Retornar resultado al frontend
```

### Sincronizar mensajes (POST /api/whatsapp/sync)
```
1. API valida x-user-id → 401 si no hay sesión
2. API recibe POST (trigger manual o cron)
3. Consulta WPPConnect GET /messages
4. Por cada mensaje nuevo:
   - Buscar o crear contacto por número
   - Insertar en tabla messages (direccion: entrante)
5. Actualizar lastContact del contacto
6. Retornar resumen de sincronización
```

## WPPConnect API Reference

### Enviar mensaje de texto
```
POST /send/text/{instance}
{
  "number": "+59176543210",
  "text": "Hola mundo"
}
```

### Obtener mensajes
```
GET /messages/{instance}?count=100
```

## Environment Variables

```env
# WPPConnect
WHATSAPP_API_URL=http://localhost:8080
WHATSAPP_INSTANCE_NAME=default

# Sync (opcional)
WHATSAPP_SYNC_BATCH_SIZE=10
```

## Documentation

### A) docs/tests/whatsapp.http

Archivo con requests de prueba para todos los endpoints:

```http
### GET - Listar contactos WhatsApp (requiere auth)
GET http://localhost:3000/api/whatsapp?limit=20&offset=0
Cookie: better-auth.session_token=xxx

### GET - Mensajes de un contacto (requiere auth)
GET http://localhost:3000/api/whatsapp/{contactId}?limit=20&offset=0
Cookie: better-auth.session_token=xxx

### POST - Enviar mensaje (requiere auth)
POST http://localhost:3000/api/whatsapp/send
Cookie: better-auth.session_token=xxx
Content-Type: application/json

{
  "contactId": "uuid-del-contacto",
  "text": "Hola mundo"
}

### POST - Sincronizar mensajes (requiere auth)
POST http://localhost:3000/api/whatsapp/sync
Cookie: better-auth.session_token=xxx
```

### B) public/openapi.json

Agregar endpoints WhatsApp con:
- Tag: "WhatsApp"
- Security: bearerAuth
- Descripción indicando requerimiento de autenticación

## Formato de Números

Bolivia: `+591 7XXXXXXX`
- Código país: +591
- Ejemplo: +59176543210