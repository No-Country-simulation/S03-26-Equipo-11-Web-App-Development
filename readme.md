# Startup CRM

## 🏢 Sector de Negocio

Cross-Industry (Multisectorial)

## 🎯 Necesidad del Cliente

El cliente requiere un CRM inteligente, dotado de integración nativa con WhatsApp y correo electrónico, que facilite la gestión de conversaciones en tiempo real. La plataforma debe permitir automatizar el seguimiento de contactos y segmentar a los usuarios (por ejemplo, diferenciando entre _leads_ activos y clientes en proceso de seguimiento). Además, el sistema debe ser un entorno colaborativo y personalizable que cuente con paneles de métricas accesibles, ponen-do especial énfasis en la simplicidad de uso y en la comunicación asincrónica.

## 🚀 Objetivo del Proyecto

Desarrollar un sistema CRM inteligente con integración nativa a WhatsApp y correo electrónico, diseñado específicamente para _startups_ que necesitan gestionar las relaciones con sus _leads_ y clientes en tiempo real. La herramienta centralizará las conversaciones, automatizará los seguimientos y permitirá una segmentación eficiente de los usuarios, garantizando en todo momento una experiencia fluida, sencilla, colaborativa y asincrónica.

## ⚙️ Requerimientos Funcionales

- **Gestión de contactos:** Segmentación detallada según el estado dentro del _funnel_ (embudo de ventas).
- **Omnicanalidad:** Integración fluida de canales de comunicación.
- **Gestión de correos:** Envío y registro de _emails_ utilizando etiquetas y plantillas predefinidas.
- **Automatización:** Configuración de recordatorios automáticos para tareas y seguimientos.
- **Analítica:** Panel de métricas integrado para el análisis de datos.
- **Exportación de datos:** Generación de reportes y descarga de información en formatos CSV o PDF.
- **Personalización:** Configuración de etiquetas, vistas personalizadas y guardado de filtros.

## 🔌 Integraciones Externas

- **WhatsApp Cloud API** (Meta).
- **API SMTP** para el servicio de envío de _emails_.

> **Nota:** Brevo fue descartado tras pruebas (no funcional con Gmail).

## 📦 Entregables Esperados

- Prototipo funcional que incluya los flujos básicos de gestión de usuarios, comunicación y segmentación.
- Panel de métricas operacionales con visualización de KPIs clave (p. ej., contactos activos, mensajes enviados y tasa de respuesta).
- Documentación técnica detallada sobre los endpoints y guía completa de instalación.

---

## 🛠️ Stack Tecnológico

### Frontend

Construido con React y Vite para una experiencia de desarrollo moderna y rápida.

| Tecnología       | Versión | Propósito                  |
| ---------------- | ------- | -------------------------- |
| React            | 18.3.1  | Biblioteca UI              |
| TypeScript       | 5.8.3   | Tipado estático            |
| Vite             | 5.4.19  | Build tool                 |
| TailwindCSS      | 3.4.17  | Framework CSS              |
| shadcn/ui        | última  | Componentes accesibles     |
| TanStack Query   | 5.83.0  | Gestión de estado servidor |
| React Router DOM | 6.30.1  | Navegación SPA             |
| Recharts         | 2.15.4  | Visualización de datos     |
| Lucide React     | 0.462.0 | Sistema de iconos          |

### Backend

API REST desarrollada con Java y Spring Boot para gestión de datos y lógica de negocio.

| Tecnología      | Versión | Propósito             |
| --------------- | ------- | --------------------- |
| Java            | 17      | Lenguaje (LTS)        |
| Spring Boot     | 3.2.x   | Framework             |
| Spring Security | -       | Autenticación JWT     |
| Spring Data JPA | -       | ORM                   |
| PostgreSQL      | -       | Base de datos         |
| Flyway          | -       | Migraciones BD        |
| Lombok          | -       | Reducción boilerplate |
| OpenAPI/Swagger | -       | Documentación API     |
| Neon (o local)  | -       | Base de datos remota  |

---

## 🚀 Cómo Ejecutar

### Frontend

Consulta `frontend/README.md` para más scripts y detalles.

### Backend (próximamente)

Consulta `backend/README.md` para más detalles.

## 👥 Equipo de Desarrollo (Equipo 11)

| Nombre                             | Rol                  | GitHub                             |
| :--------------------------------- | :------------------- | :--------------------------------- |
| **Carla Vallejos Ari**             | Full Stack Developer | https://github.com/vallejos12ari   |
| **Ricardo Thalhuen Moraga Cortez** | Full Stack Developer | https://github.com/Thalhuen        |
| **Daniel Lorenzo Ramos**           | Backend Developer    | https://github.com/LazaroTupo      |
| **Rodrigo Fernández**              | Backend Developer    | https://github.com/rodri9891       |
| **Favian Fernando Medina Gemio**   | Backend Developer    | https://github.com/fabinnerself    |
| **Mario Isaac Alberto Cortez**     | Backend Developer    | https://github.com/mariocortezBEST |
| **Anghelo Flores**                 | Backend Developer    | https://github.com/evanghel1on     |
