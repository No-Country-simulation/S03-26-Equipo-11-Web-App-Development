# Épicas e Historias de Usuario — CRM Inteligente

---

## Épica 0: Infraestructura y Soporte

Historias transversales necesarias para el correcto funcionamiento del sistema.

---

### HU 0.1 – Autenticación y sesión de usuario

**Como** admin, **quiero** iniciar sesión en el CRM con mis credenciales **para** acceder a las funcionalidades.

> Asumido ya implementado, pero se debe documentar.

**Criterios de aceptación:**
- Login con email y contraseña.
- El sistema mantiene la sesión mediante JWT.

---

### HU 0.2 – Documentación de API (Swagger/OpenAPI)

**Como** desarrollador, **quiero** tener documentación interactiva de los endpoints **para** facilitar el consumo y pruebas.

**Criterios de aceptación:**
- Se expone una interfaz Swagger en `/swagger-ui.html`.
- Todos los endpoints están documentados con descripciones, parámetros y ejemplos.

---

### HU 0.3 – Logging y monitoreo básico

**Como** administrador técnico, **quiero** que el sistema registre errores y eventos importantes **para** poder diagnosticar fallos.

**Criterios de aceptación:**
- Archivos de log rotativos.
- Configuración de niveles (`DEBUG`, `INFO`, `ERROR`) por entorno.

---

## Épica 1: Gestión de Contactos

El admin puede administrar el directorio de contactos: crear, buscar, editar, cambiar estado y eliminar.

---

### HU 1.1 – Crear un nuevo contacto

**Como** admin, **quiero** crear un contacto con nombre, email, teléfono y empresa **para** tener registrados mis leads y clientes.

**Criterios de aceptación:**
- El formulario incluye campos: nombre, email, prefijo telefónico, número y empresa (todos obligatorios excepto empresa).
- Al enviar, el sistema asigna automáticamente el estado `Lead` y la fecha de último contacto como la fecha actual.
- El contacto se guarda en la base de datos y se muestra en la lista de contactos.

---

### HU 1.2 – Buscar y filtrar contactos

**Como** admin, **quiero** buscar contactos por nombre o empresa y filtrar por estado **para** encontrar rápidamente a un lead o cliente específico.

**Criterios de aceptación:**
- Un campo de búsqueda libre que filtre por coincidencia parcial en nombre o empresa.
- Un selector de estado: `Lead`, `Contactado`, `Propuesta`, `Cliente`, `Inactivo`.
- La lista se actualiza dinámicamente al aplicar los filtros.
- Soporte de paginación.

---

### HU 1.3 – Editar datos de un contacto

**Como** admin, **quiero** editar el nombre, email y empresa de un contacto **para** corregir información desactualizada.

**Criterios de aceptación:**
- Al hacer clic en "Editar" sobre un contacto, se abre un formulario precargado con los datos actuales.
- Los cambios se guardan y se reflejan en la lista y en el detalle del contacto.

---

### HU 1.4 – Actualizar el estado de un contacto

**Como** admin, **quiero** cambiar el estado de un contacto (`Lead → Contactado → Propuesta → Cliente → Inactivo`) **para** reflejar el avance en el funnel de ventas.

**Criterios de aceptación:**
- Se puede cambiar el estado desde la lista o desde la vista de detalle.
- El sistema registra el último cambio de estado.

---

### HU 1.5 – Eliminar un contacto (soft delete)

**Como** admin, **quiero** eliminar un contacto de forma que ya no aparezca en las listas activas **para** mantener limpia la base de datos sin perder el historial.

**Criterios de aceptación:**
- Al eliminar, el contacto se marca con `deleted_at` y ya no se muestra en los listados por defecto.
- Opcionalmente, se puede restaurar (no requerido en el flujo inicial).

---

### HU 1.6 – Exportar contactos a CSV

**Como** admin, **quiero** exportar la lista de contactos (con los filtros aplicados) a un archivo CSV **para** realizar análisis externos o reportes.

**Criterios de aceptación:**
- Botón de exportar que genera un CSV con todos los campos del contacto.
- Se respetan los filtros activos (`q`, `state`) al momento de exportar.
- El archivo se descarga automáticamente.

---

## Épica 2: Mensajería WhatsApp

El admin puede enviar y recibir mensajes de WhatsApp, gestionar conversaciones y visualizar métricas básicas.

---

### HU 2.1 – Recibir mensajes de WhatsApp entrantes

**Como** admin, **quiero** que los mensajes que me envían a mi número de WhatsApp lleguen al CRM **para** centralizar todas las comunicaciones.

**Criterios de aceptación:**
- El sistema expone un webhook (`POST /api/webhooks/whatsapp`) que recibe mensajes de WhatsApp Cloud API.
- Si el número pertenece a un contacto existente, el mensaje se asocia a ese contacto; si no, se crea un nuevo contacto con estado `Lead`.
- El mensaje se guarda en la base de datos y se muestra en el chat en tiempo real (WebSocket).

---

