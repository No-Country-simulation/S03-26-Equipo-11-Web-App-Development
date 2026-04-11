# Design: Connect Email Form to API

## Approach
Modificar `app/(crm)/email/page.tsx` para integrar el formulario con el endpoint existente.

## Implementation Details

### 1. Validación de Campos
```typescript
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForm = (): boolean => {
  const newErrors: { to?: string; subject?: string } = {};
  if (!composeTo.trim()) {
    newErrors.to = "El correo es requerido";
  } else if (!EMAIL_REGEX.test(composeTo.trim())) {
    newErrors.to = "Correo inválido";
  }
  if (!composeSubject.trim()) {
    newErrors.subject = "El asunto es requerido";
  }
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

### 2. Manejo de Estado
- `isLoading: boolean` - controla estado de carga
- `errors: { to?: string; subject?: string }` - errores inline
- `toast: { open, type, message }` - feedback visual

### 3. Fetch al Endpoint
```typescript
const handleSend = async () => {
  if (!validateForm()) return;
  
  setIsLoading(true);
  try {
    const res = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: composeTo.trim(), subject: composeSubject.trim(), text: composeBody }),
    });
    const data = await res.json();
    
    if (res.ok && data.status !== "failed") {
      // Success: toast + limpiar formulario
    } else {
      // Error: toast con mensaje
    }
  } catch {
    // Error de conexión
  } finally {
    setIsLoading(false);
  }
};
```

### 4. UI del Formulario
- Input "Para:" con validación inline
- Input "Asunto" con validación inline
- Textarea para body (sin validación requerida)
- Botón "Enviar" con disabled={isLoading}

### 5. Toast Component
- Usar componente Toast existente
- Verde para éxito, rojo para error
- Auto-close después de unos segundos

## Components Modified
- `app/(crm)/email/page.tsx` - agregar validación, fetch, estados, toast

## Testing
- Probar con email válido → éxito
- Probar con email inválido → error inline
- Probar con campos vacíos → errores inline
- Probar sin conexión → error de conexión