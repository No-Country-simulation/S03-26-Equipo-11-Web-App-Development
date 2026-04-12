# Troubleshooting: Errores Comunes y Soluciones

Este documento recopila las lecciones aprendidas durante la depuración del despliegue en Vercel y la integración de servicios.

## 1. Error 404: NOT_FOUND en Vercel
*   **Problema:** El sitio desplegaba pero cualquier ruta devolvía 404.
*   **Causa:** Configuración de `trailingSlash: true` en `vercel.json` o `output: "standalone"` en `next.config.ts` chocando con el App Router de Next.js 16.
*   **Solución:** Eliminar ambas opciones y dejar que Vercel use su configuración nativa optimizada.

## 2. Error 500 en Registro (Vercel Edge)
*   **Problema:** Al intentar registrar un usuario en producción, el servidor fallaba.
*   **Causa:** Uso de `randomUUID()` del módulo `crypto` de Node.js, el cual no está disponible en el **Edge Runtime** de Vercel.
*   **Solución:** Usar el estándar web `crypto.randomUUID()` (Web Crypto API) o un helper de detección dinámica que prefiera la API global.

## 3. Error 401 Unauthorized en Rutas API
*   **Problema:** El usuario logueado no podía ver contactos o mensajes.
*   **Causa:** El middleware buscaba la cookie `better-auth.session_token`, pero en producción (HTTPS) Vercel le añade el prefijo `__Secure-`.
*   **Solución:** Refactorizar el middleware para pasar todos los `headers()` a Better Auth, permitiendo que la librería gestione el nombre de la cookie automáticamente.

## 4. Module Not Found: Can't resolve '@/lib/data/mockData'
*   **Problema:** El build fallaba solo en Vercel diciendo que no encontraba archivos.
*   **Causa:** Windows ignora mayúsculas/minúsculas (`mockData` vs `mockdata`), pero Linux (Vercel) no. Además, la caché de Turbopack a veces mantiene nombres antiguos.
*   **Solución:** Renombrar archivos a minúsculas (`data-source.ts`) y usar `vercel --prod --force` para limpiar la caché.

## 5. Bloqueo de Versión Vulnerable de Next.js
*   **Problema:** Vercel cancelaba el despliegue con el mensaje `Vulnerable version of Next.js detected`.
*   **Solución:** Mantener siempre `next` y `eslint-config-next` en la última versión estable (actualmente 16.2.3 o superior).
