# Runbook: Configuracion de Variables de Entorno

Guia completa para configurar todas las variables de entorno en Startup CRM.

---

## Variables Requeridas

### Email (SMTP/IMAP)

#### SMTP_HOST

```env
SMTP_HOST=smtp.gmail.com
```

| Valor | Uso |
|-------|-----|
| `smtp.gmail.com` | Gmail standard |
| `smtp-mail.outlook.com` | Outlook |
| `smtp.mail.yahoo.com` | Yahoo |
| `smtp-relay.gmail.com` | Gmail con dominio personalizado |

#### SMTP_PORT

```env
SMTP_PORT=465
```

| Puerto | Secure | Uso |
|--------|--------|-----|
| `465` | Yes (SSL) | Gmail standard |
| `587` | No (TLS) | Alternative |
| `25` | No | Rare, generalmente bloqueado |

#### SMTP_SECURE

```env
SMTP_SECURE=true
```

| Valor | Cuando usar |
|-------|-------------|
| `true` | Puerto 465 (SSL) |
| `false` | Puerto 587 (STARTTLS) |

#### SMTP_USER / SMTP_PASS

```env
SMTP_USER=tu_email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

> **Importante:** Usar contrasena de aplicacion, NO tu contrasena normal

#### IMAP_HOST / IMAP_PORT

```env
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
```

| Servicio | IMAP_HOST | IMAP_PORT |
|----------|-----------|-----------|
| Gmail | `imap.gmail.com` | `993` |
| Outlook | `outlook.office365.com` | `993` |
| Yahoo | `imap.mail.yahoo.com` | `993` |

#### FROM_EMAIL / FROM_NAME

```env
FROM_EMAIL=tu_email@gmail.com
FROM_NAME=Startup CRM
```

Email que aparece como remitente.

---

## Variables Opcionales

### NEXT_PUBLIC_APP_URL

```env
# Desarrollo
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Produccion
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
```

### Analytics (Futuro)

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SEGMENT_KEY=XXXXXXXXXXXX
```

### WhatsApp API (Futuro)

```env
WHATSAPP_API_TOKEN=EAAxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_WEBHOOK_VERIFY_TOKEN=tu-verify-token
```

---

## Configuracion en Vercel

### Paso 1: Dashboard

1. Ir a **Project** > **Settings** > **Environment Variables

### Paso 2: Agregar Variables

```
Name: SMTP_HOST
Value: smtp.gmail.com
Environments: Production, Preview, Development
```

Repetir para cada variable.

### Paso 3: Importar desde .env

```bash
# Exportar de local a Vercel
vercel env pull .env.vercel

# Esto crea .env.vercel con todas las variables
```

---

## Configuracion en Desarrollo Local

### Archivo .env.local

Crear en la raiz del proyecto:

```bash
touch .env.local
```

### Contenido completo

```env
# ===========================================
# Startup CRM - Desarrollo Local
# ===========================================

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu_email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx

# IMAP
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_USER=tu_email@gmail.com
IMAP_PASS=xxxx xxxx xxxx xxxx

# Email Defaults
FROM_EMAIL=tu_email@gmail.com
FROM_NAME=Startup CRM Dev

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### No Subir a Git!

```bash
# Verificar que .gitignore incluye .env.local
cat .gitignore | grep env

# Si no esta, agregar
echo ".env.local" >> .gitignore
```

---

## Configurar Gmail para Desarrollo

### Paso 1: Habilitar 2FA

1. Ir a [myaccount.google.com](https://myaccount.google.com)
2. **Seguridad**
3. **Verificacion en dos pasos** > Activar

### Paso 2: Generar Contrasena de Aplicacion

1. **Seguridad** > **Contrasenas de aplicaciones**
2. Si no ves la opcion, asegurate de que 2FA este activado
3. Seleccionar:
   - App: "Correo"
   - Dispositivo: "Windows (consola)"
4. Click **Generar**
5. Copiar contrasena de 16 caracteres

### Paso 3: Usar la Contrasena

```env
SMTP_PASS=xxxx xxxx xxxx xxxx
IMAP_PASS=xxxx xxxx xxxx xxxx
```

> **Nota:** La contrasena tiene espacios pero debes removerlos al usarla

---

## Verificacion

### Test de Configuracion

Crear script de test:

```bash
# test-env.js
require("dotenv").config();

const required = [
  "SMTP_HOST",
  "SMTP_PORT", 
  "SMTP_USER",
  "SMTP_PASS",
  "FROM_EMAIL",
];

let missing = [];
for (const key of required) {
  if (!process.env[key]) {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error("Faltan variables:", missing);
  process.exit(1);
}

console.log("Todas las variables estan configuradas");
```

Ejecutar:
```bash
node test-env.js
```

### Test de Conexion SMTP

```bash
# Instalar swaks
choco install swaks  # Windows

# Test
swaks -t test@gmail.com -s smtp.gmail.com \
  -tlso -a -au tu_email@gmail.com -ap "tu password"
```

---

## Problemas Comunes

### Error: Authentication failed

```
Error: Authentication failed. Please check your credentials.
```

**Solucion:**
1. Verificar credenciales son correctas
2. Verificar 2FA esta activado
3. Usar contrasena de aplicacion (16 chars)

### Error: Connection refused

```
Error: Connection refused to smtp.gmail.com:465
```

**Solucion:**
1. Verificar SMTP_PORT es 465
2. Verificar SMTP_SECURE es true
3. Verificar firewall no bloquea

### Error: Please log in via your web browser

```
SMTP Error: Please log in via your web browser
```

**Solucion:**
1. Gmail bloquea acceso de "apps menos seguras"
2. Usar contrasena de aplicacion, no contrasena normal
3. O habilitar "Less secure app access" (NO recomendado)

---

## Referencia Rapida

| Variable | Desarrollo | Produccion |
|----------|-----------|------------|
| SMTP_HOST | smtp.gmail.com | smtp.gmail.com |
| SMTP_PORT | 465 | 465 |
| SMTP_SECURE | true | true |
| SMTP_USER | dev@email.com | prod@email.com |
| SMTP_PASS | app-password | app-password |
| IMAP_HOST | imap.gmail.com | imap.gmail.com |
| IMAP_PORT | 993 | 993 |
| FROM_EMAIL | dev@email.com | prod@tu-dominio.com |
| FROM_NAME | Startup CRM Dev | Startup CRM |
| NEXT_PUBLIC_APP_URL | http://localhost:3000 | https://tu-dominio.com |

---

## Seguridad

### Nunca Hacer

```bash
# NO hardcodear en codigo
const password = "mi_password"; // MAL

# NO subir .env a git
git add .env.local  // MAL

# NO usar contrasena real en desarrollo
# Usar cuenta separada o contrasenas de aplicacion
```

### Siempre Hacer

```bash
# Usar variables de entorno
const password = process.env.SMTP_PASS; // BIEN

# .env en .gitignore
echo ".env.local" >> .gitignore

# Rotar contrasenas periodicamente
# Especialmente si hay sospecha de compromiso
```

---

**Anterior**: [Setup Local](setup-local.md)  
**Siguiente**: [Troubleshooting](troubleshooting.md)

**Volver a**: [Runbooks Index](README.md)
