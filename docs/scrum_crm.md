## 📋 SCRUM BACKLOG COMPLETO - CRM STARTUP
---

## 🎯 PRIORIZACIÓN (MoSCoW)

| Prioridad | Significado |
|-----------|-------------|
| 🔴 **MUST** | Imprescindible para el MVP |
| 🟡 **SHOULD** | Importante pero no crítico |
| 🟢 **COULD** | Mejora deseable |
| ⚪ **WON'T** | Fuera del alcance inicial |

---

## 📦 ÉPICA 1: AUTENTICACIÓN Y SEGURIDAD (Sprint 1)

### **Historia 1.1: Registro de usuarios** 🔴 MUST
**Como** usuario del sistema  (agente/soporte)
**Quiero** poder registrarme con mi email  
**Para** acceder al CRM

**Criterios de aceptación:**
- [ ] Formulario de registro con nombre, email, contraseña
- [ ] Validación de email único
- [ ] Contraseña con requisitos mínimos (6 caracteres, 1 mayúscula, 1 número)
- [ ] Email de confirmación de cuenta
- [ ] Captcha anti-bots

**Tareas técnicas:**
- Crear modelo Usuario en BD
- Implementar JWT para autenticación
- Configurar nodemailer para emails de confirmación
- Diseñar frontend de registro

---

### **Historia 1.2: Inicio de sesión** 🔴 MUST
**Como** usuario registrado  (agente/administrador/etc)
**Quiero** iniciar sesión en el sistema  
**Para** acceder a mis conversaciones y contactos

**Criterios de aceptación:**
- [ ] Formulario de login con email/contraseña
- [ ] "Recordarme" (sesión persistente)
- [ ] Recuperación de contraseña
- [ ] Bloqueo tras 5 intentos fallidos
- [ ] Cierre de sesión

---

### **Historia 1.3: Perfiles de usuario** 🔴 MUST
**Como** administrador  
**Quiero** asignar roles a los usuarios  
**Para** controlar permisos (agente/supervisor/admin)

**Criterios de aceptación:**
- [ ] Roles predefinidos: Agente, Supervisor, Admin
- [ ] Admin puede cambiar rol de usuarios
- [ ] Vistas diferentes según rol
- [ ] No permisos cruzados

---

## 📦 ÉPICA 2: GESTIÓN DE CONTACTOS (Sprint 1-2)

### **Historia 2.1: CRUD de contactos** 🔴 MUST
**Como** agente  
**Quiero** crear, ver, editar y eliminar contactos  
**Para** mantener actualizada mi base de datos

**Criterios de aceptación:**
- [ ] Formulario completo: nombre, email, teléfono, empresa, cargo
- [ ] Validación de email y teléfono únicos
- [ ] Búsqueda por cualquier campo
- [ ] Paginación de resultados
- [ ] Eliminación con confirmación

**Tareas técnicas:**
- Modelo Contacto en BD
- API REST endpoints
- Componente ContactList en frontend
- Formulario reactivo

---

### **Historia 2.2: Segmentación por funnel** 🔴 MUST
**Como** agente  
**Quiero** clasificar contactos por etapa del funnel  
**Para** dar seguimiento apropiado

**Criterios de aceptación:**
- [ ] Etapas configurables: Lead, Contactado, Cliente, Inactivo
- [ ] Vista Kanban (arrastrar y soltar)
- [ ] Cambiar etapa desde ficha de contacto
- [ ] Historial de cambios de etapa

**Tareas técnicas:**
- Tabla funnel_etapas en BD
- Componente KanbanBoard
- Lógica drag-and-drop
- API para mover contactos

---

### **Historia 2.3: Etiquetas personalizables** 🟡 SHOULD
**Como** agente  
**Quiero** etiquetar contactos  
**Para** filtrar y segmentar fácilmente

**Criterios de aceptación:**
- [ ] Crear etiquetas con nombre y color
- [ ] Múltiples etiquetas por contacto
- [ ] Filtrar por etiquetas
- [ ] Buscar por etiqueta

---

## 📦 ÉPICA 3: INTEGRACIÓN WHATSAPP (Sprint 2-3)

### **Historia 3.1: Conexión con WhatsApp** 🔴 MUST
**Como** agente  
**Quiero** conectar un número de WhatsApp al CRM  
**Para** recibir y enviar mensajes desde la plataforma

