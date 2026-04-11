# Patterns & Conventions - Next.js CRM

## Convenciones de Nomenclatura

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Componentes | PascalCase | `ContactRow`, `HeroSection` |
| Archivos de componentes | kebab-case | `email-service.ts`, `mock-data.ts` |
| Funciones | camelCase | `exportContactsCSV`, `sendEmail` |
| Tipos/Interfaces | PascalCase | `Contact`, `FunnelStage` |
| Clases CSS | kebab-case | `sidebar-link`, `funnel-badge` |
| Constantes | camelCase | `stageLabels`, `priorityColors` |
| Rutas/URLs | kebab-case | `/email-settings`, `/sales-funnel` |

---

## Orden de Imports

```typescript
// 1. React
import * as React from "react";

// 2. Next.js
import { NextResponse } from "next/server";
import Link from "next/link";

// 3. Librerías de terceros
import { Search, Plus } from "lucide-react";
import { BarChart, Bar } from "recharts";

// 4. Componentes UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// 5. Librerías internas
import { contacts, type Contact } from "@/lib/data/mockData";
import { sendEmail } from "@/lib/email/emailService";

// 6. Imports relativos
import { formatDate } from "../utils";
```

---

## Patrón de Componentes UI

### ForwardRef con Props Interface

```typescript
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn("base-classes", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
```

### Composición con Radix UI

```typescript
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogPrimitive.Content
      ref={ref}
      className={cn("dialog-content-classes", className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="dialog-close-classes">
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

export { Dialog, DialogTrigger, DialogContent, DialogClose };
```

---

## Patrones de API Routes

### Manejo de Errores

```typescript
export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    
    if (!bodyText) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    let bodyJson: unknown;
    try {
      bodyJson = JSON.parse(bodyText);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const { to, subject } = bodyJson as Record<string, unknown>;
    
    if (!to || typeof to !== "string" || !to.includes("@")) {
      return NextResponse.json(
        { error: "Invalid 'to' email address" },
        { status: 400 }
      );
    }

    const result = await emailService.sendEmail({ to, subject });
    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

---

## Patrones de Hooks

```typescript
"use client";

import { useState, useCallback } from "react";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const addContact = useCallback(async (contact: Omit<Contact, "id">) => {
    // Implementation
  }, []);

  return { contacts, loading, error, fetchContacts, addContact };
}
```

---

## Patrones de Estilos

### Clases CSS Personalizadas

```css
/* app/globals.css */
@layer components {
  .sidebar-link {
    @apply flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium;
    @apply text-muted-foreground hover:bg-accent hover:text-accent-foreground;
    @apply transition-colors;
  }

  .funnel-badge {
    @apply inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium;
  }

  .kpi-card {
    @apply min-w-0 rounded-xl border bg-card p-5 shadow-sm;
  }
}
```

### Clases Condicionales

```typescript
import { cn } from "@/lib/utils";

const classes = cn(
  "base-class",
  condition && "conditional-class",
  !isActive && "inactive-class",
  variant === "primary" && "primary-class"
);
```

---

## Patrones de Types

### Union Types

```typescript
export type FunnelStage = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export type ReminderPriority = "low" | "medium" | "high";

export type ReminderStatus = "pending" | "completed" | "overdue";
```

### Utility Types

```typescript
// Crear tipo parcial
type PartialContact = Partial<Contact>;

// Seleccionar campos específicos
type ContactSummary = Pick<Contact, "id" | "name" | "email">;

// Omitir campos
type ContactCreate = Omit<Contact, "id" | "createdAt">;
```

---

**Volver a**: [Índice de Arquitectura](../architecture.md)