### HU 2.2 – Enviar mensajes de WhatsApp a un contacto

**Como** admin, **quiero** enviar mensajes de WhatsApp desde el CRM a cualquier contacto **para** comunicarme sin cambiar de aplicación.

**Criterios de aceptación:**
- Interfaz de chat donde selecciono un contacto y escribo un mensaje.
- Al enviar, el mensaje se registra como saliente y se transmite a través de la API de WhatsApp Cloud.
- El mensaje aparece en el hilo de conversación con estado `sent`.

---

### HU 2.3 – Visualizar conversación con un contacto

**Como** admin, **quiero** ver el historial completo de mensajes de WhatsApp con cada contacto **para** tener contexto antes de responder.

**Criterios de aceptación:**
- Al seleccionar un contacto, se muestran los mensajes ordenados cronológicamente (entrantes y salientes).
- Se puede hacer scroll para cargar mensajes antiguos (paginación mediante `before` timestamp).

---

### HU 2.4 – Ver métricas básicas de WhatsApp

**Como** admin, **quiero** conocer el total de mensajes enviados y recibidos **para** medir mi actividad en el canal.

**Criterios de aceptación:**
- En el dashboard de métricas se muestran contadores de mensajes enviados y recibidos (acumulados o en un período).
- Datos disponibles vía `GET /api/whatsapp/metrics/total` y `GET /api/whatsapp/metrics/weekly`.

---

## Épica 3: Mensajería Email

El admin puede enviar correos usando plantillas, ver la bandeja de entrada y gestionar hilos de conversación.

---

### HU 3.1 – Crear y gestionar plantillas de email

**Como** admin, **quiero** crear plantillas de correo con nombre, asunto y cuerpo HTML **para** reutilizarlas en envíos personalizados.

**Criterios de aceptación:**
- CRUD completo de plantillas: crear (`POST`), editar (`PUT`) y eliminar (`DELETE` hard delete).
- El editor de cuerpo HTML permite formato enriquecido (puede usarse un editor WYSIWYG).

---

### HU 3.2 – Enviar un email a un contacto usando una plantilla

**Como** admin, **quiero** seleccionar un contacto y una plantilla y enviar un correo personalizado **para** agilizar la comunicación.

**Criterios de aceptación:**
- Formulario que lista contactos y plantillas disponibles.
- Permite previsualizar el correo antes de enviar (con variables interpoladas: `nombre`, `empresa`).
- Al enviar, se utiliza el servidor SMTP configurado y se registra el envío en el log.

---

### HU 3.3 – Ver correos recibidos (bandeja de entrada)

**Como** admin, **quiero** ver los correos que llegan al buzón configurado **para** gestionar respuestas dentro del CRM.

**Criterios de aceptación:**
- Lista de correos entrantes con remitente, asunto y fecha (`GET /api/email/inbox`).
- Al hacer clic, se muestra el cuerpo completo del correo.
- Los correos se asocian automáticamente al contacto si el remitente coincide con algún email registrado.

---

### HU 3.4 – Visualizar hilo de conversación por email con un contacto

**Como** admin, **quiero** ver todos los correos intercambiados con un contacto (enviados y recibidos) **para** tener una visión completa de la relación.

**Criterios de aceptación:**
- Al seleccionar un contacto, se muestra un hilo con los correos ordenados cronológicamente.
- Se distinguen visualmente los correos enviados (salientes) de los recibidos (entrantes).

---

### HU 3.5 – Ver métricas de email

**Como** admin, **quiero** conocer el total de correos enviados, recibidos y la tasa de respuesta **para** evaluar la efectividad del canal.

**Criterios de aceptación:**
- KPIs en el dashboard: correos enviados, recibidos y tasa de respuesta.
- La tasa de respuesta se calcula como el porcentaje de correos enviados que recibieron respuesta.

---

## Épica 4: Recordatorios Inteligentes

El admin puede programar recordatorios asociados a contactos, con notificaciones automáticas por WhatsApp y/o email.

---

### HU 4.1 – Crear un recordatorio

**Como** admin, **quiero** crear un recordatorio con título, descripción, contacto asociado, prioridad, fecha/hora y método de notificación **para** no olvidar tareas importantes.

**Criterios de aceptación:**
- Formulario con campos obligatorios: título, descripción, contacto, prioridad (`ALTA`, `MEDIA`, `BAJA`), fecha, hora y métodos de notificación (`EMAIL`, `WHATSAPP` o ambos).
- Opción de configurar la anticipación en minutos antes de la fecha/hora programada.
- Al guardar, el backend registra el recordatorio con `done = false` (estado pendiente).

---

### HU 4.2 – Listar y filtrar recordatorios

**Como** admin, **quiero** ver mis recordatorios pendientes, vencidos y completados, y filtrarlos por fecha o contacto **para** priorizar mi trabajo.

**Criterios de aceptación:**
- Lista con filtros por estado (`PENDIENTE`, `VENCIDO`, `COMPLETADO`), contacto (`contact_id`) y rango de fechas (`from_date`, `to_date`).
- Cada fila muestra prioridad, fecha/hora, contacto asociado y estado actual.