**Criterios de aceptación:**
- [ ] Escaneo de código QR (vía Evolution API)
- [ ] Estado de conexión (conectado/desconectado)
- [ ] Reconexión automática
- [ ] Múltiples números (opcional)

**Tareas técnicas:**
- Instalar/Configurar Evolution API
- Crear servicio de conexión WhatsApp
- Manejar eventos de conexión
- Guardar instancias en BD

---

### **Historia 3.2: Recibir mensajes WhatsApp** 🔴 MUST
**Como** agente  
**Quiero** recibir mensajes de WhatsApp en tiempo real  
**Para** responder rápidamente a los clientes

**Criterios de aceptación:**
- [ ] Webhook que recibe mensajes entrantes
- [ ] Identificar contacto por teléfono (crear si no existe)
- [ ] Notificación en tiempo real al agente
- [ ] Guardar mensaje en historial

**Tareas técnicas:**
- Endpoint POST /webhooks/whatsapp
- Lógica de matching de contactos
- WebSockets para notificaciones
- Almacenamiento en tabla mensajes

---

### **Historia 3.3: Enviar mensajes WhatsApp** 🔴 MUST
**Como** agente  
**Quiero** enviar mensajes de WhatsApp desde el CRM  
**Para** responder sin salir de la plataforma

**Criterios de aceptación:**
- [ ] Interfaz de chat similar a WhatsApp
- [ ] Envío de texto
- [ ] Adjuntar imágenes/documentos
- [ ] Confirmación de entrega (✓, ✓✓)

**Tareas técnicas:**
- Componente ChatWindow
- API para enviar mensajes
- Integración con Evolution API
- Manejo de archivos

---

### **Historia 3.4: Plantillas WhatsApp** 🟢 COULD
**Como** agente  
**Quiero** guardar respuestas frecuentes como plantillas  
**Para** responder más rápido

**Criterios de aceptación:**
- [ ] Crear plantillas de texto
- [ ] Acceso rápido desde el chat
- [ ] Variables personalizables ({{nombre}}, {{empresa}})

---

## 📦 ÉPICA 4: INTEGRACIÓN EMAIL (Sprint 3-4)

### **Historia 4.1: Configuración SMTP** 🔴 MUST
**Como** administrador  
**Quiero** configurar el servidor de correo saliente  
**Para** enviar emails desde el CRM

**Criterios de aceptación:**
- [ ] Configuración SMTP (host, puerto, usuario, contraseña)
- [ ] Prueba de conexión
- [ ] Soporte para Gmail, SendGrid, Brevo
- [ ] Múltiples remitentes

**Tareas técnicas:**
- Panel de configuración SMTP
- Validar credenciales
- Usar Nodemailer para envíos
- Guardar configuración en BD

---

### **Historia 4.2: Recibir emails entrantes** 🔴 MUST
**Como** agente  
**Quiero** recibir emails de clientes en el CRM  
**Para** tener todo centralizado

**Criterios de aceptación:**
- [ ] Webhook para inbound email
- [ ] Parsear contenido y adjuntos
- [ ] Asociar a contacto existente (por email)
- [ ] Notificación en tiempo real

**Tareas técnicas:**
- Endpoint POST /webhooks/email
- Integración con Brevo Inbound/SendGrid Parse
- Procesar attachments
- Vincular con conversaciones

---

### **Historia 4.3: Enviar emails desde CRM** 🔴 MUST
**Como** agente  
**Quiero** enviar emails desde el CRM  
**Para** gestionar toda la comunicación en un lugar

**Criterios de aceptación:**
- [ ] Editor de emails (formato básico)
- [ ] Adjuntar archivos
- [ ] Guardar en historial del contacto
- [ ] Copia en Bandeja de enviados

**Tareas técnicas:**
- Componente EmailComposer
- API de envío con Nodemailer
- Subida de archivos
- Integración con historial

---

### **Historia 4.4: Plantillas de email** 🟡 SHOULD
**Como** agente  
**Quiero** usar plantillas predefinidas  
**Para** agilizar respuestas comunes

**Criterios de aceptación:**
- [ ] CRUD de plantillas
- [ ] Variables ({{nombre}}, {{empresa}})
- [ ] Previsualización
- [ ] Selección rápida al redactar

---

## 📦 ÉPICA 5: INTEGRACIÓN SMS (Sprint 4)

