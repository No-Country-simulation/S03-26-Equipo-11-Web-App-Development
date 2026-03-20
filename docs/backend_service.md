# Backend Service — Documentación de Endpoints

## Índice

1. [Gestión de Contactos](#1-gestión-de-contactos)
2. [Mensajería WhatsApp](#2-mensajería-whatsapp)
3. [Gestión de Plantillas de Email](#3-gestión-de-plantillas-de-email)
4. [Mensajería Email](#4-mensajería-email)
5. [Gestión de Recordatorios](#5-gestión-de-recordatorios)
6. [Configuración](#6-configuración)
7. [Métricas y Analítica](#7-métricas-y-analítica)
8. [Observaciones Generales](#observaciones-generales)

---

## 1. Gestión de Contactos

### Listar contactos (con filtros)

- **Método:** `GET`
- **Path:** `/api/contacts`
- **Query params:**
  - `q` *(string, opcional)*: búsqueda por nombre o empresa.
  - `state` *(string, opcional)*: filtrar por estado (`Lead`, `Contactado`, `Propuesta`, `Cliente`, `Inactivo`).
  - `page` *(int, opcional)*: página para paginación.
  - `limit` *(int, opcional)*: elementos por página.

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "phone": "string",
      "phone_prefix": "string",
      "enterprise": "string",
      "state": "string",
      "last_contact": "date"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 100 }
}
```

**Errores:**
- `400 Bad Request`: parámetros inválidos.
- `500 Internal Server Error`: error en el servidor.

---

### Crear contacto

- **Método:** `POST`
- **Path:** `/api/contacts`

**Body (JSON):**
```json
{
  "name": "string",
  "email": "string",
  "phone_prefix": "string",
  "phone": "string",
  "enterprise": "string"
}
```

**Response `201 Created`:**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "phone_prefix": "string",
  "enterprise": "string",
  "state": "Lead",
  "last_contact": "2026-03-20"
}
```

**Errores:**
- `400 Bad Request`: datos inválidos (email duplicado, formato incorrecto).
- `500 Internal Server Error`.

---

### Obtener contacto por ID

- **Método:** `GET`
- **Path:** `/api/contacts/{id}`
- **Response:** `200 OK` (objeto contacto)

**Errores:**
- `404 Not Found`: contacto no existe.
- `500 Internal Server Error`.

---

### Actualizar contacto (nombre, email, empresa)

- **Método:** `PUT`
- **Path:** `/api/contacts/{id}`

**Body (JSON):**
```json
{
  "name": "string",
  "email": "string",
  "enterprise": "string"
}
```

**Response:** `200 OK` (objeto actualizado)

**Errores:**
- `400 Bad Request`: datos inválidos.
- `404 Not Found`: contacto no existe.
- `500 Internal Server Error`.

---

### Actualizar estado del contacto

- **Método:** `PATCH`
- **Path:** `/api/contacts/{id}/state`

**Body (JSON):**
```json
{
  "state": "Lead|Contactado|Propuesta|Cliente|Inactivo"
}
```

**Response:** `200 OK` (objeto con nuevo estado)

**Errores:**
- `400 Bad Request`: estado no válido.
- `404 Not Found`.
- `500 Internal Server Error`.

---

### Eliminar contacto (soft delete)

- **Método:** `DELETE`
- **Path:** `/api/contacts/{id}`
- **Response:** `204 No Content`

**Errores:**
- `404 Not Found`.
- `500 Internal Server Error`.

---

### Exportar contactos (CSV)

- **Método:** `GET`
- **Path:** `/api/contacts/export`
- **Query params:** mismos filtros que en listar (`q`, `state`).
- **Response:** `200 OK` con archivo CSV (attachment).

**Errores:**
- `400 Bad Request`: filtros inválidos.
- `500 Internal Server Error`.

---

## 2. Mensajería WhatsApp

### Webhook para mensajes entrantes (endpoint público)

- **Método:** `POST`
- **Path:** `/api/webhooks/whatsapp`
- **Body:** según especificación de Meta (objeto JSON con mensaje).
- **Response:** `200 OK` (confirmación simple) o `403` si falla validación.

> **Nota:** Este endpoint no requiere autenticación; valida la firma de Meta.

---

### Enviar mensaje por WhatsApp

- **Método:** `POST`
- **Path:** `/api/whatsapp/messages`

**Body (JSON):**
```json
{
  "contact_id": "uuid",
  "text": "string"
}
```

**Response `200 OK`:**
```json
{
  "message_id": "string",
  "status": "sent"
}
```

**Errores:**
- `400 Bad Request`: contacto sin número o texto vacío.
- `404 Not Found`: contacto no existe.
- `503 Service Unavailable`: problema con WhatsApp API.
- `500 Internal Server Error`.

---

### Obtener conversación con un contacto

- **Método:** `GET`
- **Path:** `/api/whatsapp/conversations/{contact_id}`
- **Query params:**
  - `limit` *(opcional)*
  - `before` *(opcional, timestamp para paginación)*

**Response `200 OK`:**
```json
{
  "contact": { "..." : "..." },
  "messages": [
    {
      "id": "string",
      "direction": "inbound|outbound",
      "text": "string",
      "timestamp": "datetime",
      "status": "delivered|read|failed"
    }
  ]
}
```

**Errores:**
- `404 Not Found`: contacto no existe.
- `500 Internal Server Error`.

---

### Obtener total de mensajes enviados/recibidos (métricas)

- **Método:** `GET`
- **Path:** `/api/whatsapp/metrics/total`

**Response `200 OK`:**
```json
{
  "total_sent": 123,
  "total_received": 456
}
```

**Errores:** `500 Internal Server Error`.

---

### Obtener actividad semanal (para gráficos)

- **Método:** `GET`
- **Path:** `/api/whatsapp/metrics/weekly`
- **Query params:** `from`, `to` (fechas ISO).

**Response `200 OK`:**
```json
{
  "labels": ["2026-03-14", "2026-03-15"],
  "sent": [10, 12],
  "received": [5, 8]
}
```

**Errores:** `400 Bad Request` si fechas inválidas.

---

## 3. Gestión de Plantillas de Email

### Listar plantillas

- **Método:** `GET`
- **Path:** `/api/templates`

**Response `200 OK`:**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "asunto": "string",
    "cuerpo_html": "string",
    "created_at": "datetime",
    "updated_at": "datetime"
  }
]
```

---

### Crear plantilla

- **Método:** `POST`
- **Path:** `/api/templates`

**Body (JSON):**
```json
{
  "name": "string",
  "asunto": "string",
  "cuerpo_html": "string"
}
```

**Response:** `201 Created` (objeto creado)

**Errores:** `400 Bad Request`.

---

### Actualizar plantilla

- **Método:** `PUT`
- **Path:** `/api/templates/{id}`
- **Body:** mismo que en creación.
- **Response:** `200 OK` (objeto actualizado)

**Errores:** `404 Not Found`, `400 Bad Request`.

---

### Eliminar plantilla (hard delete)

- **Método:** `DELETE`
- **Path:** `/api/templates/{id}`
- **Response:** `204 No Content`

**Errores:** `404 Not Found`.

---

## 4. Mensajería Email

### Enviar correo

- **Método:** `POST`
- **Path:** `/api/email/send`

**Body (JSON):**
```json
{
  "contact_id": "uuid",
  "template_id": "uuid",
  "variables": {
    "nombre": "string",
    "empresa": "string"
  }
}
```

**Response `200 OK`:**
```json
{
  "message_id": "string",
  "status": "queued|sent"
}
```

**Errores:**
- `400 Bad Request`: datos inválidos.
- `404 Not Found`: contacto o plantilla no existen.
- `503 Service Unavailable`: SMTP no configurado o error.
- `500 Internal Server Error`.

---

### Obtener buzón de correos (bandeja de entrada)

- **Método:** `GET`
- **Path:** `/api/email/inbox`
- **Query params:** `page`, `limit`

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "string",
      "from": "email",
      "subject": "string",
      "body_preview": "string",
      "received_at": "datetime",
      "contact_id": "uuid|null"
    }
  ],
  "pagination": { "..." : "..." }
}
```

**Errores:** `500 Internal Server Error`.

---

### Obtener hilo de conversación por contacto

- **Método:** `GET`
- **Path:** `/api/email/threads/{contact_id}`
- **Query params:** `page`, `limit`

**Response `200 OK`:**
```json
{
  "contact": { "..." : "..." },
  "messages": [
    {
      "id": "string",
      "direction": "inbound|outbound",
      "subject": "string",
      "body": "html",
      "timestamp": "datetime"
    }
  ]
}
```

**Errores:** `404 Not Found` (contacto no existe).

---

### Métricas de email

- **Método:** `GET`
- **Path:** `/api/email/metrics`

**Response `200 OK`:**
```json
{
  "total_sent": 123,
  "total_received": 456,
  "response_rate": 0.75
}
```

**Errores:** `500 Internal Server Error`.

---

## 5. Gestión de Recordatorios

### Crear recordatorio

- **Método:** `POST`
- **Path:** `/api/reminders`

**Body (JSON):**
```json
{
  "title": "string",
  "description": "string",
  "contact_id": "uuid",
  "priority": "ALTA|MEDIA|BAJA",
  "date": "YYYY-MM-DD",
  "time": "HH:MM:SS",
  "anticipation_minutes": 15,
  "notification_methods": ["WHATSAPP", "EMAIL"]
}
```

**Response:** `201 Created` (objeto recordatorio con `done: false`)

**Errores:**
- `400 Bad Request`: datos inválidos o contacto no existe.
- `500 Internal Server Error`.

---

### Listar recordatorios (con filtros)

- **Método:** `GET`
- **Path:** `/api/reminders`
- **Query params:**
  - `status` *(PENDIENTE, VENCIDO, COMPLETADO)* — opcional.
  - `contact_id` *(uuid)* — opcional.
  - `from_date`, `to_date` — opcional.

**Response:** `200 OK` (array de recordatorios)

**Errores:** `400 Bad Request` si filtros inválidos.

---

### Actualizar recordatorio (reprogramar)

- **Método:** `PUT`
- **Path:** `/api/reminders/{id}`
- **Body:** campos a actualizar (mismos que en creación, todos opcionales).
- **Response:** `200 OK` (objeto actualizado)

**Errores:**
- `404 Not Found`.
- `400 Bad Request`.

---

### Eliminar recordatorio

- **Método:** `DELETE`
- **Path:** `/api/reminders/{id}`
- **Response:** `204 No Content`

**Errores:** `404 Not Found`.

---

### Ejecutar notificación manualmente (endpoint interno)

- **Método:** `POST`
- **Path:** `/api/reminders/{id}/notify`
- **Descripción:** usado por el scheduler para lanzar la notificación (email/WhatsApp). No expuesto públicamente.
- **Response:** `200 OK` (mensaje de éxito)

**Errores:** `404 Not Found`, `500` si falla el envío.

---

## 6. Configuración

### Obtener configuración actual

- **Método:** `GET`
- **Path:** `/api/config`

**Response `200 OK`:**
```json
{
  "whatsapp_number": "+123456789",
  "email_smtp": "smtp.example.com",
  "email_port": 587,
  "email_user": "user@example.com",
  "email_password": "********"
}
```

> La contraseña puede omitirse o devolverse enmascarada.

**Errores:** `500 Internal Server Error`.

---

### Actualizar configuración

- **Método:** `PUT`
- **Path:** `/api/config`

**Body (JSON):**
```json
{
  "whatsapp_number": "+123456789",
  "email_smtp": "smtp.example.com",
  "email_port": 587,
  "email_user": "user@example.com",
  "email_password": "newpassword"
}
```

**Response:** `200 OK` (configuración actualizada)

**Errores:**
- `400 Bad Request`: datos inválidos o credenciales SMTP incorrectas.
- `500 Internal Server Error`.

---

## 7. Métricas y Analítica

### Conteo por estado (funnel)

- **Método:** `GET`
- **Path:** `/api/analytics/funnel`

**Response `200 OK`:**
```json
{
  "Lead": 12,
  "Contactado": 34,
  "Propuesta": 5,
  "Cliente": 8,
  "Inactivo": 2
}
```

**Errores:** `500 Internal Server Error`.

---

### KPIs generales

- **Método:** `GET`
- **Path:** `/api/analytics/kpis`

**Response `200 OK`:**
```json
{
  "active_contacts": 59,
  "whatsapp_messages_sent": 123,
  "emails_sent": 456,
  "whatsapp_response_rate": 0.45,
  "email_response_rate": 0.32,
  "conversion_rate_to_client": 0.15
}
```

**Errores:** `500 Internal Server Error`.

---

### Actividad por período (para gráficos)

- **Método:** `GET`
- **Path:** `/api/analytics/activity`
- **Query params:**
  - `from` *(YYYY-MM-DD)*
  - `to` *(YYYY-MM-DD)*
  - `granularity` *(day | week | month)* — opcional.

**Response `200 OK`:**
```json
{
  "labels": ["2026-03-14", "2026-03-15"],
  "whatsapp_sent": [10, 12],
  "emails_sent": [5, 7]
}
```

**Errores:** `400 Bad Request` si fechas inválidas.

---

### Exportar reporte en PDF

- **Método:** `GET`
- **Path:** `/api/analytics/report`
- **Query params:** opcionales (período).
- **Response:** `200 OK` con archivo PDF (attachment).

**Errores:** `400 Bad Request` si parámetros inválidos, `500 Internal Server Error`.

---

## Observaciones Generales

- Todos los endpoints (excepto el webhook de WhatsApp) requieren **autenticación** (token JWT o sesión), asumiendo que el usuario ya está logueado.
- Las respuestas de error incluirán un objeto con la forma: `{ "error": "mensaje", "code": 400 }`.
- La base de datos está normalizada con los campos indicados en el esquema original, incluyendo `deleted_at` para soft delete en contactos.
- Para los endpoints de exportación, se generan archivos en formato **CSV** o **PDF** según corresponda.
- Los endpoints de métricas consultan logs internos y datos de contacto. Para la **tasa de respuesta**, se requiere registrar respuestas vía webhook de WhatsApp y seguimiento de emails.