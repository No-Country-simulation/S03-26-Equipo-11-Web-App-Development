# REST API - Startup CRM

## Endpoints

### Health Check

```
GET /api/health
```

Verifica que el servidor esté funcionando.

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Autenticación (Better Auth)

El proyecto utiliza **Better Auth** para autenticación con las siguientes características:
- Adaptador Drizzle para SQLite
- Cookies para persistencia de sesión (`better-auth.session_token`)
-bcrypt para hasheo de contraseñas

#### Iniciar Sesión

```
POST /api/auth/signin
```

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña"
}
```

**Respuesta (éxito):**
```json
{
  "user": {
    "id": "user_xxx",
    "email": "usuario@email.com",
    "name": "Nombre Usuario",
    "createdAt": "2026-04-05T..."
  },
  "session": {
    "id": "session_xxx",
    "expiresAt": "2026-04-06T..."
  }
}
```

**Respuesta (error):**
```json
{
  "error": "Invalid email or password"
}
```

---

#### Registrar Usuario

```
POST /api/auth/signup
```

**Body:**
```json
{
  "email": "usuario@email.com",
  "password": "contraseña",
  "name": "Nombre Usuario"
}
```

---

#### Cerrar Sesión

```
POST /api/auth/signout
```

**Respuesta:**
```json
{
  "message": "Logged out successfully"
}
```

---

#### Obtener Sesión Actual

```
GET /api/auth/get-session
```

**Respuesta:**
```json
{
  "user": {
    "id": "user_xxx",
    "email": "usuario@email.com",
    "name": "Nombre Usuario"
  }
}
```

**Sin sesión:**
```json
{
  "user": null
}
```

---

### Dashboard

#### Obtener Métricas

```
GET /api/dashboard
```

Obtiene KPIs y datos para gráficos del dashboard.

**Respuesta:**
```json
{
  "kpis": {
    "activeContacts": 45,
    "whatsappMessages": 128,
    "emailsSent": 67,
    "responseRate": 72.5
  },
  "funnel": [
    { "stage": "new", "count": 12 },
    { "stage": "contacted", "count": 8 },
    { "stage": "qualified", "count": 15 },
    { "stage": "proposal", "count": 5 },
    { "stage": "won", "count": 3 },
    { "stage": "lost", "count": 2 }
  ],
  "channels": [
    { "name": "WhatsApp", "value": 65 },
    { "name": "Email", "value": 35 }
  ],
  "weeklyActivity": [...],
  "conversionTrend": [...]
}
```

---

### Enviar Email

```
POST /api/email/send
```

Envía un email via SMTP usando nodemailer.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Asunto del email",
  "html": "<p>Contenido HTML</p>",
  "text": "Contenido en texto plano",
  "contactId": 123,
  "templateId": "welcome",
  "metadata": {
    "source": "dashboard"
  }
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `to` | string | Sí | Email del destinatario |
| `subject` | string | Sí | Asunto del email |
| `html` | string | No | Contenido HTML |
| `text` | string | No | Contenido texto plano |
| `contactId` | number | No | ID del contacto CRM |
| `templateId` | string | No | ID de plantilla |
| `metadata` | object | No | Metadatos adicionales |

**Respuesta (éxito):**
```json
{
  "status": "sent",
  "provider": "smtp",
  "messageId": "<abc123@smtp.gmail.com>"
}
```

**Respuesta (error):**
```json
{
  "status": "failed",
  "provider": "smtp",
  "error": "Invalid recipient email address"
}
```

---

### Recibir Emails

```
POST /api/email/receive
```

Obtiene lista de emails desde IMAP.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "limit": 10,
  "unreadOnly": false,
  "mailbox": "INBOX"
}
```

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `limit` | number | 10 | Número máximo de emails |
| `unreadOnly` | boolean | false | Solo emails no leídos |
| `mailbox` | string | "INBOX" | Buzón a consultar |

**Respuesta:**
```json
{
  "status": "ok",
  "count": 2,
  "emails": [
    {
      "id": "msg_001",
      "from": "sender@example.com",
      "to": "me@gmail.com",
      "subject": "Reunión mañana",
      "date": "2024-01-15T09:00:00.000Z",
      "read": false,
      "attachments": ["documento.pdf"]
    }
  ]
}
```

---

### Recibir Email Individual

```
POST /api/email/receiveOne
```

Obtiene el contenido completo de un email específico.