---

### HU 4.3 – Reprogramar un recordatorio

**Como** admin, **quiero** cambiar la fecha, hora o método de notificación de un recordatorio existente **para** ajustarlo a cambios en mi agenda.

**Criterios de aceptación:**
- Desde la lista, la opción "Reprogramar" permite editar cualquier campo del recordatorio (`PUT /api/reminders/{id}`).
- Si el recordatorio ya está completado, no se puede reprogramar (o se puede reiniciar según las reglas de negocio definidas).

---

### HU 4.4 – Recibir notificaciones automáticas de recordatorios

**Como** admin, **quiero** recibir notificaciones por WhatsApp y/o email en la fecha y hora programada **para** que el sistema me recuerde la tarea.

**Criterios de aceptación:**
- Un scheduler revisa cada minuto los recordatorios cuya fecha/hora sea igual o anterior a la actual y que tengan `done = false`.
- Para cada uno, envía el mensaje y/o correo según los métodos configurados en el recordatorio.
- Tras el envío exitoso, el recordatorio se marca como completado (`done = true`).

---

### HU 4.5 – Ver historial de notificaciones enviadas

**Como** admin, **quiero** consultar qué notificaciones se enviaron para cada recordatorio **para** verificar que se cumplió.

**Criterios de aceptación:**
- En el detalle del recordatorio, se listan los intentos de notificación: fecha, método utilizado y resultado (`exitoso` / `fallido`).

---

## Épica 5: Métricas y Analítica

El admin puede visualizar KPIs, gráficos y reportes para medir el desempeño del CRM y del funnel de ventas.

---

### HU 5.1 – Ver KPIs generales

**Como** admin, **quiero** ver en un panel los indicadores clave (contactos activos, mensajes enviados, correos enviados, tasa de respuesta y tasa de conversión) **para** tener una visión rápida del estado del negocio.

**Criterios de aceptación:**
- El dashboard principal muestra tarjetas con cada KPI (`GET /api/analytics/kpis`).
- Los contactos activos excluyen los que tienen estado `Inactivo`.
- Los valores se actualizan en tiempo real o con recarga periódica.

---

### HU 5.2 – Ver gráfico de distribución por estado (funnel)

**Como** admin, **quiero** ver un histograma que muestre cuántos contactos hay en cada etapa del funnel **para** identificar cuellos de botella.

**Criterios de aceptación:**
- Gráfico de barras o circular con los estados: `Lead`, `Contactado`, `Propuesta`, `Cliente`, `Inactivo` (`GET /api/analytics/funnel`).
- Al hacer clic en una barra se puede filtrar la lista de contactos (opcional).

---

### HU 5.3 – Ver actividad semanal de mensajes y correos

**Como** admin, **quiero** ver un gráfico de barras con la cantidad de mensajes y correos enviados por día **para** entender mi actividad semanal.

**Criterios de aceptación:**
- Gráfico con dos series: WhatsApp enviados y emails enviados, agrupados por día (`GET /api/analytics/activity`).
- El período por defecto son los últimos 7 días, con opción de configurar rango y granularidad (`day`, `week`, `month`).

---

### HU 5.4 – Exportar reporte en PDF

**Como** admin, **quiero** exportar un reporte con todas las métricas en formato PDF **para** compartir con el equipo o archivar.

**Criterios de aceptación:**
- Botón "Exportar reporte" que genera un PDF con los datos actuales del dashboard (`GET /api/analytics/report`).
- El PDF incluye la fecha de generación y opcionalmente el logo de la empresa.

---

## Épica 6: Configuración

El admin puede configurar las integraciones con WhatsApp y email (SMTP) de forma centralizada.

---

### HU 6.1 – Configurar número de WhatsApp

**Como** admin, **quiero** indicar el número de teléfono desde el que se enviarán los mensajes de WhatsApp **para** que el CRM lo use en la API de Meta.

**Criterios de aceptación:**
- Formulario donde se ingresa el número con código de país.
- Al guardar, se valida opcionalmente la conexión con la WhatsApp Cloud API.

---

### HU 6.2 – Configurar servidor SMTP

**Como** admin, **quiero** ingresar los datos de mi servidor SMTP (host, puerto, usuario, contraseña) **para** poder enviar correos desde el CRM.

**Criterios de aceptación:**
- Formulario con campos: servidor, puerto, usuario y contraseña.
- Opción de probar la conexión mediante el envío de un correo de prueba antes de guardar.

---

## Notas de planificación

- Las historias están ordenadas por épica para facilitar la planificación de sprints.
- Se recomienda asignar story points durante el sprint planning según complejidad técnica.
- Las prioridades pueden ajustarse en función del MVP definido por el equipo.
- Las integraciones con WhatsApp Cloud API y SMTP requieren credenciales válidas y pruebas de conexión antes de pasar a producción.
- La Épica 0 debe completarse antes de iniciar cualquier otra épica.