### **Historia 5.1: Configuración SMS** 🟡 SHOULD
**Como** administrador  
**Quiero** configurar un proveedor SMS  
**Para** enviar mensajes de texto

**Criterios de aceptación:**
- [ ] Integración con Twilio (crédito inicial)
- [ ] Verificar número
- [ ] Configurar webhook de recepción

**Tareas técnicas:**
- Registro en Twilio
- Configuración de credenciales
- Endpoint para webhooks

---

### **Historia 5.2: Envío y recepción SMS** 🟡 SHOULD
**Como** agente  
**Quiero** enviar y recibir SMS  
**Para** contactar con clientes sin WhatsApp

**Criterios de aceptación:**
- [ ] Enviar SMS desde el CRM
- [ ] Recibir SMS (webhook)
- [ ] Unificado en el mismo historial
- [ ] Notificaciones

---

## 📦 ÉPICA 6: TAREAS Y RECORDATORIOS (Sprint 2-3)

### **Historia 6.1: Crear tareas** 🔴 MUST
**Como** agente  
**Quiero** crear tareas de seguimiento  
**Para** no olvidar acciones importantes

**Criterios de aceptación:**
- [ ] Título, descripción, fecha límite
- [ ] Prioridad (baja, media, alta, urgente)
- [ ] Asociar a contacto específico
- [ ] Estado (pendiente, en progreso, completada)

**Tareas técnicas:**
- Modelo Tarea en BD
- CRUD de tareas
- Relación con contactos
- Vista de tareas pendientes

---

### **Historia 6.2: Recordatorios automáticos** 🟡 SHOULD
**Como** agente  
**Quiero** recibir recordatorios de tareas  
**Para** cumplir plazos

**Criterios de aceptación:**
- [ ] Notificación push antes de la fecha límite
- [ ] Email recordatorio
- [ ] Configurar tiempo de aviso (1h, 24h, etc.)
- [ ] Marcar como leído el recordatorio

**Tareas técnicas:**
- Servicio de jobs programados (node-cron)
- Notificaciones push (WebSocket/Service Workers)
- Plantillas de email recordatorio

---

## 📦 ÉPICA 7: PANEL DE MÉTRICAS (Sprint 3-4)

### **Historia 7.1: KPIs básicos** 🔴 MUST
**Como** supervisor  
**Quiero** ver métricas clave en dashboard  
**Para** evaluar el rendimiento

**Criterios de aceptación:**
- [ ] Contactos activos hoy
- [ ] Mensajes enviados (hoy/semana/mes)
- [ ] Tasa de respuesta promedio
- [ ] Tareas pendientes

**Tareas técnicas:**
- Tabla metricas_diarias en BD
- Consultas agregadas
- Componentes de KPIs en frontend
- Actualización en tiempo real

---

### **Historia 7.2: Gráficos de actividad** 🟡 SHOULD
**Como** supervisor  
**Quiero** ver gráficos de actividad  
**Para** identificar tendencias

**Criterios de aceptación:**
- [ ] Gráfico de mensajes por día
- [ ] Distribución por canal (WhatsApp/Email/SMS)
- [ ] Top 5 agentes por actividad
- [ ] Filtros por fecha

**Tareas técnicas:**
- Integración con Chart.js/Recharts
- Endpoints para datos agregados
- Filtros interactivos

---

### **Historia 7.3: Exportar reportes** 🟡 SHOULD
**Como** supervisor  
**Quiero** exportar datos a CSV/PDF  
**Para** compartir con el equipo

**Criterios de aceptación:**
- [ ] Exportar contactos (CSV)
- [ ] Exportar reporte de actividad (PDF)
- [ ] Seleccionar columnas a exportar
- [ ] Filtros aplicados

**Tareas técnicas:**
- json2csv para CSV
- Puppeteer/pdfkit para PDF
- Descarga automática en frontend

---

## 📦 ÉPICA 8: VISTAS PERSONALIZADAS (Sprint 4)

### **Historia 8.1: Guardar filtros** 🟢 COULD
**Como** agente  
**Quiero** guardar mis filtros favoritos  
**Para** acceder rápidamente

**Criterios de aceptación:**
- [ ] Guardar combinación de filtros
- [ ] Nombrar la vista
- [ ] Vista predeterminada
- [ ] Compartir vistas (supervisor)

**Tareas técnicas:**
- Modelo VistasGuardadas en BD
- Serializar filtros JSON
- Aplicar filtros guardados

---

