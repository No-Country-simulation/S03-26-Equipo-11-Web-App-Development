# OpenSpec: WhatsApp UI - Correcciones de Formato y Orden

## Estado: ✅ COMPLETADO

## Objetivo

Corregir formato de fecha/hora y ordenamiento en el frontend de WhatsApp.

---

## Tareas

### Tarea 1: Mostrar fecha + hora completa (dd/mm/aaaa hh:mm:ss)

- **Archivo:** `app\(crm)\whatsapp\page.tsx`
- **Problema:** Solo muestra hora en lista contactos y detalle mensajes
- **Solución:** Crear función `formatDateTime(ts)` que muestre `dd/mm/yyyy HH:mm:ss`
- **Estado:** ✅ COMPLETADO

### Tarea 2: Verificar ordenamiento de contactos

- **Archivo:** `lib/whatsapp/whatsappService.ts`
- **Problema:** Ninguno - ya está ordenado por fecha descendente
- **Estado:** ✅ YA FUNCIONA

### Tarea 3: Invertir orden de mensajes (primero a último)

- **Archivo:** `lib/whatsapp/whatsappService.ts` (getWhatsAppMessages)
- **Problema:** Mensajes muestran de último a primero
- **Solución:** Cambiar orden de DESC a ASC
- **Estado:** ✅ COMPLETADO

---

## Criterios de Éxito

- [x] Lista contactos muestra fecha+hora completa
- [x] Contactos ordenados por fecha más reciente primero
- [x] Mensajes ordenados de primero a último (más antiguo arriba)

---

## Archivos Modificados

| # | Archivo | Cambio |
|---|---------|--------|
| 1 | `app\(crm)\whatsapp\page.tsx` | formatDateTime() agregado |
| 2 | `lib/whatsapp/whatsappService.ts` | Orden mensajes ASC |
