# Data Flows - Next.js CRM

## Flujo de Datos General

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Client    │────▶│   Next.js    │────▶│   Browser    │
│   (React)   │◀────│   Server    │◀────│   (Render)   │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
        ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
        │  Mock     │ │   API    │ │ External  │
        │  Data     │ │ Routes   │ │ Services  │
        └───────────┘ └─────┬─────┘ └───────────┘
                            │
                    ┌───────▼───────┐
                    │  Email SMTP/  │
                    │    IMAP      │
                    └──────────────┘
```

---

## Flujo: Gestión de Contactos

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTACT MANAGEMENT                       │
└─────────────────────────────────────────────────────────────┘

1. Visualización de Contactos
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Page     │────▶│ useState │────▶│ MockData │────▶│ Render   │
   │ Load     │     │(contacts)│     │ Import   │     │ Table    │
   └──────────┘     └──────────┘     └──────────┘     └──────────┘

2. Agregar Contacto
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Dialog   │────▶│ Form     │────▶│ setState │────▶│ Re-render│
   │ Submit   │     │ Validate │     │ (new list)│    │ Table    │
   └──────────┘     └──────────┘     └──────────┘     └──────────┘

3. Filtrar por Stage
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Filter   │────▶│ filter() │────▶│ useMemo  │────▶│ Render   │
   │ Select   │     │ contacts │     │ computed │     │ filtered │
   └──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### Código de Ejemplo

```typescript
// app/(crm)/contacts/page.tsx
"use client";

import { useState, useMemo } from "react";
import { contacts, type Contact, type FunnelStage } from "@/lib/data/mockData";

export default function ContactsPage() {
  const [stageFilter, setStageFilter] = useState<FunnelStage | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      const matchesStage = stageFilter === "all" || contact.stage === stageFilter;
      const matchesSearch =
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStage && matchesSearch;
    });
  }, [stageFilter, searchQuery]);

  return (
    <>
      {/* Filter UI */}
      <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value as FunnelStage | "all")}>
        <option value="all">Todos</option>
        <option value="new">Nuevo</option>
        {/* ... */}
      </select>
      
      {/* Contacts Table */}
      <table>
        {filteredContacts.map((contact) => (
          <ContactRow key={contact.id} contact={contact} />
        ))}
      </table>
    </>
  );
}
```

---

## Flujo: Envío de Email

```
┌─────────────────────────────────────────────────────────────┐
│                      EMAIL SENDING                          │
└─────────────────────────────────────────────────────────────┘

1. Usuario redacta email
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Compose  │────▶│ Form     │────▶│ Validate │
   │ Dialog   │     │ State    │     │ Fields   │
   └──────────┘     └──────────┘     └──────────┘

2. Envío a API
   ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Submit   │────▶│ fetch()  │────▶│ POST     │────▶│ Server   │
   │ Button   │     │ /api/... │     │ /email/  │     │ Handler  │
   └──────────┘     └──────────┘     │ send     │     └────┬─────┘
                                       └──────────┘          │
                                                          ┌───▼───┐
                                                          │ SMTP  │
                                                          │ Send  │
                                                          └───┬───┘
                                                              │
3. Respuesta
   ┌──────────┐     ┌──────────┐     ┌──────────┐
   │ Success  │◀────│ JSON     │◀────│ Response │
   │ Toast    │     │ Response │     │          │
   └──────────┘     └──────────┘     └──────────┘
```

### Código de Ejemplo

```typescript
// Client Component
async function sendEmail(payload: SendEmailPayload) {
  const response = await fetch("/api/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  return response.json();
}

// API Route
export async function POST(request: Request) {
  const body = await request.json();
  const result = await emailService.sendEmail(body);
  return NextResponse.json(result);
}

// Service
export async function sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Boolean(process.env.SMTP_SECURE),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    
    return { status: "sent", provider: "smtp" };
  } catch (error) {
    return { status: "failed", provider: "smtp", error: error.message };
  }
}
```

---

## Flujo: Dashboard Analytics

```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD DATA FLOW                       │
└─────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ MockData │────▶│ useMemo   │────▶│ Computed │────▶│ Charts   │
│ Import   │     │ Derived   │     │ Stats    │     │ Render   │
└──────────┘     │ Stats     │     │          │     │          │
                 └──────────┘     └──────────┘     └──────────┘

KPI Calculations:
┌──────────────────────────────────────────────────────────────┐
│ Contacts KPI = contacts.length                               │
│ Messages KPI = whatsappMessages.reduce((sum, m) => ...)   │
│ Emails KPI = emailMessages.reduce((sum, e) => ...)           │
│ Response Rate = (responded / total) * 100                    │
└──────────────────────────────────────────────────────────────┘

Chart Data:
┌──────────────────────────────────────────────────────────────┐
│ Funnel Data = Object.groupBy(contacts, c => c.stage)        │
│ Channel Distribution = count by channel                      │
│ Weekly Activity = group by date                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Flujo: WhatsApp Messages

```
┌─────────────────────────────────────────────────────────────┐
│                   WHATSAPP MESSAGING                         │
└─────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Contact  │────▶│ Message   │────▶│ Store in │────▶│ UI Update│
│ Select   │     │ Input     │     │ State    │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘

┌─────────────────────────────────────────────────────────────┐
│ WhatsAppMessage Interface:                                  │
│ { id, contactId, text, timestamp, sent }                    │
└─────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐
│ Sent Msgs│────▶│ Filter by │────▶│ Render   │
│ (all)    │     │ contactId │     │ Chat    │
└──────────┘     └──────────┘     └──────────┘
```

---

## Flujo: Recordatorios

```
┌─────────────────────────────────────────────────────────────┐
│                    REMINDERS FLOW                             │
└─────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐
│ Load     │────▶│ Filter   │────▶│ Render   │
│ Reminders│     │ by Status│     │ Cards    │
└──────────┘     └──────────┘     └──────────┘

Status Transitions:
┌──────────────────────────────────────────────────────────────┐
│ pending ───▶ (mark complete) ───▶ completed                  │
│ pending ───▶ (past due date) ───▶ overdue                   │
└──────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ Create   │────▶│ Add to   │────▶│ Sort by  │────▶│ Display  │
│ Form     │     │ State    │     │ Priority │     │ Cards    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

---

**Volver a**: [Índice de Arquitectura](../architecture.md)