### **Historia 8.2: Vistas de tabla personalizables** 🟢 COULD
**Como** agente  
**Quiero** elegir qué columnas ver  
**Para** mostrar solo información relevante

**Criterios de aceptación:**
- [ ] Seleccionar columnas visibles
- [ ] Reordenar columnas
- [ ] Guardar preferencias
- [ ] Reset a valores por defecto

---

## 📦 ÉPICA 9: INTERFAZ DE CHAT UNIFICADO (Sprint 2-3)

### **Historia 9.1: Bandeja unificada** 🔴 MUST
**Como** agente  
**Quiero** ver todos los mensajes (WhatsApp, Email, SMS) en una sola bandeja  
**Para** gestionar todo desde un lugar

**Criterios de aceptación:**
- [ ] Lista de conversaciones ordenadas por última actividad
- [ ] Indicador de canal (ícono WhatsApp/Email/SMS)
- [ ] Mensajes no leídos destacados
- [ ] Búsqueda en conversaciones

**Tareas técnicas:**
- Query unificada de mensajes
- Componente ConversationList
- Badges por canal
- WebSocket para nuevos mensajes

---

### **Historia 9.2: Vista de conversación con historial completo** 🔴 MUST
**Como** agente  
**Quiero** ver todo el historial con un contacto  
**Para** tener contexto completo

**Criterios de aceptación:**
- [ ] Todos los mensajes ordenados cronológicamente
- [ ] Diferenciar canal por color/ícono
- [ ] Adjuntos visibles
- [ ] Información del contacto visible siempre

**Tareas técnicas:**
- Componente ConversationThread
- Agrupar por fecha
- Renderizar diferentes tipos de mensaje
- Sidebar con info de contacto

---

### **Historia 9.3: Respuesta rápida con selector de canal** 🟡 SHOULD
**Como** agente  
**Quiero** elegir el canal al responder  
**Para** comunicarme como el cliente prefiera

**Criterios de aceptación:**
- [ ] Botones para WhatsApp/Email/SMS
- [ ] Recordar último canal usado
- [ ] Sugerir canal preferido del cliente

---

## 📦 ÉPICA 10: CONFIGURACIÓN DEL SISTEMA (Sprint 1 y 4)

### **Historia 10.1: Configuración de etiquetas predefinidas** 🟡 SHOULD
**Como** administrador  
**Quiero** definir etiquetas globales  
**Para** estandarizar la segmentación

**Criterios de aceptación:**
- [ ] CRUD de etiquetas
- [ ] Colores personalizables
- [ ] Etiquetas por defecto al crear contacto

---

### **Historia 10.2: Configuración de etapas del funnel** 🟡 SHOULD
**Como** administrador  
**Quiero** personalizar las etapas del funnel  
**Para** adaptarme al proceso de ventas

**Criterios de aceptación:**
- [ ] Crear, editar, reordenar etapas
- [ ] Activar/desactivar etapas
- [ ] Colores por etapa

---

## 📋 SPRINT PLANNING SUGERIDO

| Sprint | Duración | Épocas | Historias |
|--------|----------|--------|-----------|
| **Sprint 1** | 2 semanas | Épica 1, Épica 2 | 1.1, 1.2, 1.3, 2.1, 2.2 |
| **Sprint 2** | 2 semanas | Épica 3, Épica 9 | 3.1, 3.2, 3.3, 9.1, 9.2 |
| **Sprint 3** | 2 semanas | Épica 4, Épica 6 | 4.1, 4.2, 4.3, 6.1, 6.2 |
| **Sprint 4** | 2 semanas | Épica 5, Épica 7, Épica 8 | 5.1, 5.2, 7.1, 7.2, 8.1 |
| **Sprint 5** | 2 semanas | Refinamiento y pruebas | 3.4, 4.4, 7.3, 8.2, 10.1, 10.2 |

---

## 📊 ESTIMACIÓN EN PUNTOS DE HISTORIA

