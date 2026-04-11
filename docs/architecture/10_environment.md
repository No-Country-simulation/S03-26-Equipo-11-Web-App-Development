# Environment Variables - Startup CRM

## Variables Requeridas

### Email (SMTP/IMAP)

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# IMAP Configuration
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_USER=your_email@gmail.com
IMAP_PASS=your_app_password

# Email Defaults
FROM_EMAIL=your_email@gmail.com
FROM_NAME=Startup CRM
```

### Aplicacion

```env
# Production URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=UA-XXXXXXXXX-X

# Optional: Feature Flags
NEXT_PUBLIC_ENABLE_DARK_MODE=true
```

---

## Integraciones Externas

### WhatsApp Cloud API (Meta)

```env
# WhatsApp API Configuration (Futuro)
WHATSAPP_API_TOKEN=your-whatsapp-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_WEBHOOK_URL=https://your-domain.com/api/whatsapp/webhook
```

---

## Configuracion de Gmail

### 1. Habilitar 2FA en tu cuenta de Google

1. Ve a Mi Cuenta de Google
2. Seguridad - Verificacion en dos pasos

### 2. Crear contrasena de aplicacion

1. Seguridad - Contrasenas de aplicaciones
2. Seleccionar app: "Correo"
3. Seleccionar dispositivo: "Otro (Nombre personalizado)"
4. Copiar la contrasena generada (16 caracteres)

### 3. Usar la contrasena de aplicacion

```env
SMTP_PASS=abcd efgh ijkl mnop
IMAP_PASS=abcd efgh ijkl mnop
```

---

## Variables Opcionales (Futuro)

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/crm

# Redis Cache
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
```

---

## Archivo .env.example

```env
# ===========================================
# Startup CRM - Environment Variables
# ===========================================

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# IMAP Configuration
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_USER=your_email@gmail.com
IMAP_PASS=your_app_password

# Email Defaults
FROM_EMAIL=your_email@gmail.com
FROM_NAME=Startup CRM

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Acceso en Codigo

```typescript
// Server-side (API routes, Server Components)
const smtpHost = process.env.SMTP_HOST;

// Client-side (solo variables NEXT_PUBLIC_*)
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
```

---

**Volver a**: [Indice de Arquitectura](../architecture.md)
