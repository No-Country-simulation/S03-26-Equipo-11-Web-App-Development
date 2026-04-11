# Startup CRM - Product Requirements Document (PRD)

## 1. Requerimientos Funcionales

### 1.1 Gestión de Contactos
- **RF1:** Crear, editar y eliminar contactos
- **RF2:** Segmentación por etapa del funnel (new, contacted, qualified, proposal, won, lost)
- **RF3:** Asignar etiquetas personalizadas a contactos
- **RF4:** Registrar información de contacto (nombre, email, teléfono, empresa, notas)
- **RF5:** Historial de interacciones por contacto

### 1.2 Omnicanalidad
- **RF6:** Integración con WhatsApp Cloud API (Meta)
- **RF7:** Integración con SMTP para envío de emails
- **RF8:** Integración con IMAP para recepción de emails
- **RF9:** Vista unificada de conversaciones por contacto

### 1.3 Gestión de Correos
- **RF10:** Enviar emails desde la aplicación
- **RF11:** Utilizar plantillas predefinidas de email
- **RF12:** Etiquetar emails enviados/recibidos
- **RF13:** Registrar emails en el historial del contacto

### 1.4 Automatización
- **RF14:** Crear recordatorios automáticos para tareas
- **RF15:** Configurar seguimientos automáticos según etapa del funnel
- **RF16:** Notificaciones para contactos sin actividad reciente

### 1.5 Analítica
- **RF17:** Panel de métricas con KPIs clave
- **RF18:** Contador de contactos activos por etapa
- **RF19:** Métricas de mensajes enviados (WhatsApp + Email)
- **RF20:** Tasa de respuesta por canal
- **RF21:** Visualización mediante gráficos (recharts)

### 1.6 Exportación de Datos
- **RF22:** Exportar contactos a formato CSV
- **RF23:** Exportar contactos a formato PDF
- **RF24:** Exportar historial de conversaciones

### 1.7 Personalización
- **RF25:** Crear etiquetas personalizadas
- **RF26:** Configurar vistas personalizadas
- **RF27:** Guardar filtros favoritos

## 2. Requerimientos No Funcionales

### 2.1 Rendimiento
- Tiempo de carga de página < 3 segundos
- Respuesta de API < 500ms

### 2.2 Usabilidad
- Interfaz intuitiva y fácil de usar
- Diseño responsivo (mobile-friendly)
- Accesibilidad básica (contraste, etiquetas)

### 2.3 Mantenibilidad
- Código bien estructurado y documentado
- Estructura de componentes reutilizables
- Configuración centralizada de entorno

### 2.4 Seguridad
- Validación de inputs en formularios
- Sanitización de datos antes de mostrar
- Variables de entorno para credenciales

## 3. Casos de Uso Principales

### UC1: Registrar Nuevo Contacto
1. Usuario accede a sección Contactos
2.Hace clic en "Nuevo Contacto"
3. Completa formulario (nombre, email, teléfono, empresa)
4. Asigna etapa del funnel
5. Guarda contacto

### UC2: Enviar Mensaje por WhatsApp
1. Usuario selecciona contacto
2. Abre conversación de WhatsApp
3. Redacta mensaje
4. Envía mensaje
5. Sistema registra en historial

### UC3: Enviar Email
1. Usuario selecciona contacto
2. Hace clic en "Enviar Email"
3. Selecciona plantilla o redacta
4. Envía email
5. Sistema registra en historial

### UC4: Configurar Recordatorio
1. Usuario accede a sección Recordatorios
2. Crea nuevo recordatorio
3. Selecciona contacto/actividad
4. Define fecha y hora
5. Configura repetición (opcional)
6. Guarda recordatorio

### UC5: Ver Analíticas
1. Usuario accede al Dashboard
2. Visualiza KPIs principales
3. Filtra por rango de fecha
4. Expande detalles si requiere

### UC6: Exportar Contactos
1. Usuario accede a Contactos
2. Aplica filtros deseados
3. Selecciona "Exportar"
4. Elige formato (CSV/PDF)
5. Descarga archivo

## 4. Integraciones Externas

| Servicio | Propósito | API/Librería |
|----------|-----------|--------------|
| WhatsApp Cloud API | Mensajería WhatsApp | Meta Cloud API |
| SMTP (Gmail) | Envío de emails | nodemailer |
| IMAP (Gmail) | Recepción de emails | imap + mailparser |

## 5. Estructura de Datos

### Contacto
```
- id: string
- name: string
- email: string
- phone: string
- company: string
- stage: FunnelStage
- tags: string[]
- notes: string
- createdAt: Date
- updatedAt: Date
```

### Etapas del Funnel
- `new` - Nuevo lead
- `contacted` - Contactado
- `qualified` - Calificado
- `proposal` - Propuesta enviada
- `won` - Ganado
- `lost` - Perdido

### Mensaje
```
- id: string
- contactId: string
- channel: "whatsapp" | "email"
- direction: "inbound" | "outbound"
- content: string
- timestamp: Date
```

### Recordatorio
```
- id: string
- contactId: string
- title: string
- description: string
- dueDate: Date
- completed: boolean
- createdAt: Date
```

## 6. Entregables Esperados

1. **Prototipo funcional** - Flujos básicos de gestión de usuarios, comunicación y segmentación
2. **Panel de métricas** - Visualización de KPIs (contactos activos, mensajes enviados, tasa de respuesta)
3. **Documentación técnica** - Endpoints API y guía de instalación

## 7. Métricas de Éxito

| Métrica | Target |
|---------|--------|
| Contactos gestionados | >= 100 |
| Mensajes enviados/día | >= 50 |
| Tasa de respuesta | >= 30% |
| Satisfacción de usuario | >= 4/5 |
