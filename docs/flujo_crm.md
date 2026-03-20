
##  🔄 FLUJO COMPLETO DE ASIGNACIÓN DE CONVERSACIONES
```text

1️⃣ CLIENTE ENVÍA MENSAJE
   ↓
   (Desde la Landing Page: QR WhatsApp / Formulario Email / Formulario SMS)
   ↓
2️⃣ CRM RECIBE POR API DIRECTA
   ↓
3️⃣ FILTRO INICIAL DE AGENTES
   ├── ¿Asignación automática activada?
   ├── ¿Dentro de horario laboral?
   ├── ¿Sin vacaciones/ausencias?
   └── ¿Marcado como disponible?
   ↓
4️⃣ EVALUACIÓN DE CAPACIDAD
   ├── ¿Conversaciones activas < capacidad máxima?
   └── Calcular carga actual (%)
   ↓
5️⃣ APLICAR POLÍTICA DE ASIGNACIÓN
   ├── Round-robin → el que lleva más tiempo sin recibir
   ├── Load-balancing → el de menor carga
   └── Skill-based → mejor match de habilidades
   ↓
6️⃣ ASIGNAR Y NOTIFICAR
   ├── Registrar agente asignado
   ├── Incrementar contador de carga
   ├── Notificar vía WebSocket
   └── Agente recibe y responde

``` 


## 📊 FLUJO 1: ASIGNACIÓN INTELIGENTE DE CONVERSACIONES (SIN PROVEEDORES)

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│            FLUJO DE ASIGNACIÓN INTELIGENTE                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

CLIENTE (Landing Page)              CRM (BACKEND)                    SISTEMA DE ASIGNACIÓN                    AGENTES
         │                                 │                                      │                                   │
         │──(1) Envía consulta ───────────>│                                      │                                   │
         │    • QR WhatsApp                │                                      │                                   │
         │    • Formulario Email           │                                      │                                   │
         │    • Formulario SMS             │                                      │                                   │
         │                                 │                                      │                                   │
         │                                 │──(2) POST /api/mensajes ────────────>│                                   │
         │                                 │    {                                 │                                   │
         │                                 │      "remitente": "+51987654321",    │                                   │
         │                                 │      "mensaje": "Hola, ¿precios?",   │                                   │
         │                                 │      "canal": "whatsapp",            │                                   │
         │                                 │      "sessionId": "abc123"           │                                   │
         │                                 │    }                                 │                                   │
         │                                 │                                      │                                   │
         │                                 │                                      │──(3) EJECUTA ALGORITMO ───────────┐
         │                                 │                                      │    DE ASIGNACIÓN                  │
         │                                 │                                      │    • Filtra agentes disponibles   │
         │                                 │                                      │    • Verifica capacidad           │
         │                                 │                                      │    • Calcula carga actual         │
         │                                 │                                      │    • Aplica política (RR/balance) │
         │                                 │                                      │    • Selecciona mejor agente      │
         │                                 │                                      │                                   │
         │                                 │<──(4) Agente asignado ───────────────│                                   │
         │                                 │    "ana@empresa.com"                 │                                   │
         │                                 │                                      │                                   │
         │                                 │──(5) Notifica agente ───────────────────────────────────────────────────>│
         │                                 │    vía WebSocket                     │                                   │
         │                                 │                                      │                                   │
         │                                 │                                      │                                   │──(6) Agente recibe
         │                                 │                                      │                                   │    notificación
         │                                 │                                      │                                   │    y abre conversación
         │                                 │                                      │                                   │
         │                                 │<──(7) Agente escribe respuesta ──────────────────────────────────────────│
         │                                 │    desde el CRM                      │                                   │
         │                                 │                                      │                                   │
         │                                 │──(8) Envía respuesta ───────────────>│                                   │
         │                                 │    vía WebSocket al cliente          │                                   │
         │                                 │    (usando sessionId)                │                                   │
         │                                 │                                      │                                   │
         │<──(9) Cliente recibe ───────────│                                      │                                   │
         │    respuesta en tiempo real     │                                      │                                   │
         │    (en el chat embebido)        │                                      │                                   │
