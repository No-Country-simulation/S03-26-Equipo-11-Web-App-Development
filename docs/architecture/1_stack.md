# Technology Stack - Startup CRM

## Stack Core

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **Next.js** | 16.2.2 | Framework React con App Router |
| **React** | 19.2.4 | Libreria de interfaz de usuario |
| **TypeScript** | 5.x | Lenguaje tipado (strict mode) |

## UI y Estilos

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **Tailwind CSS** | 4.x | Framework CSS (configuracion CSS-first) |
| **Radix UI** | 1.1.x | Primitivos UI accesibles y sin estilos |
| **lucide-react** | 1.7.x | Libreria de iconos |
| **recharts** | 3.8.x | Graficos y visualizaciones |
| **clsx** | 2.1.x | Utilidad para clases condicionales |
| **tailwind-merge** | 3.5.x | Utilidad para combinar clases Tailwind |

## Email y Mensajeria

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **nodemailer** | 8.0.x | Envio de emails via SMTP |
| **imap** | 0.8.x | Recepcion de emails via IMAP |
| **mailparser** | 3.9.x | Parseo de emails |

## Integraciones Externas

| Servicio | Proposito |
|----------|-----------|
| **WhatsApp Cloud API** (Meta) | Mensajeria WhatsApp |
| **SMTP** | Servicio de envio de emails (nodemailer) |

## API y Documentacion

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **Better Auth** | 1.x | Autenticacion y sesiones |
| **openapi3-ts** | 4.x | Generacion de spec OpenAPI |
| **eslint** | 9.x | Linting de codigo |
| **eslint-config-next** | 16.2.2 | Configuracion ESLint para Next.js |
| **husky** | 9.x | Git hooks para verificacion pre-commit/push |
| **lint-staged** | 16.x | Ejecucion de linter en archivos staged |

## Utilidades

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| **date-fns** | 4.1.x | Manipulacion y formateo de fechas |
| **@radix-ui/react-dialog** | 1.1.x | Componente Dialog accesible |
| **@radix-ui/react-select** | 2.1.x | Componente Select accesible |
| **@radix-ui/react-tabs** | 1.1.x | Componente Tabs accesible |
| **@radix-ui/react-label** | 2.1.x | Componente Label accesible |
| **@radix-ui/react-slot** | 1.1.x | Slot pattern para composicion |

## Configuracion de Desarrollo

| Herramienta | Proposito |
|-------------|-----------|
| **postcss** | Procesamiento de CSS para Tailwind |
| **typescript** | Compilacion y tipos |
| **husky** | Git hooks (pre-commit/pre-push) |
| **lint-staged** | Linting de archivos staged |

## Diagrama de Dependencias

```
+-------------------------------------------------------------+
|                         app/                                  |
|  +---------+  +---------+  +---------+  +---------+       |
|  |Dashboard|  |Contacts |  | Email   |  |WhatsApp |       |
|  +----+----+  +----+----+  +----+----+  +----+----+       |
|       |            |            |            |             |
|       +------------+----+-------+------------+             |
|                          |                                  |
|                    +-----+-----+                           |
|                    | components |                          |
|                    |   /ui/     |                           |
|                    +-----+-----+                           |
|                          |                                  |
|                    +-----+-----+                           |
|                    |    lib/   |                            |
|                    |  - data   |                           |
|                    |  - email  |                           |
|                    |  - utils  |                           |
|                    +-----------+                           |
+-------------------------------------------------------------+
```

## Versiones de Node

- **Node.js**: >= 18.17.0 (requerido por Next.js 16)
- **npm**: >= 9.0.0

---

**Volver a**: [Indice de Arquitectura](../architecture.md)
