# Data Model - Startup CRM

## Entidades Principales

### User (Better Auth)

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
}
```

### Session (Better Auth)

```typescript
export interface Session {
  id: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Account (Better Auth)

```typescript
export interface Account {
  id: string;
  userId: string;
  provider: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
}
```

### Contact

```typescript
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  stage: FunnelStage;
  tags: string[];
  lastContact: string;
  avatar?: string;
  notes?: string;
}

export type FunnelStage = 
  | "new"           // Nuevo lead
  | "contacted"    // Contactado
  | "qualified"     // Calificado
  | "proposal"     // Propuesta enviada
  | "won"          // Ganado
  | "lost";        // Perdido
```

### WhatsAppMessage

```typescript
export interface WhatsAppMessage {
  id: string;
  contactId: string;
  text: string;
  timestamp: string;
  sent: boolean;
}
```

### EmailMessage

```typescript
export interface EmailMessage {
  id: string;
  contactId: string;
  subject: string;
  body: string;
  timestamp: string;
  sent: boolean;
  read: boolean;
  labels: string[];
}
```

### Reminder

```typescript
export interface Reminder {
  id: string;
  contactId: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  priority: ReminderPriority;
  status: ReminderStatus;
  notifications: ReminderNotification[];
  createdAt: string;
}

export type ReminderPriority = "low" | "medium" | "high";
export type ReminderStatus = "pending" | "completed" | "overdue";
```

### EmailTemplate

```typescript
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}
```

### ReminderNotification

```typescript
export interface ReminderNotification {
  type: "email" | "sms" | "whatsapp" | "push";
  enabled: boolean;
}
```

---

## Constantes de Datos

### Stage Labels

```typescript
export const stageLabels: Record<FunnelStage, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  proposal: "Propuesta",
  won: "Ganado",
  lost: "Perdido",
};
```

### Stage Colors

```typescript
export const stageColors: Record<FunnelStage, string> = {
  new: "funnel-new",
  contacted: "funnel-contacted",
  qualified: "funnel-qualified",
  proposal: "funnel-proposal",
  won: "funnel-won",
  lost: "funnel-lost",
};
```

### Priority Labels

```typescript
export const priorityLabels: Record<ReminderPriority, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};
```

---

## Colecciones de Datos Mock

| Colección | Ubicación | Descripción |
|-----------|-----------|-------------|
| `contacts` | `lib/data/mockData.ts` | 8 contactos ejemplo |
| `whatsappMessages` | `lib/data/mockData.ts` | Mensajes por contactId |
| `emailMessages` | `lib/data/mockData.ts` | Emails por contactId |
| `emailTemplates` | `lib/data/mockData.ts` | 3 plantillas predefinidas |
| `reminders` | `lib/data/mockData.ts` | 6 recordatorios ejemplo |

---

## Diagrama de Relaciones

```
┌─────────────┐       ┌─────────────────┐
│   Contact    │───────│ WhatsAppMessage │
└──────┬──────┘       └─────────────────┘
       │
       ├───────────────┬─────────────────┐
       │               │                 │
       ▼               ▼                 ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ EmailMessage │ │  Reminder   │ │EmailTemplate│
└─────────────┘ └─────────────┘ └─────────────┘
```

---

## Tipos de Email (API)

```typescript
// Envío de email
export interface SendEmailPayload {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  contactId?: number;
  templateId?: string;
  metadata?: Record<string, string>;
}

// Respuesta de envío
export interface SendEmailResult {
  status: "sent" | "failed";
  provider: "smtp";
  messageId?: string;
  error?: string;
}

// Email recibido
export interface ReceivedEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  read: boolean;
  attachments: string[];
}

// Detalle de email
export interface ReceivedEmailDetail {
  id: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  body: {
    text: string;
    html: string;
  };
  read: boolean;
  attachments: Array<{
    filename: string;
    contentType: string;
    size: number;
  }>;
}
```

---

**Volver a**: [Índice de Arquitectura](../architecture.md)