```

---

## 📊 FLUJO 2: FLUJO COMPLETO DE DATOS DEL CRM  

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE DATOS DEL CRM - CON LANDING PAGE CONTROLADA                     │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

                    CLIENTE (Landing Page)                    CRM (BACKEND)                                      AGENTE (FRONTEND)
         │                                       │                                                           │
         │──(1) Accede a landing page ──────────>│                                                           │
         │    www.tucrm.com/contacto             │                                                           │
         │                                       │                                                           │
         │──(2) Elige canal de contacto ────────>│                                                           │
         │    • Escanea QR WhatsApp              │                                                           │
         │    • Rellena formulario Email         │                                                           │
         │    • Rellena formulario SMS           │                                                           │
         │                                       │                                                           │
         │                                       │                                                           │
         │──(3) Envía mensaje ──────────────────>│                                                           │
         │    POST /api/mensajes                 │                                                           │
         │    {                                  │                                                           │
         │      "canal": "whatsapp",             │                                                           │
         │      "remitente": "+51987654321",     │                                                           │
         │      "mensaje": "Hola, ¿precios?",    │                                                           │
         │      "sessionId": "abc123"            │                                                           │
         │    }                                  │                                                           │
         │                                       │                                                           │
         │                                       │    ┌─────────────────────────────────────────────┐        │
         │                                       │    │ PROCESAR MENSAJE                            │        │
         │                                       │    │ • Validar datos                             │        │
         │                                       │    │ • Identificar/crear contacto                │        │
         │                                       │    │ • Guardar mensaje en BD                     │        │
         │                                       │    │ • Asignar agente (algoritmo)                │        │
         │                                       │    │ • Emitir evento WebSocket                   │        │
         │                                       │    └─────────────────────────────────────────────┘        │
         │                                       │                                                           │                   │
         │                                       │                                                           │──(4) WebSocket    │
         │                                       │                                                           │    "nuevo-mensaje"
         │                                       │                                                           │◀──────────────┘
         │                                       │                                                           │             │
         │                                       │                                                           │             ▼
         │                                       │                                                           │    ┌─────────────────────────────┐
         │                                       │                                                           │    │ INTERFAZ AGENTE             │
         │                                       │                                                           │    │                             │
         │                                       │                                                           │    │  🔔 NUEVO MENSAJE           │
         │                                       │                                                           │    │  Carlos Ríos: "Hola..."     │
         │                                       │                                                           │    │  📱 WhatsApp                │
         │                                       │                                                           │    │  [Ver conversación]         │
         │                                       │                                                           │    └─────────────────────────────┘
         │                                       │                                                           │             │
         │                                       │                                                           │             │──(5) Abre
         │                                       │                                                           │             │    conversación
         │                                       │                                                           │             ▼
         │                                       │                                                           │    ┌─────────────────────────────┐
         │                                       │                                                           │    │ VISTA CONVERSACIÓN          │
         │                                       │                                                           │    │                             │
         │                                       │                                                           │    │ 👤 Carlos Ríos              │
         │                                       │                                                           │    │ 📱 +51 987 654 321          │
         │                                       │                                                           │    │ ✉️ carlos@empresa.com      │
         │                                       │                                                           │    │                             │
         │                                       │                                                           │    │ [10:30] Cliente: Hola,      │
         │                                       │                                                           │    │         ¿tienen disponible? │
         │                                       │                                                           │    │                             │
         │                                       │                                                           │    │ [✏️ Escribir respuesta...]  │
         │                                       │                                                           │    │    [📎 Adjuntar] [📤 Enviar] │
         │                                       │                                                           │    └──────────────────────────────┘
         │                                       │                                                           │             │
         │                                       │                                                           │             │──(6) Escribe
         │                                       │                                                           │             │    respuesta
         │                                       │                                                           │             ▼
         │                                       │                                                           │    "Sí, tenemos disponibilidad."
         │                                       │                                                           │    "¿Te envío la propuesta?"
         │                                       │                                                           │             │
         │                                       │<──(7) POST /api/mensajes/enviar ──────────────────────────│──────────────  
         │                                       │    {                                                      │
         │                                       │      "contactoId": 123,                                   │
         │                                       │      "canal": "whatsapp",                                 │
         │                                       │      "contenido": "Sí, tenemos..."                        │
         │                                       │    }                                                      │
         │                                       │                                                           │
         │                                       │    ┌─────────────────────────────────┐                    │
         │                                       │    │ GUARDAR Y ENVIAR                │                    │
         │                                       │    │ • Guardar mensaje saliente en BD│                    │
         │                                       │    │ • Buscar sessionId del cliente  │                    │
         │                                       │    │ • Emitir vía WebSocket          │                    │
         │                                       │    └─────────────────────────────────┘                    │
         │                                       │                                                           │
         │<──(8) WebSocket "nueva-respuesta" ────│                                                           │
         │    {                                  │                                                           │
         │      "mensaje": "Sí, tenemos...",     │                                                           │
         │      "agente": "Ana López"            │                                                           │
         │    }                                  │                                                           │
         │                                       │                                                           │
         │──(9) Cliente ve respuesta ───────────>│                                                           │
         │    en el chat embebido                │                                                           │
         │                                       │                                                           │
```

---

