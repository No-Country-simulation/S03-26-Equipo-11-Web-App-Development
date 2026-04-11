# Runbook: Setup Local

Guia para configurar el entorno de desarrollo local.

---

## Requisitos del Sistema

### Software Necesario

| Software | Version Minima | Descarga |
|----------|---------------|---------|
| **Node.js** | 18.17.0 | [nodejs.org](https://nodejs.org) |
| **npm** | 9.0.0 | Incluido con Node.js |
| **Git** | 2.30+ | [git-scm.com](https://git-scm.com) |
| **Editor** | - | VS Code recomendado |

### Verificar Instalacion

```bash
# Node.js
node --version
# v18.17.0 o superior

# npm
npm --version
# 9.0.0 o superior

# Git
git --version
# git version 2.30+ 
```

---

## Clonar el Repositorio

```bash
# Usando HTTPS
git clone https://github.com/tu-usuario/nextjs_crm.git

# O usando SSH (si tienes SSH configurado)
git clone git@github.com:tu-usuario/nextjs_crm.git

# Entrar al directorio
cd nextjs_crm
```

---

## Instalacion de Dependencias

```bash
# Instalar todas las dependencias
npm install

# Verificar instalacion exitosa
ls node_modules
```

### Si hay errores en Windows

```powershell
# Limpiar cache de npm
npm cache clean --force

# Eliminar node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install
```

---

## Configuracion de Variables de Entorno

### Crear archivo .env.local

```bash
# En la raiz del proyecto
touch .env.local
```

### Contenido de .env.local

```env
# ===========================================
# Startup CRM - Desarrollo Local
# ===========================================

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_app_password

# IMAP Configuration
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
IMAP_TLS=true
IMAP_USER=tu_email@gmail.com
IMAP_PASS=tu_app_password

# Email Defaults
FROM_EMAIL=tu_email@gmail.com
FROM_NAME=Startup CRM Dev

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Configurar Gmail (2FA + App Password)

1. Ir a [myaccount.google.com](https://myaccount.google.com)
2. **Seguridad** > **Verificacion en dos pasos** > Activar
3. **Seguridad** > **Contrasenas de aplicaciones**
4. Seleccionar app: "Correo"
5. Seleccionar dispositivo: "Windows"
6. Copiar contrasena generada (16 caracteres sin espacios)

---

## Ejecutar en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Veras algo como:
# - Ready - started server on http://localhost:3000
# - Local: http://localhost:3000
```

### Abrir en Navegador

- **Landing page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **API Health**: http://localhost:3000/api/health

---

## Scripts Disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Iniciar desarrollo |
| `npm run build` | Build produccion |
| `npm run start` | Iniciar produccion |
| `npm run lint` | Verificar codigo |
| `npm run lint:fix` | Corregir errores de linting |

---

## Estructura de Archivos Importantes

```
nextjs_crm/
|-- .env.local          # Variables locales (NO subir a git)
|-- .env.example       # Template de variables
|-- app/              # Paginas y rutas
|-- components/        # Componentes React
|-- lib/              # Utilidades y servicios
|-- public/           # Archivos estaticos
|-- docs/             # Documentacion
|-- package.json      # Dependencias
|-- tsconfig.json     # Config TypeScript
|-- next.config.ts    # Config Next.js
|-- tailwind.config.ts # Config Tailwind
|-- eslint.config.mjs  # Config ESLint
```

---

## VS Code - Configuracion Recomendada

### Extensiones

- **ESLint** - Microsoft
- **Prettier** - Prettier
- **Tailwind CSS IntelliSense** - Tailwind
- **TypeScript Vue Plugin** - Vue

### .vscode/settings.json

Crear archivo `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Troubleshooting Local

### Puerto 3000 en uso

```bash
# Windows: encontrar proceso
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O cambiar puerto
npm run dev -- -p 3001
```

### Errores de TypeScript

```bash
# Limpiar cache de Next.js
rm -rf .next

# Reiniciar servidor
npm run dev
```

### Errores de imports

```bash
# Verificar que node_modules existe
ls node_modules

# Reinstalar si falta
npm install
```

---

## Git - Buenas Practicas

### Ramas

```bash
# Rama principal
main

# Rama de desarrollo
develop

# Ramas de feature
feature/nueva-funcionalidad
feature/arreglo-bug

# Rama hotfix
hotfix/urgente
```

### Flujo de Trabajo

```bash
# 1. Crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b feature/mi-feature

# 2. Trabajar en la feature
# ... hacer cambios ...

# 3. Commit
git add .
git commit -m "feat: agregar mi feature"

# 4. Push
git push origin feature/mi-feature

# 5. Crear Pull Request en GitHub
```

---

## Mantener Sincronizado

```bash
# Actualizar desde develop
git checkout develop
git pull origin develop

# Rebase tu feature
git checkout feature/mi-feature
git rebase develop

# Resolver conflictos si hay
git add .
git rebase --continue
```

---

**Anterior**: [Deployment Vercel](deployment-vercel.md)  
**Siguiente**: [Configuracion de Variables](environment-setup.md)

**Volver a**: [Runbooks Index](README.md)
