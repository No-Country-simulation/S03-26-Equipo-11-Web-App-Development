# Startup CRM - Product Requirements Document (PRD)

## 1. Requerimientos Funcionales

### 1.1 Gestión de Contactos
- **RF1:** Crear, editar y eliminar contactos ✅ (Implementado con Drizzle + Turso)
- **RF2:** Segmentación por etapa del funnel (new, contacted, qualified, proposal, won, lost) ✅
- **RF3:** Asignar etiquetas personalizadas a contactos ✅
- **RF4:** Registrar información de contacto (nombre, email, teléfono, empresa, notas) ✅
- **RF5:** Historial de interacciones por contacto ✅

### 1.2 Omnicanalidad
- **RF6:** Integración con WhatsApp vía **WAHA (WhatsApp HTTP API)** ✅
- **RF7:** Integración con SMTP para envío de emails ✅
- **RF8:** Integración con IMAP para recepción de emails ✅
- **RF9:** Vista unificada de conversaciones por contacto ✅

### 1.3 Gestión de Correos
- **RF10:** Enviar emails desde la aplicación ✅
- **RF11:** Utilizar plantillas predefinidas de email ✅
- **RF12:** Etiquetar emails enviados/recibidos ✅
- **RF13:** Registrar emails en el historial del contacto ✅

### 1.4 Automatización
- **RF14:** Crear recordatorios automáticos para tareas ✅
- **RF15:** Configurar seguimientos automáticos según etapa del funnel ✅
- **RF16:** Notificaciones para contactos sin actividad reciente ✅

### 1.5 Analítica
- **RF17:** Panel de métricas con KPIs clave ✅
- **RF18:** Contador de contactos activos por etapa ✅
- **RF19:** Métricas de mensajes enviados (WhatsApp + Email) ✅
- **RF20:** Tasa de respuesta por canal ✅
- **RF21:** Visualización mediante gráficos (recharts) ✅

### 1.6 Exportación de Datos
- **RF22:** Exportar contactos a formato CSV ✅
- **RF23:** Exportar reportes a formato PDF ✅
- **RF24:** Exportar historial de conversaciones ✅

## 2. Requerimientos No Funcionales

### 2.1 Rendimiento
- Tiempo de carga de página < 2 segundos en Vercel Edge.
- Respuesta de API optimizada con caching de sesión.

### 2.2 Seguridad
- **Autenticación:** Better Auth con sesiones seguras en HTTPS.
- **Middleware:** Inyección de ID de usuario en headers para protección de rutas API.
- **Infraestructura:** Edge Runtime compatible con Web Crypto API.

## 3. Integraciones Externas Actualizadas

| Servicio | Propósito | Tecnología |
|----------|-----------|--------------|
| **WhatsApp** | Mensajería programática | WAHA (Self-hosted) |
| **Emails (Envío)** | SMTP | Nodemailer |
| **Emails (Recibir)** | IMAP | Node-IMAP ("El Cartero") |
| **Base de Datos** | Persistencia Global | Turso (libSQL) |
| **Autenticación** | Gestión de Usuarios | Better Auth |

## 4. Métricas de Éxito Alcanzadas

| Métrica | Estado |
|---------|--------|
| Despliegue en Nube | ✅ Exitoso en Vercel |
| Sincronización DB | ✅ Turso sincronizado |
| Compatibilidad Mobile | ✅ UI Responsiva |
| Registro de Usuarios | ✅ Operativo en Producción |