## 📊 FLUJO 3: ESCENARIO CON LANDING PAGE CONTROLADA  

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                    ESCENARIO COMPLETO - LANDING PAGE CONTROLADA                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

PASO 1: PUBLICAS TU LANDING PAGE
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  www.tucrm.com/contacto                                                                    │
│                                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                                                                     │   │
│  │  📱 WHATSAPP                                                                        │   │
│  │  ┌────────────────────────────────────────────────────────────────────────────────┐ │   │
│  │  │  [ESCANEA QR]  o  [ABRIR CHAT EN ESTA VENTANA]                                 │ │   │
│  │  │                                                                                │ │   │
│  │  │  El chat se abre aquí mismo, con WebSockets en tiempo real                     │ │   │
│  │  └────────────────────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                                     │   │
│  │  ✉️ EMAIL                                                                          │    │
│  │  ┌────────────────────────────────────────────────────────────────────────────────┐ │   │
│  │  │  Tu email: [_______________]                                                   │ │   │
│  │  │  Asunto:   [_______________]                                                   │ │   │
│  │  │  Mensaje:  [_______________]                                                   │ │   │
│  │  │                                   [ENVIAR MENSAJE]                             │ │   │
│  │  └────────────────────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                                     │   │
│  │  💬 SMS                                                                            │   │
│  │  ┌────────────────────────────────────────────────────────────────────────────────┐ │   │
│  │  │  Tu número: [_______________]                                                  │ │   │
│  │  │  Mensaje:   [_______________]                                                  │ │   │
│  │  │                                   [ENVIAR SMS]                                 │ │   │
│  │  └────────────────────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ El cliente interactúa AQUÍ
                                    ▼
PASO 2: CLIENTE USA TUS CANALES CONTROLADOS
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  OPCIÓN A: WHATSAPP (Chat embebido con WebSocket)                                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │  1. Cliente escanea QR o hace clic en "Abrir chat"                                  │   │
│  │  2. Se abre una ventana de chat en la misma landing page                            │   │
│  │  3. Cliente escribe: "Hola, ¿tienen disponible el producto?"                        │   │
│  │  4. El mensaje viaja por WebSocket/API directa a TU backend                         │   │
│  │  5. El backend guarda, asigna agente, notifica                                      │   │
│  │  6. Agente responde desde CRM                                                       │   │
│  │  7. Respuesta viaja por WebSocket al chat del cliente                               │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                            │
│  OPCIÓN B: EMAIL (Formulario)                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │  1. Cliente rellena formulario: email, asunto, mensaje                              │   │
│  │  2. Al enviar, POST a /api/mensajes/email                                           │   │
│  │  3. El backend guarda, asigna agente, notifica                                      │   │
│  │  4. Agente responde desde CRM                                                       │   │
│  │  5. El backend envía email real con Nodemailer (Gmail)                              │   │
│  │  6. Cliente recibe email en su bandeja de Gmail/Outlook                             │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                            │
│  OPCIÓN C: SMS (Formulario)                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │  1. Cliente ingresa su número y mensaje                                             │   │
│  │  2. Al enviar, POST a /api/mensajes/sms                                             │   │
│  │  3. El backend guarda, asigna agente, notifica                                      │   │
│  │  4. Agente responde desde CRM                                                       │   │
│  │  5. El backend envía SMS real (requiere Twilio o similar, opcional)                 │   │
│  │  6. Cliente recibe SMS en su teléfono                                               │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ TODO llega directamente
                                    ▼