**Body:**
```json
{
  "messageId": "msg_001",
  "mailbox": "INBOX"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `messageId` | string | Sí | ID del mensaje |
| `mailbox` | string | No | Buzón (default: INBOX) |

**Respuesta:**
```json
{
  "status": "ok",
  "email": {
    "id": "msg_001",
    "from": "sender@example.com",
    "to": "me@gmail.com",
    "subject": "Reunión mañana",
    "date": "2024-01-15T09:00:00.000Z",
    "body": {
      "text": "Contenido en texto plano",
      "html": "<p>Contenido HTML</p>"
    },
    "read": false,
    "attachments": [
      {
        "filename": "documento.pdf",
        "contentType": "application/pdf",
        "size": 102400
      }
    ]
  }
}
```

---

## WhatsApp (WAHA)

El CRM integra WhatsApp mediante **WAHA** (WhatsApp HTTP API). Los endpoints permiten listar contactos, ver mensajes y enviar mensajes.

### Variables de Entorno

```env
WHATSAPP_API_URL=http://localhost:4000
WHATSAPP_API_KEY=0148d3609e824423acf609c15f2b42b8
WHATSAPP_SESSION=default
```

---

### Listar Contactos WhatsApp

```
GET /api/whatsapp
```

Lista contactos con quienes has conversado por WhatsApp. **Hace sync automático** cada vez que se consulta.

**Query Params:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `limit` | number | 20 | Número de contactos |
| `offset` | number | 0 | Offset para paginación |

**Headers:**
```
Cookie: better-auth.session_token=<token>
```

**Respuesta:**
```json
{
  "data": [
    {
      "contactId": "59167023053@c.us",
      "name": "Juan Perez",
      "phone": "+59167023053",
      "lastMessage": "Hola, necesito información",
      "lastMessageTime": "2026-04-10T12:30:00.000Z",
      "unreadCount": 2
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0
  }
}
```

---

### Ver Mensajes de un Contacto

```
GET /api/whatsapp/[contactId]
```

Lista mensajes de un contacto específico.

**Path Params:**
| Param | Descripción |
|-------|-------------|
| `contactId` | ID del contacto (formato: `59167023053@c.us`) |

**Query Params:**
| Param | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `limit` | number | 20 | Número de mensajes |

**Headers:**
```
Cookie: better-auth.session_token=<token>
```

**Respuesta:**
```json
{
  "data": [
    {
      "id": "msg_123",
      "contenido": "Hola, necesito información",
      "direccion": "entrante",
      "fecha": "2026-04-10T12:30:00.000Z",
      "leido": true
    },
    {
      "id": "msg_124",
      "contenido": "Claro, con gusto te ayudo",
      "direccion": "saliente",
      "fecha": "2026-04-10T12:35:00.000Z",
      "leido": true
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

---

### Enviar Mensaje

```
POST /api/whatsapp/send
```

Envía un mensaje de texto a un contacto.

**Headers:**
```
Content-Type: application/json
Cookie: better-auth.session_token=<token>
```

**Body:**
```json
{
  "to": "+59167023053",
  "text": "Hola desde el CRM!"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `to` | string | Sí | Número de teléfono con código de país |
| `text` | string | Sí | Contenido del mensaje |

**Respuesta (éxito):**
```json
{
  "status": "sent",
  "messageId": "true_59167023053@c.us_3EB0...",
  "contactId": "59167023053@c.us",
  "message": "Mensaje de WhatsApp enviado correctamente"
}
```

**Respuesta (error):**
```json
{
  "status": "failed",
  "error": "Phone number not found"
}
```

---

### Sincronizar Mensajes

```
POST /api/whatsapp/sync
```

Sincroniza mensajes entrantes desde WAHA hacia la base de datos del CRM.

**Headers:**
```
Cookie: better-auth.session_token=<token>
```

**Respuesta:**
```json
{
  "status": "ok",
  "synced": 5,
  "message": "5 mensajes sincronizados"
}
```

---

## Códigos de Estado

| Código | Descripción |
|--------|-------------|
| `200` | OK - Solicitud exitosa |
| `201` | Created - Recurso creado |
| `400` | Bad Request - Solicitud inválida |
| `401` | Unauthorized - No autenticado |
| `500` | Internal Server Error - Error del servidor |

---

## Manejo de Errores

```typescript
export async function POST(request: Request) {
  try {
    // Validar y procesar...
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## Documentación Swagger

La documentación interactiva está disponible en `/api-docs` usando Swagger UI.

**Spec OpenAPI:** `public/openapi.json`

```json
{
  "openapi": "3.0.0",
  "info": {
    "title": "Next.js CRM API",
    "version": "1.0.0"
  },
  "paths": {
    "/api/email/send": {
      "post": {
        "summary": "Send email",
        "requestBody": { ... },
        "responses": { ... }
      }
    }
  }
}
```

---

**Volver a**: [Índice de Arquitectura](../architecture.md)
