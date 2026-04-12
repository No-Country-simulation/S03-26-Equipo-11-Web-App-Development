# Ayuda Memoria: Vercel CLI & Depuración

Esta guía contiene los comandos de la **Vercel CLI** que utilizamos para resolver los problemas de despliegue, 404s y errores de sesión del CRM.

## 1. Comandos de Despliegue

| Comando | Qué hace | Cuándo lo usamos |
| :--- | :--- | :--- |
| `vercel --prod --yes` | Despliega directamente a producción saltando confirmaciones. | Para subir cambios rápidos una vez corregido el código. |
| `vercel --prod --force --yes` | **Forza un build limpio** ignorando la caché de Vercel. | Crucial cuando cambiamos nombres de archivos (como `mockData` a `data-source`) y Vercel seguía buscando los viejos. |
| `vercel --yes` | Despliega a una URL de vista previa (preview). | Para pruebas rápidas sin afectar la URL principal. |

## 2. Comandos de Diagnóstico (Logs)

| Comando | Qué hace | Cuándo lo usamos |
| :--- | :--- | :--- |
| `vercel inspect <URL> --logs` | Muestra el log detallado del **proceso de compilación** (Build). | Para descubrir que `@libsql/client` faltaba o que `crypto` fallaba en el Edge Runtime. |
| `vercel logs <URL>` | Muestra los logs en tiempo real del **servidor corriendo**. | Para detectar por qué las sesiones daban `null` o por qué el middleware rechazaba peticiones. |

## 3. Gestión de Variables de Entorno

| Comando | Qué hace | Cuándo lo usamos |
| :--- | :--- | :--- |
| `vercel env pull .env.local` | Descarga las variables de Vercel a tu archivo local. | Para sincronizar lo que configuramos en la web con tu PC. |
| `vercel env add <VAR> production` | Añade una variable de entorno desde la terminal. | Intentamos usarlo para corregir `BETTER_AUTH_URL` rápidamente. |

## 4. Trucos de Depuración Avanzada

### Forzar variables durante el despliegue
A veces npm falla en Vercel por conflictos de versiones. Usamos esto en la terminal de Windows (PowerShell) para forzar la instalación:
```powershell
$env:NPM_CONFIG_LEGACY_PEER_DEPS="true"; vercel --prod --yes
```

### Limpiar procesos de ngrok colgados
Si ngrok dice que ya tienes una sesión activa:
```powershell
taskkill /f /im ngrok.exe
```

---
**Nota:** Recuerda que para que cualquier cambio en las variables de entorno del panel de Vercel surta efecto, **siempre** debes ejecutar un nuevo `vercel --prod --yes`.
