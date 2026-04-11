# Design: Email Detail View - Show Email Body

## Approach
Al hacer click en un email recibido, verificar si tiene messageId y si le falta el body. Si es así, llamar al endpoint para obtener el contenido completo.

## Implementation Details

### 1. Tipo ReceivedEmailData actualizado
```typescript
interface ReceivedEmailData {
  from: string;
  subject: string;
  date?: string;
  seen: boolean;
  messageId?: string;
  body?: string;
  html?: string;
}
```

### 2. Estados adicionales
```typescript
const [loadingBody, setLoadingBody] = useState(false);
```

### 3. Lógica al hacer click
```typescript
const handleEmailClick = (email: EmailMessage) => {
  setSelectedEmail(email);
  setShowCompose(false);
  
  // Si es email recibido sin body, obtenerlo
  if (!email.sent && email.messageId && !email.body && !email.html) {
    loadEmailBody(email.messageId);
  }
};

const loadEmailBody = async (messageId: string) => {
  setLoadingBody(true);
  try {
    const res = await fetch("/api/email/receiveOne", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId }),
    });
    const data = await res.json();
    if (data.email?.[0]) {
      const fullEmail = data.email[0];
      // Actualizar el email en receivedEmails con el body
      setReceivedEmails(prev => prev.map(r => 
        r.messageId === messageId 
          ? { ...r, body: fullEmail.text || "", html: fullEmail.html } 
          : r
      ));
    }
  } catch (err) {
    console.error("Error loading email body:", err);
  } finally {
    setLoadingBody(false);
  }
};
```

### 4. Mostrar cuerpo en panel de detalle
- Si `loadingBody` es true: mostrar spinner + "Cargando..."
- Si existe `html`: sanitizar con DOMPurify y renderizar con `dangerouslySetInnerHTML`
- Si existe `body`: mostrar texto plano
- Estilos CSS para contenido HTML del email (imágenes, tablas, enlaces, blockquotes, código)

```typescript
import DOMPurify from "dompurify";

// En el render:
{loadingEmailBody ? (
  <div className="flex items-center justify-center h-full">
    <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />
    <span className="ml-2 text-sm text-muted-foreground">Cargando...</span>
  </div>
) : selectedEmail.html ? (
  <div className="email-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedEmail.html || "") }} />
) : (
  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedEmail.body}</p>
)}
```

### 5. Estilos CSS para contenido HTML del email (globals.css)
```css
.email-content img { max-width: 100%; height: auto; }
.email-content table { width: 100%; border-collapse; }
.email-content th, td { border: 1px solid; padding: 8px; }
.email-content a { color: blue; text-decoration: underline; }
.email-content blockquote { border-left: 4px solid; padding-left: 12px; }
.email-content pre { background: #f5f5f5; padding: 12px; overflow-x: auto; }
```

### 6. Paginación服务端 con offset/limit
- El endpoint GET `/api/email/receive` acepta parámetros `limit` y `offset`
- Por defecto: limit=20, offset=0
- Máximo: 100 emails

```typescript
// Frontend states
const [emailOffset, setEmailOffset] = useState(0);
const [hasMoreEmails, setHasMoreEmails] = useState(true);
const EMAIL_LIMIT = 20;

// URL con parámetros
const url = `/api/email/receive?limit=${EMAIL_LIMIT}&offset=${emailOffset}`;
```

### 7. IMAP Service - Ordenamiento
- Los IDs de Gmail vienen en orden ascendente (más antiguos primero)
- Invertir el array para tener los más recientes primero

```typescript
const reversed = all.slice().reverse();
const ids = reversed.slice(offset, offset + limit);
```

### 8. Carga infinita en frontend
- Botón "Cargar más correos" debajo de la lista
- Incrementa el offset: `setEmailOffset(prev => prev + EMAIL_LIMIT)`
- Actualiza `hasMoreEmails` basado en si el servidor devuelve menos de `limit` emails

## Components Modified
- `app/(crm)/email/page.tsx` - agregar messageId, estados, lógica de carga, renderizado

## Testing
- Click en email con messageId → llama a receiveOne
- Panel muestra "Cargando..." mientras obtiene body
- Después de obtener, muestra contenido (html o text)
- Email sin messageId o sent → muestra body directo