## Why

El frontend CRM ya muestra el nombre, rol e iniciales del usuario en el sidebar y ya existe la acción de cierre de sesión. Falta formalizar un flujo de cuenta más claro: al pulsar el avatar o botón inicial debe abrirse un panel de cuenta con datos básicos y acceso visible a logout, alineando la experiencia con el flujo de autenticación ya implementado.

## What Changes

- Reemplazar el bloque estático actual de usuario en el sidebar por un disparador interactivo de cuenta.
- Mostrar un panel de cuenta al pulsar el avatar/iniciales o el bloque de usuario.
- Incluir en ese panel nombre, email y rol del usuario autenticado.
- Mantener una acción explícita de logout dentro del panel.
- Definir el comportamiento esperado al cerrar sesión: limpieza visual local, ejecución del endpoint de logout y redirección a `/login`.
- Documentar estados vacíos, carga y fallback para datos de sesión incompletos.

## Capabilities

### New Capabilities
- `account-panel-session-actions`: panel de cuenta en frontend CRM para visualizar identidad del usuario y ejecutar cierre de sesión.

### Modified Capabilities
- None.

## Impact

- Afecta el layout autenticado del CRM en `app/(crm)/layout.tsx`.
- Afecta el flujo visual de sesión consumiendo `GET /api/auth/get-session` y `POST /api/auth/signout`.
- Puede requerir componentes UI pequeños para dropdown/panel, estados de carga y accesibilidad de teclado.

## Non-goals

- No cambia el modelo de autenticación ni Better Auth.
- No introduce edición de perfil, cambio de contraseña ni gestión de avatar.
- No modifica permisos, roles ni reglas de autorización.