PASO 3: TU CRM RECIBE DIRECTAMENTE
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  ENDPOINTS QUE CREAS EN TU BACKEND:                                                         │
│                                                                                             │
│  POST /api/mensajes/whatsapp                                                                │
│  ├── Recibe: { remitente, mensaje, sessionId }                                              │
│  ├── Origen: Chat embebido en landing page                                                  │
│  └── Acción: Guarda en BD, asigna agente, guarda sessionId para responder                   │
│                                                                                             │
│  POST /api/mensajes/email                                                                   │
│  ├── Recibe: { email, asunto, mensaje, nombre? }                                            │
│  ├── Origen: Formulario de email en landing page                                            │
│  └── Acción: Guarda en BD, asigna agente, envía confirmación                                │
│                                                                                             │
│  POST /api/mensajes/sms                                                                     │
│  ├── Recibe: { telefono, mensaje }                                                          │
│  ├── Origen: Formulario de SMS en landing page                                              │
│  └── Acción: Guarda en BD, asigna agente, (opcional: enviar SMS real)                       │
│                                                                                             │
│  POST /api/mensajes/enviar (para respuestas del agente)                                     │
│  ├── Recibe: { contactoId, canal, contenido }                                               │
│  ├── Lógica:                                                                                │
│  │   ├── Guardar mensaje saliente en BD                                                     │
│  │   ├── Si canal = 'whatsapp': Emitir por WebSocket al cliente (usando sessionId)          │
│  │   ├── Si canal = 'email': Enviar con Nodemailer (Gmail)                                  │
│  │   └── Si canal = 'sms': Enviar con Twilio (si se configuró)                              │
│  └── Acción: Cliente recibe respuesta                                                       │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
PASO 4: PROCESAMIENTO NORMAL EN CRM
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  EL MISMO PROCESO PARA TODOS LOS CANALES:                                                   │
│                                                                                             │
│  1. Identificar o crear contacto                                                            │
│     • Buscar por teléfono (WhatsApp/SMS) o email (Email)                                    │
│     • Si no existe, crear con datos proporcionados                                          │
│                                                                                             │
│  2. Guardar mensaje en BD                                                                   │
│     • Contacto ID, canal, contenido, fecha, dirección 'entrante'                            │
│     • Para WhatsApp: guardar sessionId para poder responder luego                           │
│                                                                                             │
│  3. Verificar si ya tiene agente asignado                                                   │
│     • Buscar conversación activa del contacto                                               │
│     • Si existe, mantener mismo agente                                                      │
│     • Si no existe, ejecutar algoritmo de asignación                                        │
│                                                                                             │
│  4. Algoritmo de asignación inteligente                                                     │
│     • Filtrar agentes disponibles (horario, vacaciones, estado)                             │
│     • Evaluar capacidad (conversaciones activas < capacidad máxima)                         │
│     • Aplicar política (round-robin, load-balancing, skill-based)                           │
│     • Seleccionar mejor agente                                                              │
│                                                                                             │
│  5. Registrar asignación                                                                    │
│     • Actualizar conversación con agente_id                                                 │
│     • Incrementar contador de carga del agente                                              │
│     • Guardar fecha de asignación                                                           │
│                                                                                             │
│  6. Notificar al agente                                                                     │
│     • Emitir evento WebSocket al agente específico                                          │
│     • El agente ve notificación en su interfaz CRM                                          │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ La respuesta vuelve al cliente
                                    ▼
PASO 5: CLIENTE RECIBE RESPUESTA
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  DEPENDIENDO DEL CANAL:                                                                    │
│                                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │  WHATSAPP (Chat embebido)                                                           │   │
│  │  • La respuesta viaja por WebSocket                                                 │   │
│  │  • Aparece instantáneamente en la ventana de chat que el cliente tiene abierta      │   │
│  │  • El cliente puede seguir escribiendo                                              │   │
│  │  • Experiencia similar a WhatsApp Web                                               │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │  EMAIL                                                                              │   │
│  │  • La respuesta se envía como email real (Nodemailer + Gmail)                       │   │
│  │  • El cliente recibe en su bandeja de correo habitual (Gmail, Outlook)              │   │
│  │  • Puede responder desde su email, pero la respuesta volverá a entrar al CRM        │   │
│  │    (si configuraste IMAP para leer emails)                                          │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────────────────────┐   │
│  │  SMS                                                                                │   │
│  │  • La respuesta se envía como SMS real (requiere Twilio o similar)                  │   │
│  │  • El cliente recibe en su teléfono como mensaje de texto normal                    │   │
│  │  • Costo asociado por SMS enviado                                                   │   │
│  └─────────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 RESUMEN DE ENDPOINTS  

| Endpoint | Origen | Método | Datos que recibe | Acción |
|----------|--------|--------|------------------|--------|
| `/api/mensajes/whatsapp` | Chat embebido (QR) | POST | remitente, mensaje, sessionId | Guarda, asigna, notifica |
| `/api/mensajes/email` | Formulario email | POST | email, asunto, mensaje | Guarda, asigna, notifica |
| `/api/mensajes/sms` | Formulario SMS | POST | telefono, mensaje | Guarda, asigna, notifica |
| `/api/mensajes/enviar` | Respuesta agente | POST | contactoId, canal, contenido | Guarda respuesta, envía al cliente |

---

 
## ⚠️ CONSIDERACIONES IMPORTANTES

| Canal | Limitación | Mitigación |
|-------|------------|------------|
| **WhatsApp** | El cliente debe tener la landing page abierta para recibir respuestas | El chat embebido mantiene conexión WebSocket; si cierra, pierde la sesión |
| **Email** | No es tiempo real (el cliente recibe por email normal) | Puedes agregar Brevo después para tiempo real |
| **SMS** | Para enviar SMS reales necesitas Twilio (costo) | Usa WhatsApp como canal principal, SMS solo opcional |

 
