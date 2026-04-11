# Overview - Startup CRM

## Descripcion del Proyecto

**Startup CRM** es un sistema CRM inteligente disenado especificamente para startups, con integracion nativa a WhatsApp y correo electronico. Permite gestionar relaciones con leads y clientes en tiempo real, centralizando conversaciones, automatizando seguimientos y segmentando usuarios eficientemente.

El cliente requiere un CRM inteligente, dotado de integracion nativa con WhatsApp y correo electronico, que facilite la gestion de conversaciones en tiempo real. La plataforma debe permitir automatizar el seguimiento de contactos y segmentar a los usuarios (diferenciando entre leads activos y clientes en proceso de seguimiento).

## Sector de Negocio

**Cross-Industry (Multisectorial)** - Disenado para startups de cualquier industria que necesiten gestionar sus relaciones con clientes de manera eficiente.

## Objetivo del Proyecto

Desarrollar un sistema CRM inteligente con integracion nativa a WhatsApp y correo electronico, disenado especificamente para startups que necesitan gestionar las relaciones con sus leads y clientes en tiempo real. La herramienta centralizara las conversaciones, automatizara los seguimientos y permitira una segmentacion eficiente de los usuarios, garantizando en todo momento una experiencia fluida, sencilla, colaborativa y asincronica.

## Caracteristicas Principales

| Modulo | Descripcion |
|--------|-------------|
| **Dashboard** | Panel de control con KPIs, graficos de embudo de ventas, distribucion por canal, actividad semanal y tasa de conversion |
| **Contactos** | Gestion de contactos con embudo de ventas, filtros, busqueda y exportacion CSV |
| **Email** | Cliente de email con soporte SMTP/IMAP, plantillas y etiquetas |
| **WhatsApp** | Interfaz de mensajeria estilo WhatsApp para comunicacion con contactos |
| **Recordatorios** | Sistema de tareas y recordatorios con prioridades y estados |
| **Configuracion** | Configuracion general, integraciones y notificaciones |

## Requerimientos Funcionales

| Requerimiento | Descripcion |
|---------------|-------------|
| Gestion de Contactos | Segmentacion por funnel (new, contacted, qualified, proposal, won, lost) |
| Omnicanalidad | Integracion fluida WhatsApp + Email |
| Gestion de Emails | Envio/registro con etiquetas y plantillas |
| Automatizacion | Recordatorios automaticos para tareas y seguimientos |
| Analitica | Panel de metricas con KPIs (contactos activos, mensajes enviados, tasa de respuesta) |
| Exportacion | Generacion de reportes CSV y PDF |
| Personalizacion | Etiquetas, vistas personalizadas, filtros guardados |

## Integraciones Externas

- **WhatsApp Cloud API** (Meta) - Mensajeria WhatsApp
- **API SMTP** - Servicio de envio de emails (nodemailer)

## Tecnologias Clave

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Estilos**: Tailwind CSS v4 (CSS-first), Radix UI
- **Email**: Nodemailer (SMTP), IMAP, Mailparser
- **Auth**: **Better Auth** (better-auth + drizzle-adapter)
- **Documentacion API**: OpenAPI Spec
- **Graficos**: Recharts para dashboard
- **Despliegue**: Vercel
- **QA**: Husky (git hooks), ESLint, lint-staged

## Equipo de Desarrollo (Equipo 11)

| Miembro | Rol | GitHub |
|---------|-----|--------|
| Carla Vallejos Ari | Full Stack Developer | @vallejos12ari |
| Ricardo Thalhuen Moraga Cortez | Full Stack Developer | @Thalhuen |
| Daniel Lorenzo Ramos | Backend Developer | @LazaroTupo |
| Rodrigo Fernandez | Backend Developer | - |
| Favian Fernando Medina Gemio | Backend Developer | @fabinnerself |
| Mario Isaac Alberto Cortez | Backend Developer | @mariocortezBEST |
| Anghelo Flores | Backend Developer | - |

## Estado del Proyecto

- [x] Estructura base y configuración
- [x] Componentes UI fundamentales
- [x] Páginas principales (Dashboard, Contactos, Email, WhatsApp, Recordatorios, Configuración)
- [x] API Routes para email (SMTP/IMAP)
- [x] API Routes para auth (signin, signup, signout, get-session)
- [x] API Routes para dashboard
- [x] Documentación Swagger
- [x] Sistema de estilos con Tailwind CSS v4
- [x] Despliegue en Vercel
- [ ] Contactos CRUD completo backend
- [ ] WhatsApp backend completo
- [ ] Tests unitarios

## Pendientes para Demo (17 abril 2026)

| Prioridad | Tarea |
|-----------|-------|
| 🔴 Alta | Contactos CRUD backend |
| 🔴 Alta | WhatsApp - enviar/recibir mensajes |
| 🟡 Media | Dashboard - sync antes de cargar datos |
| 🟡 Media | Email - sync con botón actualizar |
| 🟡 Media | Script creación admin inicial |
| 🟢 Baja | Botón contraer menú lateral |
| 🟢 Baja | Buscador funcional |

## Despliegue

El proyecto se despliega en **Vercel**. Ver [Infrastructure](8_infrastructure.md) para detalles.

---

**Volver a**: [Indice de Arquitectura](../architecture.md)
