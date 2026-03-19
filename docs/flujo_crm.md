EL FLUJO COMPLETO DE ASIGNACIÓN DE CONVERSACIONES

1️⃣ CLIENTE ENVÍA MENSAJE
   ↓
2️⃣ CRM RECIBE WEBHOOK
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

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  FLUJO DE ASIGNACIÓN INTELIGENTE DE AGENTES                     │
└─────────────────────────────────────────────────────────────────────────────────┘

CLIENTE                    CRM (BACKEND)                       SISTEMA DE ASIGNACIÓN                    AGENTES
   │                              │                                      │                                   │
   │──(1) Envía consulta ─────────>│                                      │                                   │
   │    (WhatsApp/Email)           │                                      │                                   │
   │                              │                                      │                                   │
   │                              │──(2) Webhook ──────────────────────>│                                   │
   │                              │    "Nuevo mensaje"                   │                                   │
   │                              │                                      │                                   │
   │                              │                                      │──(3) EJECUTA ALGORITMO ─────────┐
   │                              │                                      │    DE ASIGNACIÓN                 │
   │                              │                                      │    • Filtra agentes disponibles  │
   │                              │                                      │    • Verifica capacidad          │
   │                              │                                      │    • Calcula carga actual        │
   │                              │                                      │    • Aplica política (RR/balance)│
   │                              │                                      │    • Selecciona mejor agente     │
   │                              │                                      │                                   │
   │                              │<──(4) Agente asignado ───────────────│                                   │
   │                              │    "ana@empresa.com"                 │                                   │
   │                              │                                      │                                   │
   │                              │──(5) Notifica agente ─────────────────────────────────────────────────>│
   │                              │    vía WebSocket                     │                                   │
   │                              │                                      │                                   │
   │                              │                                      │                                   │──(6) Agente recibe
   │                              │                                      │                                   │    notificación
   │                              │                                      │                                   │    y abre conversación


    ´´´ 