| Historia | Puntos | Dificultad |
|----------|--------|------------|
| 1.1 Registro | 3 | Baja |
| 1.2 Login | 2 | Muy baja |
| 1.3 Roles | 5 | Media |
| 2.1 CRUD contactos | 8 | Alta |
| 2.2 Funnel | 5 | Media |
| 2.3 Etiquetas | 3 | Baja |
| 3.1 Conexión WhatsApp | 8 | Alta |
| 3.2 Recibir WhatsApp | 5 | Media |
| 3.3 Enviar WhatsApp | 5 | Media |
| 4.1 Config SMTP | 3 | Baja |
| 4.2 Recibir emails | 5 | Media |
| 4.3 Enviar emails | 5 | Media |
| 6.1 Tareas | 3 | Baja |
| 6.2 Recordatorios | 5 | Media |
| 7.1 KPIs | 3 | Baja |
| 9.1 Bandeja unificada | 8 | Alta |
| 9.2 Historial | 5 | Media |

**Total MVP (Must + Should):** ~70 puntos (4-5 sprints de 2 semanas)

---

## 🎯 DEFINICIÓN DE "DONE" (DoD)

Para cada historia:
- [ ] Código desarrollado y commiteado
- [ ] Pruebas unitarias pasan (>80% cobertura)
- [ ] Documentación de API actualizada
- [ ] Integración con BD probada
- [ ] Frontend implementado (si aplica)
- [ ] Responsive design básico
- [ ] Sin errores en consola
- [ ] Code review aprobado
- [ ] Desplegado en entorno de pruebas
 ## 👥 TODOS LOS USUARIOS (STAKEHOLDERS) DEL SISTEMA CRM

lista completa de **todos los actores** que interactúan con el sistema:

---

## 🎯 CLASIFICACIÓN POR TIPO DE USUARIO

```
┌─────────────────────────────────────────────────────────────────┐
│                    SISTEMA CRM COMPLETO                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  USUARIOS INTERNOS (Trabajan DENTRO del CRM)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Agente/Soporte     → Usa el CRM para atender clientes │   │
│  │ • Supervisor/Manager → Supervisa equipos y métricas     │   │
│  │ • Administrador      → Configura el sistema             │   │
│  │ • Director/Ventas    → Ve reportes estratégicos         │   │
│  │ • Onboarding         → Da de alta nuevos clientes       │   │
│  │ • Marketing          → Crea campañas y segmenta         │   │
│  │ • Facturación        → Gestiona pagos (si aplica)       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  USUARIOS EXTERNOS (Interactúan FUERA del CRM)                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Cliente/Lead       → Recibe comunicaciones            │   │
│  │ • Visitante web      → Usa widget de chat               │   │
│  │ • Proveedor/Partner  → Se comunica con el equipo        │   │
│  │ • Inversores         → Reciben reportes (opcional)      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  USUARIOS TÉCNICOS (Gestionan la plataforma)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Desarrollador      → Mantiene y mejora el CRM         │   │
│  │ • DevOps             → Gestiona servidores y despliegues│   │
│  │ • DBA                → Optimiza base de datos           │   │
│  │ • Auditor            → Revisa logs y seguridad          │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👨‍💼 USUARIOS INTERNOS (DETALLADOS)

### **1. AGENTE / SOPORTE** 👤 (Ya lo vimos)
El usuario principal del día a día.

**Objetivo:** Atender clientes y leads eficientemente

**Necesidades:**
- Bandeja unificada de mensajes
- Respuestas rápidas
- Historial completo del cliente
- Tareas y recordatorios
- Métricas personales

---

### **2. SUPERVISOR / MANAGER** 👥

**Como** supervisor de equipo  
**Quiero** monitorear el rendimiento de mis agentes  
**Para** asegurar la calidad del servicio y cumplir objetivos

**Necesidades específicas:**
```
📊 PANEL DE SUPERVISOR
├── Ver actividad de TODOS los agentes
├── Reasignar contactos entre agentes
├── Alertas de conversaciones sin respuesta (+24h)
├── Métricas comparativas entre agentes
├── Exportar reportes del equipo
├── Configurar objetivos (KPIs)
└── Escalar conversaciones complejas
```

**Historias de usuario adicionales:**
```javascript
// Historia: Dashboard de equipo
Como supervisor
Quiero ver un dashboard con el rendimiento de todos mis agentes
Para identificar quién necesita ayuda o reconocimiento

