# Runbook: Mantenimiento

Tareas de mantenimiento rutinario para Startup CRM.

---

## Tareas Diarias

### Verificar Disponibilidad

```bash
# Health check
curl https://tu-proyecto.vercel.app/api/health

# Verificar respuesta
# {"status":"ok","timestamp":"..."}
```

### Revisar Logs de Vercel

```bash
# Ver errores recientes
vercel logs tu-proyecto --since=24h --level=error

# Ver todas las actividad
vercel logs tu-proyecto --since=24h
```

---

## Tareas Semanales

### 1. Actualizar Dependencias

```bash
# Ver actualizaciones disponibles
npm outdated

# Output ejemplo:
# Package           Current  Wanted  Latest  Location
# next              14.0.0   14.0.0  14.1.0  nextjs_crm
# react             18.2.0   18.2.0  18.3.0  nextjs_crm

# Actualizar dependencias menores (seguro)
npm update

# Actualizar a ultimas versiones (cuidado)
npm install next@latest react@latest
```

### 2. Revisar Vercel Analytics

1. Ir a **Project** > **Analytics**
2. Ver metricas de la semana:
   - Page Views
   - Unique Visitors
   - Core Web Vitals
3. Investigar anomalias

### 3. Limpiar Builds Antiguos

Vercel maneja esto automaticamente, pero verificar:
- No haya deployments huérfanos
- Usage dentro de limites

---

## Tareas Mensuales

### 1. Backup de Datos

> **Nota:** Cuando se implemente base de datos real

```bash
# Si usando SQLite local
cp data/crm.db "backups/crm-$(date +%Y-%m-%d).db"

# Si usando Turso
turso db shell tu-db -- "SELECT * FROM contacts LIMIT 1"
```

### 2. Revisar Seguridad

```bash
# Ver dependencias con vulnerabilidades
npm audit

# Output:
# found 0 vulnerabilities
# or
# found 3 vulnerabilities (1 moderate, 2 high)

# Si hay vulnerabilidades
npm audit fix
```

### 3. Rotacion de Credenciales

Verificar que:
- [ ] Credenciales SMTP no estan en codigo
- [ ] Solo en variables de entorno
- [ ] Rotar si hay sospecha de compromise

```bash
# En Gmail: Seguridad > Contrasenas de aplicaciones > Regenerar
# Actualizar en Vercel
vercel env add SMTP_PASS production
```

### 4. Revisar Documentacion

- [ ] docs/ actualizada?
- [ ] README.md refleja cambios?
- [ ] ADRs necesitan actualizacion?

---

## Tareas Trimestrales

### 1. Review de ADRs

Revisar decisiones architectuales en [docs/desitions/](../../desitions/)

- [ ] ADR-001 (SQLite) sigue valido?
- [ ] ADR-002 (Agente Unico) sigue valido?
- [ ] Nuevas decisiones documentadas?

### 2. Review de Performance

```bash
# Lighthouse score
# Ir a https://pagespeed.web.dev/
# Analizar tu-dominio.com

# Verificar metricas:
# - LCP < 2.5s
# - FID < 100ms
# - CLS < 0.1
```

### 3. Capacity Planning

Evaluar:
- Uso de bandwidth
- Build minutes
- Serverless function invocations

### 4. Actualizar Roadmap

Segun [docs/architecture/0_overview.md](../../architecture/0_overview.md):
- [ ] Pendientes completadas?
- [ ] Nuevos features priorizados?
- [ ] Bugs conocidos documentados?

---

## Tareas de Emergencia

### Backup Inmediato Antes de Cambios Mayoress

```bash
# 1. Backup de codigo
git tag -a pre-refactor-$(date +%Y%m%d) -m "Backup antes de refactor"

# 2. Backup de BD
cp data/crm.db "backups/crm-pre-refactor.db"

# 3. Exportar variables de entorno
vercel env pull .env.vercel
```

### Restore desde Backup

```bash
# Restore BD
cp backups/crm-2026-04-01.db data/crm.db

# Restore codigo
git checkout pre-refactor-20260401
```

---

## Cronograma de Mantenimiento

| Frecuencia | Tarea | Responsable |
|------------|-------|-------------|
| Diaria | Health check | DevOps |
| Diaria | Revisar logs | DevOps |
| Semanal | Update deps | Lead Developer |
| Semanal | Vercel Analytics | Product Owner |
| Mensual | Security audit | DevOps |
| Mensual | Backup | DevOps |
| Trimestral | ADR review | Tech Lead |
| Trimestral | Performance review | Full Team |

---

## Checklist Pre-Deploy

Antes de cada release:

```
[ ] npm run lint pasa sin errores
[ ] npm run build completa exitosamente
[ ] Tests pasan (cuando existan)
[ ] Variables de entorno actualizadas en Vercel
[ ] Documentacion actualizada
[ ] Changelog actualizado
[ ] Stakeholders notificados
```

---

## Monitoreo Continuo

### Alerts Configurar (Vercel Pro)

```bash
# En Vercel Dashboard:
# Project > Settings > Git > Deploy Checks
# Habilitar:
# - Lint Check
# - Type Check
# - Build
```

### Uptime Monitoring

Usar servicio como [Better Uptime](https://betteruptime.com) o [UptimeRobot](https://uptimerobot.com):

```bash
# Configurar para:
# - https://tu-proyecto.vercel.app
# - https://tu-proyecto.vercel.app/api/health
# - Frecuencia: cada 1-5 minutos
```

---

**Anterior**: [Troubleshooting](troubleshooting.md)  
**Siguiente**: N/A

**Volver a**: [Runbooks Index](README.md)