```text
    ┌─────────────────────────────────────────────────────────────────────────────┐
│                    FLUJO DE DATOS DEL CRM - VISTA COMPLETA                  │
└─────────────────────────────────────────────────────────────────────────────┘

CLIENTE                           PROVEEDOR                          CRM (BACKEND)                          AGENTE (FRONTEND)
   │                                    │                                    │                                      │
   │──(1) Inicia contacto────┐          │                                    │                                      │
   │    • WhatsApp           │          │                                    │                                      │
   │    • Email              │          │                                    │                                      │
   │    • Widget web         │          │                                    │                                      │
   │                        ▼          │                                    │                                      │
   │                    ┌──────────┐    │                                    │                                      │
   │                    │ Brevo/   │    │                                    │                                      │
   │                    │ Twilio/  │    │                                    │                                      │
   │                    │ Evolution│    │                                    │                                      │
   │                    └────┬─────┘    │                                    │                                      │
   │                         │          │                                    │                                      │
   │                         │──(2) Webhook ─────────────────────────────────┼──────────────────┐                │
   │                         │          │    POST /webhooks/whatsapp/email   │                  │                │
   │                         │          │    {                                │                  │                │
   │                         │          │      "mensaje": "Hola, ¿precios?", │                  │                │
   │                         │          │      "remitente": "+51987654321",  │                  │                │
   │                         │          │      "canal": "whatsapp",          │                  │                │
   │                         │          │      "fecha": "2024-03-19T10:30"   │                  │                │
   │                         │          │    }                                │                  │                │
   │                         │          │                                    │                  │                │
   │                         │          │    ┌─────────────────────────────┐ │                  │                │
   │                         │          │    │ PROCESAR WEBHOOK            │ │                  │                │
   │                         │          │    │ • Validar integridad        │ │                  │                │
   │                         │          │    │ • Identificar/crear contacto│ │                  │                │
   │                         │          │    │ • Guardar mensaje en BD     │ │                  │                │
   │                         │          │    │ • Emitir evento WebSocket   │ │                  │                │
   │                         │          │    └─────────────────────────────┘ │                  │                │
   │                         │          │                                    │                  │                │
   │                         │          │                                    │──(3) WebSocket────┼──┐             │
   │                         │          │                                    │    "nuevo-mensaje"│  │             │
   │                         │          │                                    │◀──────────────────┘  │             │
   │                         │          │                                    │                      │             │
   │                         │          │                                    │                      ▼             │
   │                         │          │                                    │    ┌─────────────────────────────┐ │
   │                         │          │                                    │    │ INTERFAZ AGENTE            │ │
   │                         │          │                                    │    │                             │ │
   │                         │          │                                    │    │  🔔 NUEVO MENSAJE           │ │
   │                         │          │                                    │    │  Carlos Ríos: "Hola..."    │ │
   │                         │          │                                    │    │  [Ver conversación]         │ │
   │                         │          │                                    │    └─────────────────────────────┘ │
   │                         │          │                                    │                      │             │
   │                         │          │                                    │                      │             │
   │                         │          │                                    │                      │──(4) Abre   │
   │                         │          │                                    │                      │    conversación
   │                         │          │                                    │                      ▼             │
   │                         │          │                                    │    ┌─────────────────────────────┐ │
   │                         │          │                                    │    │ VISTA CONVERSACIÓN         │ │
   │                         │          │                                    │    │                             │ │
   │                         │          │                                    │    │ 👤 Carlos Ríos             │ │
   │                         │          │                                    │    │ 📱 +51 987 654 321         │ │
   │                         │          │                                    │    │ ✉️ carlos@empresa.com      │ │
   │                         │          │                                    │    │                             │ │
   │                         │          │                                    │    │ [10:30] Cliente: Hola,     │ │
   │                         │          │                                    │    │         ¿tienen disponible?│ │
   │                         │          │                                    │    │                             │ │
   │                         │          │                                    │    │ [✏️ Escribir respuesta...]  │ │
   │                         │          │                                    │    │    [📎 Adjuntar] [📤 Enviar]│ │
   │                         │          │                                    │    └─────────────────────────────┘ │
   │                         │          │                                    │                      │             │
   │                         │          │                                    │                      │──(5) Escribe │
   │                         │          │                                    │                      │    respuesta
   │                         │          │                                    │                      ▼             │
   │                         │          │                                    │    "Sí, tenemos disponibilidad.   │
   │                         │          │                                    │     ¿Te envío la propuesta?"      │
   │                         │          │                                    │                      │             │
   │                         │          │                                    │──(6) API Enviar ────┼──┐          │
   │                         │          │    POST /api/whatsapp/send         │    mensaje          │  │          │
   │                         │          │    {                               │◀────────────────────┘  │          │
   │                         │          │      "telefono": "+51987654321",   │                        │          │
   │                         │          │      "mensaje": "Sí, tenemos...",  │                        │          │
   │                         │          │      "adjuntos": []                │                        │          │
   │                         │          │    }                               │                        │          │
   │                         │          │                                    │                        │          │
   │                         │          │    ┌─────────────────────────────┐ │                        │          │
   │                         │          │    │ GUARDAR EN BD               │ │                        │          │
   │                         │          │    │ • Insert en tabla mensajes  │ │                        │          │
   │                         │          │    │   contacto_id: 123          │ │                        │          │
   │                         │          │    │   canal: 'whatsapp'         │ │                        │          │
   │                         │          │    │   contenido: "Sí tenemos..."│ │                        │          │
   │                         │          │    │   direccion: 'saliente'     │ │                        │          │
   │                         │          │    │   fecha: now()              │ │                        │          │
   │                         │          │    └─────────────────────────────┘ │                        │          │
   │                         │          │                                    │                        │          │
   │                         │──(7) Reenvía respuesta ───────────────────────┼────────────────────────┘          │
   │    "Sí, tenemos..."     │          │                                    │                                   │
   │◀────────────────────────┘          │                                    │                                   │
   │                                    │                                    │                                   │
   │                                    │                                    │                                   │
   ```