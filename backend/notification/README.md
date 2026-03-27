# Email Service - Node.js + TypeScript

Microservicio para **envío y recepción de emails transaccionales** via SMTP/IMAP. Sin ORM ni base de datos - funciona como proxy entre el CRM y el servidor de correo.

## Funcionalidad

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/email/send` | POST | Enviar email via SMTP |
| `/email/receive` | POST | Recibir emails via IMAP |
| `/health` | GET | Verificar estado del servicio |

## Estructura

```
backend/notification/
├── src/
│   ├── email/
│   │   ├── emailService.ts    # Envío SMTP con Nodemailer
│   │   ├── imapService.ts    # Recepción IMAP con node-imap
│   │   └── types.ts          # Tipos TS
│   ├── routes/
│   │   ├── emailSend.ts      # Handler POST /email/send
│   │   └── emailReceive.ts   # Handler POST /email/receive
│   ├── utils/
│   │   └── validate.ts       # Validación de payloads
│   └── server.ts             # Servidor HTTP
├── .env.example               # Plantilla de configuración
├── package.json
└── tsconfig.json
```

## Requisitos

- Node.js 18+ (recomendado 20+)
- Acceso a servidor SMTP/IMAP (Gmail, Outlook, Proton, etc.)

## Configuración

1. Copiar `.env.example` a `.env`
2. Completar las credenciales SMTP/IMAP
3. (Opcional) Cambiar `PORT` si hay conflicto con otros servicios

### Variables de entorno

```bash
# Puerto del servicio (evita conflicto con frontend: 3000)
PORT=3001

# SMTP (envío)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu_correo@gmail.com
SMTP_PASS=abcd1234efgh5678  # 16 chars - ver sección "Gmail: App Password"

# IMAP (recepción)
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_USER=tu_correo@gmail.com
IMAP_PASS=abcd1234efgh5678  # mismo valor que SMTP_PASS

# Remitente por defecto
FROM_EMAIL=tu_correo@gmail.com
FROM_NAME=CRM Notifications
```

### Gmail: configurar App Password

Gmail no permite acceso SMTP/IMAP con contraseña normal. Requieres generar una **App Password** (contraseña de aplicación):

**Paso 1: Activar Verificación en 2 pasos (2FA)**
1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. Seguridad → **Verificación en 2 pasos** → activar
3. Seguir pasos para configurar (código QR, respaldo, etc.)

**Paso 2: Generar App Password**
1. Ir a **Seguridad** → buscar "Contraseñas de aplicaciones"
2. Si no aparece, buscar directamente: https://myaccount.google.com/apppasswords
3. Seleccionar app: **Otro (nombre personalizado)**
4. Nombre: `CRM Notification`
5. Copiar la contraseña de 16 caracteres generada

**Usar en .env:**
```bash
SMTP_PASS=abcd1234efgh5678  # los 16 caracteres de App Password
IMAP_PASS=abcd1234efgh5678  # mismo valor
```

**Nota**: Si dice "La verificación en 2 pasos no está configurada", primero completar el paso 1.

## Instalación

```bash
cd backend/notification
npm install
```

## Ejecutar

```bash
# Desarrollo (hot reload)
npm run dev

# Producción
npm run build
npm start
```

El servicio queda disponible en `http://localhost:3001`

## Integración con CRM (Java/Spring Boot)

Llamar desde el microservicio Java usando `RestTemplate` o `WebClient`:

```java
// Ejemplo desde ContactController.java
String notificationUrl = "http://localhost:3001/email/send";

Map<String, Object> emailPayload = Map.of(
    "to", contact.getEmail(),
    "subject", "Nuevo contacto creado",
    "html", "<h1>Bienvenido</h1><p>..." + contact.getName() + "</p>",
    "text", "Bienvenido " + contact.getName(),
    "contactId", contact.getId()
);

// HttpHeaders + HttpEntity + RestTemplate...
```

**Payload esperado:**

```json
{
  "to": "destinatario@dominio.com",
  "subject": "Asunto del email",
  "html": "<p>HTML content</p>",
  "text": "Texto plano",
  "contactId": 123
}
```

## Pruebas con curl

```bash
# Health check
curl http://localhost:3001/health

# Enviar email
curl -X POST http://localhost:3001/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@dominio.com",
    "subject": "Prueba desde CRM",
    "html": "<p>Hola mundo</p>",
    "text": "Hola mundo",
    "contactId": 1
  }'

# Recibir emails
curl -X POST http://localhost:3001/email/receive \
  -H "Content-Type: application/json" \
  -d '{
    "limit": 10,
    "unreadOnly": false,
    "mailbox": "INBOX"
  }'
```

## Respuestas

### Envío exitoso
```json
{
  "status": "sent",
  "messageId": "<abc123@google.com>"
}
```

### Recepción exitosa
```json
{
  "status": "ok",
  "count": 1,
  "emails": [
    {
      "from": "cliente@dominio.com",
      "to": "crm@tu_dominio.com",
      "subject": "Consulta",
      "date": "2026-03-26T10:22:11.000Z",
      "text": "Contenido en texto",
      "html": "<p>Contenido en HTML</p>",
      "messageId": "<msg123>",
      "seen": false
    }
  ]
}
```

## Seguridad

- **Sin persistencia**: no guarda emails ni datos en BD
- **Solo proxy**: reenvía tráfico entre CRM y servidor SMTP/IMAP
- **Variables de entorno**: credenciales fuera del código fuente
- **Timeout configurable**: evita conexiones colgadas (implícito en nodemailer/node-imap)
- **No expuesta a internet**: ejecutar solo en red local/Docker

## Notas

- Para **Proton Mail**: usar **Proton Bridge** local para obtener host/puerto SMTP/IMAP reales
- Para **Gmail**: requiere App Password, no la contraseña normal
- Para **Outlook**: usar cuenta profesional o activar IMAP en opciones de correo
- Este servicio está diseñado para ejecutarse junto al CRM Java, no como servicio standalone público