Criterios:
- Top 5 agentes por conversaciones resueltas
- Tasa de respuesta por agente
- Alertas de bajo rendimiento
- Comparativa vs objetivos
```

---

### **3. ADMINISTRADOR DEL SISTEMA** ⚙️

**Como** administrador técnico  
**Quiero** configurar y mantener el sistema  
**Para** que todo funcione correctamente

**Necesidades específicas:**
```
⚙️ PANEL DE ADMIN
├── Gestión de usuarios (alta/baja/roles)
├── Configuración de integraciones (WhatsApp, Email)
├── Personalización del funnel y etiquetas
├── Ver logs del sistema
├── Configurar backups
├── Gestión de plantillas globales
└── Auditoría de cambios
```

**Historias de usuario:**
```javascript
// Historia: Configurar integraciones
Como administrador
Quiero conectar el CRM con WhatsApp y email
Para que los agentes puedan comunicarse

Criterios:
- Formulario para credenciales API
- Probar conexión antes de guardar
- Estado de conexión (verde/rojo)
- Logs de errores de integración
```

---

### **4. DIRECTOR / VENTAS** 📈

**Como** director comercial  
**Quiero** ver métricas estratégicas  
**Para** tomar decisiones de negocio

**Necesidades específicas:**
```
📈 DASHBOARD ESTRATÉGICO
├── Tasa de conversión lead → cliente
├── Ingresos estimados por pipeline
├── Tendencias mensuales/anuales
├── ROI por canal (WhatsApp vs Email)
├── Previsión de ventas
└── Exportar presentaciones (PDF)
```

**Historias de usuario:**
```javascript
// Historia: Reportes ejecutivos
Como director
Quiero ver reportes consolidados del mes
Para presentar resultados al consejo

Criterios:
- Gráficos de tendencias
- Comparativa vs meses anteriores
- Exportar a PDF con logo empresa
- Enviar por email automáticamente
```

---

### **5. ONBOARDING / ÉXITO DEL CLIENTE** 🚀

**Como** especialista en onboarding  
**Quiero** dar la bienvenida a nuevos clientes  
**Para** asegurar una buena primera experiencia

**Necesidades específicas:**
- Automatizar emails de bienvenida
- Checklists de onboarding
- Programar llamadas de seguimiento
- Recibir alertas cuando un cliente no interactúa

---

### **6. MARKETING** 📢

**Como** marketer  
**Quiero** segmentar contactos y enviar campañas  
**Para** nutrir leads y promocionar productos

**Necesidades específicas:**
```
📧 HERRAMIENTAS DE MARKETING
├── Segmentación avanzada (etiquetas + comportamiento)
├── Crear campañas de email masivas
├── Programar envíos
├── A/B testing de asuntos
├── Métricas de apertura/clicks
└── Gestión de bajas (unsubscribe)
```

**Historias de usuario:**
```javascript
// Historia: Campañas de email
Como marketer
Quiero enviar newsletters a segmentos específicos
Para mantener engagement con leads

