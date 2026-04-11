# Infrastructure & Deployment - Startup CRM

## Despliegue Principal: Vercel

El proyecto está diseñado para ejecutarse en la infraestructura global de **Vercel**, utilizando el **Edge Runtime** para el middleware y funciones Serverless para la API.

### Flujo de Despliegue
```bash
# 1. Limpieza de caché y build
npm run build

# 2. Despliegue a producción
vercel --prod --yes
```

### Configuraciones Críticas
El archivo `vercel.json` ha sido simplificado para delegar el ruteo a Next.js 16 y asegurar la compatibilidad con el App Router.

## Base de Datos: Turso (Remote SQL)

La persistencia en producción se gestiona mediante **Turso**, permitiendo latencia ultra-baja mediante réplicas distribuidas.

- **Driver:** `@libsql/client`
- **ORM:** Drizzle (con soporte nativo para libSQL)

---

## Estrategia de Autenticación en la Nube

1.  **Middleware:** Se ejecuta en el Edge para interceptar peticiones `/api/` y validar la sesión.
2.  **Web Crypto:** Se utiliza la API nativa `crypto.randomUUID()` para generar identificadores compatibles con el entorno restringido de Vercel.
3.  **Seguridad:** Las cookies de sesión están configuradas como `Secure` y `HttpOnly` en producción.

## Integraciones Locales (Docker)

Debido a la naturaleza de la API de WhatsApp Web, la instancia de **WAHA** se mantiene como un servicio externo (local o en un VPS dedicado con Docker) al que el CRM se conecta vía HTTP seguro.
