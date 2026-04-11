# Runbook: Despliegue en Vercel - Startup CRM

Este documento detalla los pasos para desplegar el CRM en un entorno de producción.

## 1. Configuración de Variables de Entorno

Antes de desplegar, asegúrate de configurar las siguientes variables en el Dashboard de Vercel (**Settings > Environment Variables**):

| Categoría | Variable | Descripción | Ejemplo |
| :--- | :--- | :--- | :--- |
| **Auth** | `BETTER_AUTH_SECRET` | Clave aleatoria para firmar sesiones | `jkahd8923...` |
| **Auth** | `BETTER_AUTH_URL` | **URL de producción (Sin barra al final)** | `https://tu-app.vercel.app` |
| **Auth** | `TRUSTED_ORIGINS` | URL permitida para llamadas API | `https://tu-app.vercel.app` |
| **Database** | `TURSO_DATABASE_URL` | URL de conexión de Turso | `libsql://db-name.turso.io` |
| **Database** | `TURSO_AUTH_TOKEN` | Token de acceso de Turso | `eyJhbGci...` |
| **Email** | `SMTP_HOST` | Host de envío (Gmail/Outlook) | `smtp.gmail.com` |
| **Email** | `SMTP_PASS` | App Password del correo | `xxxx xxxx xxxx xxxx` |

## 2. Comandos de Despliegue

Para realizar un despliegue limpio y funcional:

```bash
# Paso 1: Asegurar que el build local funciona
npm run build

# Paso 2: Desplegar a producción forzando limpieza de caché
vercel --prod --force --yes
```

## 3. Verificación Post-Despliegue

Una vez que Vercel indique que el sitio está `Ready`:

1.  **Limpiar Cookies:** En el navegador, borra las cookies del dominio para evitar conflictos con sesiones de desarrollo.
2.  **Registro:** Intenta registrar un nuevo usuario (esto verificará la conexión con Turso).
3.  **Dashboard:** Verifica que las gráficas carguen (esto verificará que el middleware esté inyectando correctamente los headers `x-user-id`).

## 4. Solución de Problemas Comunes

*   **Error 404 en /api/auth/...**: Verifica que `BETTER_AUTH_URL` no tenga una barra `/` al final y coincida con el dominio actual.
*   **Error 500 en Registro**: Revisa los logs de Vercel. Suele ser falta de `TURSO_AUTH_TOKEN` o incompatibilidad con `crypto` (resuelto en la versión actual del código).
*   **No redirige al Dashboard**: Asegúrate de que `BETTER_AUTH_URL` sea HTTPS en el panel de Vercel.
