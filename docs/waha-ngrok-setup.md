# Guía de Conexión WhatsApp (ngrok + WAHA)

Esta guía detalla cómo mantener el módulo de WhatsApp funcional conectando el CRM en la nube (Vercel) con tu instancia local de WAHA.

## 1. Requisitos Previos
*   **Docker:** WAHA debe estar corriendo (generalmente en el puerto 4000).
*   **Cuenta ngrok:** Registro gratuito en [ngrok.com](https://ngrok.com/).
*   **Auth Token:** Configurado en tu PC (`ngrok config add-authtoken <TOKEN>`).

## 2. Configuración del Dominio Estático
Para evitar que la URL de WhatsApp cambie cada vez, usa un dominio estático gratuito de ngrok:
1.  Ve al Dashboard de ngrok > **Cloud Edge** > **Domains**.
2.  Crea un dominio gratuito (ej: `cultural-spokesman-crazed.ngrok-free.dev`).

## 3. Comando de Activación
Cada vez que quieras que el CRM en la nube pueda enviar/recibir WhatsApps, ejecuta en tu terminal:

```bash
# Paso A: Cerrar sesiones previas colgadas (opcional)
taskkill /f /im ngrok.exe

# Paso B: Iniciar el túnel
ngrok http --url=cultural-spokesman-crazed.ngrok-free.dev 4000
```

## 4. Configuración en Vercel
Asegúrate de que estas variables de entorno en el Dashboard de Vercel coincidan con tu túnel:

| Variable | Valor sugerido |
| :--- | :--- |
| `WHATSAPP_API_URL` | `https://cultural-spokesman-crazed.ngrok-free.dev` |
| `WHATSAPP_API_KEY` | (La que configuraste en tu Docker local) |
| `WHATSAPP_SESSION` | `default` |

## 5. Mantenimiento y Cuidados
*   **Terminal Abierta:** No cierres la terminal donde corre ngrok.
*   **Docker encendido:** El contenedor de WAHA debe estar en estado *Running*.
*   **Escaneo QR:** Si la sesión se cierra, entra al dashboard de WAHA local (`http://localhost:4000`) y vuelve a escanear el código QR con tu celular.
