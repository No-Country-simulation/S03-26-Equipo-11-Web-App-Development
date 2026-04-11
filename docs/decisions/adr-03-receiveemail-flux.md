# ADR-03: Flujo de Recepción de Emails - "El Cartero Programado"

## 🎯 Concepto General: "El Cartero Programado"

Imagina que tu sistema tiene un **cartero automático** que va a revisar el buzón (IMAP) cada cierto tiempo, pero de forma inteligente: solo trae los sobres nuevos y los deja organizados en la bandeja de entrada (base de datos) para que la recepcionista (frontend) los muestre al instante.

---

## 📊 Diagrama del Flujo Conceptual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         "EL CARTERO PROGRAMADO"                             │
│                   (Se activa cada 2-3 minutos automáticamente)              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PASO 1: REVISAR EL MARCAPÁGINAS                                            │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Pregunta: "¿Cuál fue el último correo que traje?"                   │ │
│  │  Lo busca en su libreta (tabla: email_sync_control)                  │ │
│  │  Si es la primera vez → last_processed_uid = 0                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PASO 2: IR AL BUZÓN (IMAP) Y PREGUNTAR POR CORREOS NUEVOS                  │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  "Dame los correos con número mayor al que tengo anotado"            │ │
│  │  "Pero solo tráeme los primeros 5, no quiero saturarme"              │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PASO 3: ¿HAY CORREOS NUEVOS?                                               │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │           ┌─────────────────┐     ┌─────────────────┐                │ │
│  │           │   NO HAY NUEVOS │     │  HAY 1 A 5       │                │ │
│  │           │   → FIN DEL     │     │  CORREOS NUEVOS  │                │ │
│  │           │     PROCESO     │     │  → CONTINUAR     │                │ │
│  │           └─────────────────┘     └─────────────────┘                │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼ (Hay correos nuevos)
┌─────────────────────────────────────────────────────────────────────────────┐
│  PASO 4: PROCESAR CADA CORREO NUEVO                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  POR CADA correo en la lista:                                        │ │
│  │    1. Extraer: remitente, asunto, contenido, fecha                   │ │
│  │    2. Buscar o crear contacto en tabla contacts                      │ │
│  │    3. Guardar mensaje en tabla messages                              │ │
│  │    4. Anotar el UID de este correo como el "último procesado"        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PASO 5: ACTUALIZAR EL MARCAPÁGINAS                                         │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Guardar en email_sync_control el nuevo last_processed_uid           │ │
│  │  (así la próxima vez no vuelve a traer los mismos correos)            │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  PASO 6: FIN DEL PROCESO                                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  El cartero descansa hasta la próxima ejecución programada           │ │
│  │  (2-3 minutos después)                                               │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Tablas Involucradas

| Nombre de la tabla | Propósito | Columnas clave |
|-------------------|-----------|----------------|
| **email_sync_control** | Libreta del cartero. Guarda el último correo que ya fue procesado. | `id` (siempre 1), `last_processed_uid`, `last_sync_at` |
| **contacts** (ya existe) | Fichas de clientes. | `id`, `name`, `email`, `stage`, etc. |
| **messages** (ya existe) | Registro de todas las comunicaciones. | `id`, `contact_id`, `canal`, `direccion`, `contenido`, `asunto`, `fecha` |

---

## 🧠 Pseudocódigo

```text
PROCESO "Cartero Programado" (ejecutar cada 2-3 minutos)

INICIO

    // 1. Leer el marcapáginas
    ultimo_uid = LEER_TABLA(email_sync_control, "last_processed_uid")
    SI ultimo_uid está vacío ENTONCES:
        ultimo_uid = 0

    // 2. Conectar al buzón IMAP
    conexion = ABRIR_CONEXION_IMAP()

    // 3. Pedir SOLO los correos más recientes (máximo 5)
    correos_nuevos = conexion.BUSCAR("UID > {ultimo_uid}", LIMITE=5)

    // 4. Si no hay correos nuevos, terminar
    SI correos_nuevos está vacío ENTONCES:
        CERRAR_CONEXION(conexion)
        TERMINAR

    // 5. Procesar cada correo nuevo
    PARA CADA correo EN correos_nuevos:
        // Extraer datos del correo
        uid_correo = correo.UID
        email_remitente = correo.DE
        asunto = correo.ASUNTO
        contenido = correo.TEXTO
        fecha = correo.FECHA

        // Buscar o crear contacto
        contacto = BUSCAR_EN_TABLA(contacts, "email = {email_remitente}")
        SI contacto NO existe ENTONCES:
            contacto = CREAR_NUEVO_CONTACTO({...})

        // Guardar mensaje entrante
        mensaje = CREAR_NUEVO_MENSAJE({
            "contact_id": contacto.id,
            "canal": "email",
            "direccion": "entrante",
            "contenido": contenido,
            "asunto": asunto,
            "leido": 0,
            "entregado": 1,
            "metadata": JSON({"uid": uid_correo})
        })

        // Actualizar marcapáginas
        SI uid_correo > ultimo_uid ENTONCES:
            ultimo_uid = uid_correo

    // 6. Guardar el nuevo marcapáginas
    ACTUALIZAR_TABLA(email_sync_control, last_processed_uid, last_sync_at)

    CERRAR_CONEXION(conexion)
TERMINAR
```

---

## 📊 Comparativa Antes vs. Después

| Aspecto | Antes (Síncrono) | Después (Cartero Programado) |
|---------|------------------|------------------------------|
| **Quién conecta al IMAP** | El usuario (cada vez que pide ver correos) | El cartero (cada 2-3 min, automático) |
| **Tiempo de espera del usuario** | 2-3 minutos viendo carga | Casi 0 segundos (solo lectura de BD) |
| **Procesamiento de correos** | Uno por uno, sin límite | Máximo 5 por ronda (controlado) |
| **Detección de duplicados** | Revisando toda la BD | Por UID (rápido y eficiente) |
| **Escalabilidad** | Mala | Buena |

---

## 🎯 Nombre del Patrón

**"Procesamiento por Lotes con Punto de Control" (Batch Processing with Checkpoint)**

---

## ✅ Resumen de Mejoras

| Idea original | Mejora aplicada |
|---------------|-----------------|
| "mantener back y front actuales" | Frontend solo lee de BD, el cron hace lo pesado |
| "tabla con el id del último email" | Se crea `email_sync_control` |
| "procesar 5 emails" | Solo trae correos con UID > último, límite 5 |
| "registra en contacts y messages" | Búsqueda/creación de contacto + guardado en messages |
| "ejecutar cada cierto tiempo" | Cron job cada 2-3 minutos |