# Design: Email Receive Integration

## Approach
Modificar `app/(crm)/email/page.tsx` para integrar correos recibidos del endpoint y combinarlos con los emails existentes.

## Implementation Details

### 1. Tipos
```typescript
interface ReceivedEmailData {
  from: string;
  subject: string;
  date?: string;
  seen: boolean;
}
```

### 2. Estados
```typescript
const [receivedEmails, setReceivedEmails] = useState<ReceivedEmailData[]>([]);
const [isLoadingInbox, setIsLoadingInbox] = useState(false);
```

### 3. Fetch al Endpoint
```typescript
const loadReceivedEmails = async () => {
  setIsLoadingInbox(true);
  try {
    const res = await fetch("/api/email/receive");
    const data = await res.json();
    if (data.emails) {
      setReceivedEmails(data.emails);
    }
  } catch (error) {
    console.error("Error loading emails:", error);
  } finally {
    setIsLoadingInbox(false);
  }
};

useEffect(() => { loadReceivedEmails(); }, []);
```

### 4. Combinar Emails
```typescript
const allEmailsWithReceived: EmailMessage[] = [
  ...allEmails,
  ...receivedEmails.map((r, i) => ({
    id: `received-${i}`,
    contactId: "",
    subject: r.subject,
    body: "",
    timestamp: r.date || new Date().toISOString(),
    read: r.seen,
    sent: false,
    labels: [],
    from: r.from,
  })),
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
```

### 5. Estilos para Leídos/No Leídos
- **No leídos** (`!email.read && !email.sent`): `font-semibold`
- **Leídos**: `font-medium`

```typescript
<span className={`text-sm truncate ${!email.read && !email.sent ? "font-semibold" : "font-medium"}`}>
```

### 6. Display del Remitente
- Si hay contacto vinculado: mostrar nombre
- Si no: mostrar email `from`

```typescript
const displayName = email.sent 
  ? `Para: ${contact?.name || email.from || "Desconocido"}` 
  : (contact?.name || email.from || "Desconocido");
```

### 7. Paginación
- Estados: `currentPage` (default 1), `pageSize` (default 10)
- Combo para elegir: 10, 20, 30, 50
- Botones: primera (ChevronsLeft), anterior (ChevronLeft), siguiente (ChevronRight), última (ChevronsRight)
- Reset a página 1 al cambiar pageSize o search
- Mostrar "X/Total" en footer

```typescript
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

const totalPages = Math.ceil(filteredEmails.length / pageSize);
const paginatedEmails = filteredEmails.slice((currentPage - 1) * pageSize, currentPage * pageSize);

const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

useEffect(() => { setCurrentPage(1); }, [pageSize, search]);
```

## Components Modified
- `app/(crm)/email/page.tsx` - agregar estados, fetch, combinar emails
- `app/api/email/receive/route.ts` - agregar método GET

## Testing
- Refresh de bandeja muestra emails del servidor
- Emails no leídos en bold
- Emails leídos en texto normal
- Remitente mostrado si no hay contacto vinculado