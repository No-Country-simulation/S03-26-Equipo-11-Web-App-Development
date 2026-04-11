## ADDED Requirements

### Requirement: Sidebar account trigger SHALL expose a session panel
El sistema SHALL convertir el bloque de identidad del usuario autenticado en un disparador interactivo dentro del layout CRM que abra un panel de cuenta.

#### Scenario: Open account panel from sidebar
- **WHEN** el usuario autenticado pulsa el avatar, las iniciales o el bloque de cuenta en el sidebar
- **THEN** el sistema abre un panel de cuenta asociado a ese disparador

#### Scenario: Close account panel
- **WHEN** el panel de cuenta está abierto y el usuario hace clic fuera de él, presiona `Escape` o activa nuevamente el disparador
- **THEN** el sistema cierra el panel sin perder el contexto de navegación actual

### Requirement: Account panel SHALL display session identity data
El sistema SHALL mostrar la información principal de la sesión autenticada dentro del panel de cuenta usando el estado de sesión ya cargado por el layout CRM.

#### Scenario: Session data available
- **WHEN** existe una sesión válida con `name`, `email` y `role`
- **THEN** el panel muestra nombre, email y rol del usuario

#### Scenario: Session data incomplete
- **WHEN** el nombre del usuario no está disponible pero existe email
- **THEN** el panel usa el email como fallback visible de identidad

### Requirement: Account panel SHALL provide a logout action
El sistema SHALL incluir una acción explícita de cierre de sesión dentro del panel de cuenta.

#### Scenario: Successful logout from account panel
- **WHEN** el usuario activa el botón de logout dentro del panel
- **THEN** el sistema ejecuta el flujo de cierre de sesión y redirige al usuario a `/login`

#### Scenario: Logout in progress
- **WHEN** el usuario activa logout y la operación aún no termina
- **THEN** el sistema evita múltiples envíos concurrentes de la misma acción

### Requirement: Account panel interactions SHALL be keyboard accessible
El sistema SHALL permitir usar el disparador y el panel de cuenta mediante teclado y mantener comportamiento accesible de foco.

#### Scenario: Keyboard open
- **WHEN** el disparador de cuenta recibe foco y el usuario activa `Enter` o `Space`
- **THEN** el sistema abre el panel de cuenta

#### Scenario: Focus after opening
- **WHEN** el panel de cuenta se abre
- **THEN** el foco queda disponible dentro del panel o en su primera acción interactiva
