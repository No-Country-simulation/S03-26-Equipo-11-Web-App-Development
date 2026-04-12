# ADR 004: Uso de ngrok para Integración de WhatsApp (WAHA)

## Estado
Aceptado

## Contexto
El módulo de WhatsApp utiliza WAHA, que requiere un entorno con soporte para Docker y suficiente RAM (mínimo 1GB) para ejecutar Chromium.

### Restricciones encontradas:
1.  **Restricciones Geográficas/Financieras:** Debido a limitaciones con tarjetas de crédito emitidas en Bolivia, el acceso a servicios como **AWS (Free Tier)** y **Oracle Cloud** fue denegado o restringido.
2.  **Limitaciones de Plataforma:** Intentos de despliegue en **Render (Free Plan)** resultaron en fallos de ejecución (el servicio no pasaba del estado inicial) debido al alto consumo de recursos de WAHA.

## Decisión
Se ha decidido implementar un **túnel seguro mediante ngrok** conectado a una instancia local de Docker para el servicio de WhatsApp en la etapa actual del proyecto.

## Consecuencias
*   **Positivas:** Permite una integración 100% funcional con WhatsApp sin costo de infraestructura y evita las restricciones bancarias regionales.
*   **Negativas:** Requiere que una máquina local (o servidor privado) mantenga el túnel de ngrok y el contenedor de Docker activos para que el CRM en producción pueda procesar mensajes.
*   **Escalabilidad:** En una fase posterior, se recomienda migrar WAHA a un VPS (como DigitalOcean o Linode) una vez superadas las barreras de pago.
