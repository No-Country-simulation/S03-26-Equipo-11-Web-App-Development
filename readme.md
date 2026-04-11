# Startup CRM

Sistema CRM inteligente diseñado específicamente para startups, con integración nativa a WhatsApp y correo electrónico. **100% funcional en la nube.**

---

## Estado Actual del Proyecto: ¡Desplegado y Funcional! 🚀

El sistema se encuentra actualmente en producción y es totalmente operativo tanto en entornos locales como en la nube.

*   **URL de Producción:** [https://startup-crm-equipo-11.vercel.app/](https://startup-crm-equipo-11.vercel.app/)
*   **Base de Datos:** Turso (libSQL) en la nube para producción y SQLite para desarrollo local.
*   **Autenticación:** Better Auth con soporte para Edge Runtime.
*   **Integraciones:** WhatsApp (WAHA) y Email (SMTP/IMAP) integrados y operativos.

---

## Descripción del Proyecto

**Startup CRM** permite gestionar relaciones con leads y clientes en tiempo real, centralizando conversaciones, automatizando seguimientos y segmentando usuarios eficientemente.

### Sector de Negocio
**Cross-Industry (Multisectorial)** - Diseñado para startups de cualquier industria.

### Objetivo
Desarrollar un sistema CRM inteligente con integración nativa a WhatsApp y correo electrónico. La herramienta centraliza las conversaciones, automatiza los seguimientos y permite una segmentación eficiente de los usuarios, garantizando una experiencia fluida, sencilla, colaborativa y asincrónica.

---

## Requerimientos Funcionales Implementados

- **Gestión de contactos:** CRUD completo con persistencia en Turso/SQLite. Segmentación por funnel (`new`, `contacted`, `qualified`, etc.).
- **Omnicanalidad:** Integración de WhatsApp (vía WAHA) y Email.
- **Gestión de correos:** 
  - Envío de emails vía SMTP (Nodemailer).
  - Recepción y sincronización automática vía IMAP.
  - Soporte para plantillas personalizadas.
- **WhatsApp:** 
  - Sincronización de contactos y mensajes.
  - Envío de mensajes directo desde el CRM.
  - Integración con WAHA (WhatsApp HTTP API).
- **Analítica:** Dashboard interactivo con KPIs en tiempo real (Contactos, Tasa de conversión, Actividad semanal).
- **Autenticación:** Sistema robusto de Registro y Login mediante **Better Auth**.

---

## Tecnologías

| Categoría | Tecnología | Versión |
|-----------|------------|---------|
| Framework | **Next.js** | 16.2.3 (App Router) |
| UI | **React** | 19.2.4 |
| Base de Datos | **Turso / libSQL** | 0.17.x |
| ORM | **Drizzle ORM** | 0.45.x |
| Autenticación | **Better Auth** | 1.5.x |
| Estilos | **Tailwind CSS** | v4 |
| Mensajería | **WAHA** | WhatsApp HTTP API |
| Email | **Nodemailer / IMAP** | SMTP & IMAP |

---

## Ejecutar el Proyecto (Local)

### Requisitos Previos
- Node.js >= 20
- Docker (para correr WAHA localmente)

### Instalación
```bash
git clone <repo-url>
cd S03-26-Equipo-11-Web-App-Development
npm install --legacy-peer-deps
```

### Variables de Entorno (.env)
Copia el archivo `.env.example` y configura tus credenciales:
```env
# Database
DATABASE_URL=file:./data/crm.db
TURSO_DATABASE_URL=libsql://tu-db.turso.io
TURSO_AUTH_TOKEN=tu-token

# Auth
BETTER_AUTH_SECRET=tu-secreto-largo
BETTER_AUTH_URL=http://localhost:3000

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PASS=tu-app-password
IMAP_HOST=imap.gmail.com

# WhatsApp (WAHA)
WHATSAPP_API_URL=http://localhost:4000
WHATSAPP_API_KEY=tu-key
```

### Desarrollo
```bash
npm run dev
# Abrir http://localhost:3000
```

---

## Despliegue en Vercel

El proyecto está optimizado para **Vercel Edge Runtime**.

### Configuración Crítica en Vercel Dashboard:
Para que la sesión funcione, debes configurar en Vercel:
1.  `BETTER_AUTH_URL`: `https://tu-app.vercel.app`
2.  `TRUSTED_ORIGINS`: `https://tu-app.vercel.app`
3.  `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`.

### Comando de Deploy
```bash
vercel --prod
```

---

## Estructura del Proyecto
- `app/`: Rutas, APIs y componentes de página (Next.js App Router).
- `lib/`: Lógica de negocio, configuración de base de datos y servicios.
- `components/`: Componentes UI reutilizables.
- `waha/`: Configuración de Docker para la API de WhatsApp.
- `docs/`: Documentación técnica detallada.

---

## Equipo de Desarrollo (Equipo 11)
- **Carla Vallejos Ari** - Full Stack
- **Daniel Lorenzo Ramos** - Backend
- **Rodrigo Fernandez** - Backend
- **Favian Medina Gemio** - Backend
- **Mario Isaac Alberto Cortez** - Backend
- **Anghelo Flores** - Backend

---

## Documentación Detallada
- [PRD - Requerimientos](docs/prd.md)
- [Arquitectura del Sistema](docs/architecture/architecture.md)
- [Endpoints API](docs/architecture/5_api_rest.md)