Criterios:
- Seleccionar contactos por etiquetas
- Editor de emails con plantillas
- Programar fecha/hora
- Ver estadísticas post-envío
```

---

### **7. FACTURACIÓN / ADMINISTRACIÓN** 💰

**Como** administrador de facturación  
**Quiero** gestionar pagos y facturas de clientes  
**Para** mantener las cuentas al día

**Necesidades específicas:**
- Asociar contactos con datos de facturación
- Registrar pagos recibidos
- Enviar facturas automáticas
- Alertas de pagos vencidos
- Reportes de ingresos

---

## 👥 USUARIOS EXTERNOS (DETALLADOS)

### **1. CLIENTE / LEAD** 👤

**Como** cliente potencial  
**Quiero** comunicarme con la empresa por mis canales preferidos  
**Para** resolver dudas o comprar productos

**NO USA EL CRM DIRECTAMENTE**, pero interactúa a través de:
- WhatsApp (app normal)
- Email (Gmail/Outlook)
- SMS (app de mensajes)
- Widget en la web

---

### **2. VISITANTE WEB** 🌐

**Como** visitante del sitio web  
**Quiero** chatear con soporte sin salir de la página  
**Para** obtener ayuda inmediata

**Interacción:**
- Usa el widget flotante de Brevo
- No necesita registrarse
- Puede dejar su email para contacto futuro

---

### **3. PROVEEDOR / PARTNER** 🤝

**Como** proveedor externo  
**Quiero** comunicarme con el equipo de compras  
**Para** coordinar entregas o cotizaciones

**Características:**
- Contacto específico asignado
- Historial de conversaciones
- Documentos compartidos

---

### **4. INVERSOR / CONSEJO** 📊

**Como** inversor  
**Quiero** recibir reportes periódicos del negocio  
**Para** evaluar el rendimiento de la inversión

**Interacción:**
- No accede al CRM directamente
- Recibe reportes por email
- Revisa dashboards públicos (opcional)

---

## 🔧 USUARIOS TÉCNICOS (DETALLADOS)

### **1. DESARROLLADOR** 💻

**Como** desarrollador del CRM  
**Quiero** mantener y mejorar el código  
**Para** añadir funcionalidades y corregir bugs

**Necesidades:**
- Documentación clara de API
- Entorno de desarrollo local
- Logs detallados
- Tests automatizados
- Versionado (Git)

---

### **2. DEVOPS** 🚢

**Como** DevOps  
**Quiero** gestionar el despliegue y la infraestructura  
**Para** asegurar disponibilidad 24/7

**Necesidades:**
- Scripts de despliegue automático
- Monitorización de servidores
- Alertas de caídas
- Backups automáticos
- Escalado cuando sea necesario

---

### **3. DBA (Database Administrator)** 🗄️

**Como** administrador de base de datos  
**Quiero** optimizar consultas y mantener la integridad  
**Para** que el CRM sea rápido y confiable

**Necesidades:**
- Acceso a queries lentas
- Optimización de índices
- Backups y restauración
- Limpieza de datos antiguos

---

### **4. AUDITOR** 🔍

**Como** auditor de seguridad  
**Quiero** revisar logs de acceso y cambios  
**Para** asegurar cumplimiento normativo (GDPR, etc.)

**Necesidades:**
- Logs de todas las acciones importantes
- Trazabilidad de cambios en datos sensibles
- Exportación de auditorías
- Alertas de actividad sospechosa

---

## 📊 MATRIZ DE PERMISOS COMPLETA

| Funcionalidad | Agente | Supervisor | Admin | Director | Marketing | Facturación |
|--------------|--------|------------|-------|----------|-----------|-------------|
| **Ver mis conversaciones** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Ver todas conversaciones** | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Gestionar contactos propios** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Gestionar todos contactos** | ❌ | ✅ | ✅ | ❌ | ✅ (solo ver) | ❌ |
| **Métricas personales** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Métricas equipo** | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Métricas estratégicas** | ❌ | ⚠️ (limitado) | ✅ | ✅ | ⚠️ | ✅ |
| **Enviar campañas masivas** | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| **Ver facturación** | ❌ | ❌ | ✅ | ⚠️ | ❌ | ✅ |
| **Configurar integraciones** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Gestionar usuarios** | ❌ | ⚠️ (su equipo) | ✅ | ❌ | ❌ | ❌ |
| **Exportar datos** | Solo propios | Todo equipo | Todos | Solo reportes | Segmentos | Solo facturación |
| **Ver logs sistema** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## 🎯 RESUMEN DE STAKEHOLDERS

| Rol | Prioridad en MVP | ¿Usa CRM? | Objetivo principal |
|-----|------------------|-----------|-------------------|
| **Agente** | 🔴 MUST | ✅ Sí | Atender clientes |
| **Supervisor** | 🟡 SHOULD | ✅ Sí | Gestionar equipo |
| **Admin** | 🟡 SHOULD | ✅ Sí | Configurar sistema |
| **Director** | 🟢 COULD | ✅ Sí (limitado) | Visión estratégica |
| **Marketing** | 🟢 COULD | ✅ Sí | Campañas |
| **Facturación** | ⚪ WON'T | ⚠️ Futuro | Cobros |
| **Cliente** | 🔴 MUST | ❌ No | Recibir atención |
| **Visitante web** | 🔴 MUST | ❌ No | Contactar |
| **Desarrollador** | 🔴 MUST | ⚠️ Backend | Mantener código |

---

## 📋 BACKLOG ADICIONAL POR NUEVOS ROLES

### **Para SUPERVISOR (Prioridad SHOULD)**
```javascript
- Ver dashboard de equipo
- Reasignar conversaciones
- Alertas de SLA incumplido
- Reportes comparativos
- Configurar objetivos
```

### **Para DIRECTOR (Prioridad COULD)**
```javascript
- Reportes ejecutivos
- Previsión de ventas
- Tendencias de conversión
- Exportar presentaciones
- Métricas por producto/servicio
```

### **Para MARKETING (Prioridad COULD)**
```javascript
- Segmentación avanzada
- Campañas de email masivas
- A/B testing
- Analíticas de campañas
- Landing pages (futuro)
```

 
