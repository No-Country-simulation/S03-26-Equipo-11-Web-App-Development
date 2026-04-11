# Design: Email Reply Feature

## Approach
Al hacer click en "Responder", cambiar el estado `showCompose` a true y prellenar los campos del formulario con los datos del email seleccionado.

## Implementation Details

### 1. Estados adicionales necesarios
```typescript
const [replyMode, setReplyMode] = useState(false); // para título dinámico
```

### 2. Función handleReply
```typescript
const handleReply = (email: EmailMessage) => {
  // Extraer email del remitente
  const fromEmail = extractEmail(email.from || "");
  
  // Prellenar campos
  setComposeTo(fromEmail);
  setComposeSubject(`Re: ${email.subject}`);
  setComposeBody(`\n\n--- Mensaje original ---\n${email.from}\n${formatDate(email.timestamp)}\n\n${email.body || ""}`);
  
  setReplyMode(true);
  setShowCompose(true);
};

// Función auxiliar para extraer email de "Nombre <email>"
const extractEmail = (from: string): string => {
  const match = from.match(/<([^>]+)>/);
  return match ? match[1] : from;
};
```

### 3. Título dinámico en el formulario
```tsx
<h2 className="font-semibold text-lg">
  {replyMode ? "Responder correo" : "Nuevo correo"}
</h2>
```

### 4. Limpiar replyMode al cerrar abrir compose nuevo
```typescript
// Al abrir compose sin ser reply (botón "+ Nuevo")
const openNewCompose = () => {
  setComposeTo("");
  setComposeSubject("");
  setComposeBody("");
  setReplyMode(false);
  setShowCompose(true);
};
```

### 5. Envío del formulario (ya existe handleSend)
- Reutiliza el mismo `handleSend` que envía a `/api/email/send`
- Muestra toast de éxito o error

## Components Modified
- `app/(crm)/email/page.tsx` - agregar estados, funciones, modificar UI

## Testing
- Click en "Responder" → formulario prellenado
- Título muestra "Responder correo"
- Enviar → toast éxito
- Error → toast error
- "+ Nuevo" → formulario limpio, título "Nuevo correo"