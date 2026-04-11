# Features - Startup CRM

## Descripción General

Startup CRM ofrece un conjunto completo de funcionalidades para la gestión de relaciones con clientes, diseñado específicamente para startups que necesitan gestionar leads y clientes en tiempo real.

---

## Dashboard

Panel de control centralizado con métricas y visualizaciones clave para el seguimiento del rendimiento comercial.

### KPIs (Key Performance Indicators)

| KPI | Descripción | Fuente de Datos |
|-----|-------------|-----------------|
| Contactos Activos | Total de contactos en embudo | `contacts.length` |
| Mensajes Enviados | Mensajes WhatsApp enviados | `whatsappMessages` |
| Emails | Emails intercambiados | `emailMessages` |
| Tasa de Respuesta | Porcentaje de respuestas | Calculado |

### Gráficos

#### Embudo de Ventas
- **Tipo**: Bar Chart horizontal
- **Datos**: Conteo por etapa (new, contacted, qualified, proposal, won, lost)
- **Librería**: recharts

#### Distribución por Canal
- **Tipo**: Pie Chart
- **Datos**: WhatsApp, Email, Otro
- **Colores**: Verde (WhatsApp), Azul (Email)

#### Actividad Semanal
- **Tipo**: Bar Chart
- **Datos**: Mensajes y emails por día
- **Rango**: Últimos 7 días

#### Tasa de Conversión
- **Tipo**: Line Chart
- **Datos**: Porcentaje mensual de conversiones
- **Rango**: Últimos 6 meses

### Exportación
- **PDF**: Generación de reporte con métricas del dashboard

---

## Gestión de Contactos

Sistema completo de gestión de contactos con segmentación por embudo de ventas.

### Embudo de Ventas

| Etapa | Descripción | Color |
|-------|-------------|-------|
| **Nuevo** | Leads recién capturados | Azul |
| **Contactado** | Leads que han sido contactados | Amarillo |
| **Calificado** | Leads cualificados como prospectos | Verde |
| **Propuesta** | Se ha enviado propuesta comercial | Púrpura |
| **Ganado** | Negociación exitosa | Verde brillante |
| **Perdido** | Negociación no exitosa | Rojo |

### Vista de Tabla
- Columnas: Nombre, Email, Teléfono, Empresa, Etapa, Último Contacto
- Ordenamiento por columna
- Paginación

### Filtros
- **Por Etapa**: Nuevo, Contactado, Calificado, Propuesta, Ganado, Perdido
- **Por Búsqueda**: Nombre o empresa
- **Por Tags**: Etiquetas personalizadas

### Acciones Rápidas
- **WhatsApp**: Abre chat directamente
- **Email**: Abre compose con contacto prellenado
- **Llamada**: Enlace `tel:` para llamada telefónica

### Agregar Contacto
- Modal con formulario
- Campos: Nombre, Email, Teléfono, Empresa, Etapa, Tags
- Validación en tiempo real

### Exportación
- **CSV**: Exporta contactos filtrados

---

## Email

Cliente de email integrado con soporte para SMTP/IMAP, etiquetas y plantillas.

### Bandeja de Entrada
- Lista de emails con preview
- Indicador de leído/no leído
- Etiquetas de categorización
- Filtrado por etiquetas

### Vista Dividida
- Panel izquierdo: Lista de emails
- Panel derecho: Contenido del email seleccionado

### Compose
- Para, CC, BCC
- Asunto
- Editor HTML/Texto plano
- Soporte para plantillas predefinidas

### Plantillas de Email

| Plantilla | Uso |
|-----------|-----|
| **Bienvenida** | Saludo inicial para nuevos contactos |
| **Seguimiento** | Mensaje de seguimiento |
| **Propuesta** | Envío de propuesta comercial |

### API Integration
- **Envío**: POST `/api/email/send`
- **Recepción**: POST `/api/email/receive`
- **Detalle**: POST `/api/email/receiveOne`

---

## WhatsApp

Interfaz de mensajería estilo WhatsApp para comunicación fluida con contactos.

### Interfaz
- Diseño estilo WhatsApp moderno
- Lista de contactos/chats en sidebar
- Área de mensajes principal

### Mensajes
- Burbujas diferenciadas (enviado/recibido)
- Timestamp por mensaje
- Indicador de estado (enviado, entregado)
- Historial de conversación por contacto

### Contactos
- Lista de chats recientes ordenados por última actividad
- Búsqueda de contactos
- Inicio de nuevo chat

### Integración Futura
- WhatsApp Cloud API (Meta)
- Webhooks para mensajes entrantes
- Notificaciones en tiempo real

---

## Recordatorios y Automatización

Sistema de tareas y recordatorios automáticos para seguimiento de actividades.

### Tarjetas de Tarea
- Título y descripción
- Fecha y hora de vencimiento
- Indicador de prioridad visual
- Contacto asociado
- Notas adicionales

### Prioridades

| Prioridad | Color | Uso |
|-----------|-------|-----|
| **Alta** | Rojo | Urgente/Importante |
| **Media** | Amarillo | Normal |
| **Baja** | Verde | Opcional |

### Estados

| Estado | Descripción |
|--------|-------------|
| **Pendiente** | No completada, dentro de fecha |
| **Completada** | Marcada como done |
| **Vencida** | Pasó fecha límite |

### Notificaciones Automáticas
- Email
- SMS
- WhatsApp
- Push

### Filtros
- Por estado (Pendiente, Completada, Vencida)
- Por prioridad (Alta, Media, Baja)
- Por fecha
- Por contacto

---

## Configuración e Integraciones

Panel de configuración para personalizar la aplicación y conectar servicios externos.

### Tabs
- **General**: Configuración de la app
- **Integraciones**: Conexiones externas
- **Notificaciones**: Preferencias de alertas

### Integraciones Disponibles

#### SMTP (Email Saliente)
- Host, Puerto, Secure (TLS/SSL)
- Usuario, Contraseña
- Prueba de conexión
- Dirección de remitente por defecto

#### IMAP (Email Entrante)
- Host, Puerto, TLS
- Usuario, Contraseña
- Buzón por defecto (INBOX)

#### WhatsApp Cloud API (Futuro)
- Token de acceso
- Phone Number ID
- Webhook URL
- Configuración de mensajes automáticos

### Personalización
- Etiquetas personalizadas
- Vistas guardadas
- Filtros guardados
- Temas de color (futuro)

---

## Landing Page

Página de marketing con información del producto.

### Secciones
1. **Hero**: Título, descripción, CTA
2. **What We Do**: Qué hacemos
3. **Features**: Características principales
4. **How It Works**: Cómo funciona
5. **FAQ**: Preguntas frecuentes
6. **Our Clients**: Clientes
7. **Our Products**: Productos relacionados
8. **Footer**: Links y contacto

---

## Entregables del Proyecto

1. **Prototipo funcional** con flujos básicos de:
   - Gestión de usuarios
   - Comunicación multicanal
   - Segmentación

2. **Panel de métricas** con visualización de KPIs:
   - Contactos activos
   - Mensajes enviados
   - Tasa de respuesta

3. **Documentación técnica**:
   - Endpoints API
   - Guía de instalación

---

**Volver a**: [Índice de Arquitectura](../architecture.md)
