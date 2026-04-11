# Arquitectura - Startup CRM

Documentacion completa de la arquitectura del proyecto **Startup CRM**.

## Descripcion del Proyecto

**Startup CRM** es un sistema CRM inteligente disenado especificamente para startups, con integracion nativa a WhatsApp y correo electronico. Permite gestionar relaciones con leads y clientes en tiempo real, centralizando conversaciones, automatizando seguimientos y segmentando usuarios eficientemente.

## Indice de Documentacion

| # | Documento | Descripcion |
|---|-----------|-------------|
| 0 | [Overview](0_overview.md) | Descripcion general del proyecto, objetivos y equipo |
| 1 | [Technology Stack](1_stack.md) | Tecnologias y dependencias |
| 2 | [Data Model](2_data_model.md) | Entidades y tipos de datos |
| 3 | [Directory Structure](3_directory_structure.md) | Estructura de carpetas |
| 4 | [Routes & Access](4_routes_access.md) | Rutas y control de acceso |
| 5 | [REST API](5_api_rest.md) | Endpoints de API |
| 6 | [Patterns](6_patterns.md) | Patrones y convenciones de codigo |
| 7 | [SEO](7_seo.md) | Optimizacion para motores de busqueda |
| 8 | [Infrastructure](8_infrastructure.md) | Infraestructura y despliegue |
| 9 | [Data Flows](9_data_flows.md) | Flujos de datos |
| 10 | [Environment](10_environment.md) | Variables de entorno |
| 11 | [Components](11_components.md) | Catalogo de componentes UI |
| 12 | [Features](12_features.md) | Descripcion detallada de funcionalidades |\n| 13 | [System Design - UI/UX](sysdesign_ui_ux.md) | Sistema de diseno grafico, colores, tipografia |\n| 14 | [System Design - Arquitectura](sysdesign_architecture.md) | Arquitectura de alto nivel, deployment, diagramas |

## Runbooks

Guias de operacion para despliegue y mantenimiento:

| Guia | Descripcion |
|------|-------------|
| [Runbooks Index](../runbooks/README.md) | Indice de guias |
| [Deployment en Vercel](../runbooks/deployment-vercel.md) | Despliegue paso a paso |
| [Setup Local](../runbooks/setup-local.md) | Configuracion desarrollo local |
| [Configuracion Variables](../runbooks/environment-setup.md) | Variables de entorno |
| [Troubleshooting](../runbooks/troubleshooting.md) | Problemas comunes |
| [Mantenimiento](../runbooks/maintenance.md) | Tareas rutinarias |
---

## Resumen Rapido

### Tecnologias Core
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** (CSS-first config)

### Integraciones Externas
- **WhatsApp Cloud API** (Meta) - Mensajeria WhatsApp
- **SMTP** - Envio de emails (nodemailer)

### Estructura Principal
```
app/
├── (crm)/          # Route group CRM
├── api/            # API routes (email SMTP/IMAP)
├── login/          # Auth pages
└── register/

components/
├── ui/             # Componentes base (Radix UI)
├── landing/        # Landing page
└── api-docs/       # Swagger

lib/
├── data/           # Mock data y tipos
└── email/          # Servicios SMTP/IMAP
```

### API Endpoints
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/email/send` | Enviar email (SMTP) |
| POST | `/api/email/receive` | Recibir emails (IMAP) |
| POST | `/api/email/receiveOne` | Email individual |

### Requerimientos Funcionales
- Gestion de Contactos (embudo de ventas)
- Omnicanalidad (WhatsApp + Email)
- Gestion de Emails (etiquetas, plantillas)
- Automatizacion (recordatorios)
- Analitica (KPIs, graficos)
- Exportacion (CSV, PDF)
- Personalizacion (etiquetas, filtros)

---

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

---

## Comandos de Desarrollo

```bash
# Desarrollo
npm run dev

# Build produccion
npm run build

# Start produccion
npm run start

# Linting
npm run lint
```

---

## Despliegue\n\nEl proyecto se despliega en **Vercel**. Ver [8_infrastructure.md](8_infrastructure.md) para detalles.\n\n---\n\n## Links Rapidos

- [Landing Page](../app/page.tsx)
- [Dashboard](../app/(crm)/dashboard/page.tsx)
- [Contactos](../app/(crm)/contacts/page.tsx)
- [Documentacion API](5_api_rest.md)
- [Variables de Entorno](10_environment.md)
- [Definicion del Proyecto](../definicion_proy.md)



