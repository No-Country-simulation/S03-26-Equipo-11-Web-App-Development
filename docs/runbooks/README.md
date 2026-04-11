# Runbooks - Startup CRM

Guias de operacion para el proyecto Startup CRM.

## Que es un Runbook?

Un runbook es un documento que proporciona instrucciones paso a paso para ejecutar tareas operativas criticas. Esta coleccion cubre desde el despliegue hasta el mantenimiento del sistema.

## Indice de Guias

| Guia | Descripcion |
|------|-------------|
| [README](README.md) | Indice y overview |
| [Deployment en Vercel](deployment-vercel.md) | Despliegue paso a paso en Vercel |
| [Setup Local](setup-local.md) | Configuracion para desarrollo local |
| [Configuracion de Variables](environment-setup.md) | Variables de entorno necesarias |
| [Troubleshooting](troubleshooting.md) | Problemas comunes y soluciones |
| [Mantenimiento](maintenance.md) | Tareas de mantenimiento rutinario |

---

## Overview Rapido

### Flujo de Despliegue

```
1. Git Push -> GitHub
2. Vercel detecta cambios
3. Build automatico (npm run build)
4. Preview URL generada
5. Revisar cambios
6. Merge a main -> Produccion automatica
```

### Comandos Essentials

```bash
# Desarrollo local
npm run dev

# Build produccion
npm run build

# Linting
npm run lint

# Ver logs en Vercel
vercel logs <project-name>
```

---

## Niveles de Severity

| Nivel | Color | Descripcion | SLA |
|-------|-------|-------------|-----|
| **P1 - Critico** | Rojo | Sistema no disponible | 15 min |
| **P2 - Alto** | Naranja | Funcionalidad principal afectada | 1 hora |
| **P3 - Medio** | Amarillo | Funcionalidad secundaria afectada | 4 horas |
| **P4 - Bajo** | Azul | Mejoras, bugs menores | 24 horas |

---

## Contactos de Emergencia

| Rol | Responsabilidad |
|-----|----------------|
| DevOps Lead | Despliegues, infraestrutura |
| Backend Lead | API, base de datos |
| Frontend Lead | UI, rendering |

---

**Volver a**: [Documentacion](../architecture/architecture.md)
