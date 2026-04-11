# Proposal: better-auth-implementation

## Why

El sistema CRM actualmente no tiene autenticación. Cualquier persona puede acceder a los endpoints de API (email, contactos, recordatorios, etc.) sin restrictions. Se necesita implementar un sistema de autenticación robusto que:

1. Permita a usuarios hacer login/register
2. Proteja todos los endpoints de API (excepto `/api/auth/*` y `/api/health`)
3. Soporte roles (admin, agent, user) para control de acceso
4. Mantenga sesiones persistentes con cookies seguras

## What Changes

- Instalar y configurar Better Auth con plugin emailPassword
- Crear middleware global de protección
- Proteger todos los endpoints existentes bajo `/api/*`
- Crear tabla de sesiones en DB (managed by Better Auth)
- Sincronizar usuarios existentes con el sistema de auth

## Capabilities

### New Capabilities
- `user-login`: Autenticación de usuarios con email/password
- `user-register`: Registro de nuevos usuarios
- `session-management`: Manejo de sesiones con cookies HTTP-only
- `role-based-access`: Control de acceso por roles (admin, agent, user)
- `auth-middleware`: Protección global de endpoints

### Modified Capabilities
- `api-email-send`: Ahora requiere autenticación
- `api-email-receive`: Ahora requiere autenticación
- `api-email-sync`: Ahora requiere autenticación
- `api-contacts-*`: Todos los endpoints de contactos protegidos
- `api-reminders-*`: Todos los endpoints de recordatorios protegidos

## Impact

- **Dependencias**: `better-auth`, `better-auth-adapters`, `bcrypt`
- **DB**: Nueva tabla `sessions` (creada automáticamente por Better Auth)
- **API**: Nuevas rutas `/api/auth/*` para login, register, logout, session
- **Middleware**: `middleware.ts` para protección de rutas
- **Cookies**: Sesiones almacenadas en cookies HTTP-only seguras

## Non-Goals

- No se implementará autenticación OAuth/social (solo email/password)
- No se implementará verificación de email obligatoria
- No se creará frontend de login/register (solo API endpoints)
- No se modificará la tabla `users` existente (se usará como fuente de datos)
