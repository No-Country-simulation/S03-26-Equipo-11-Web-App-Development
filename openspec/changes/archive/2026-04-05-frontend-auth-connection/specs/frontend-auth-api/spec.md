## ADDED Requirements

### Requirement: Login form connects to API endpoint
The login form at `app/login/page.tsx` SHALL submit credentials to `/api/auth/signin` and handle the response appropriately.

#### Scenario: Successful login
- **WHEN** user enters valid email and password and clicks "Iniciar sesión"
- **THEN** the form submits POST to `/api/auth/signin` with `{ email, password }`
- **AND** on success (HTTP 200), redirects to `/dashboard`

#### Scenario: Invalid credentials
- **WHEN** user enters invalid email or password
- **THEN** the API returns error response
- **AND** form displays "Credenciales incorrectas" message
- **AND** user stays on login page to retry

#### Scenario: Network error
- **WHEN** the fetch request fails (network timeout, server down)
- **THEN** form displays generic "Error de conexión" message
- **AND** user stays on login page

### Requirement: Register form connects to API endpoint
The register form at `app/register/page.tsx` SHALL submit registration data to `/api/auth/signup` and handle the response appropriately.

#### Scenario: Successful registration
- **WHEN** user enters valid name (≥3 chars), email, and password (≥1 char) and clicks "Crear cuenta"
- **THEN** the form submits POST to `/api/auth/signup` with `{ email, password, name }`
- **AND** on success, displays "¡Cuenta creada exitosamente!" message
- **AND** after delay, redirects to `/dashboard`

#### Scenario: Email already exists
- **WHEN** user registers with an email that's already in use
- **THEN** the API returns error (likely "User already exists")
- **AND** form displays appropriate error message
- **AND** user stays on register page to change email

#### Scenario: Validation failure (name too short)
- **WHEN** user enters name with less than 3 characters
- **THEN** form prevents submission (button disabled or validation message shown)

### Requirement: Client-side validation before API call
The login and register forms SHALL validate inputs before making API calls to provide immediate feedback.

#### Scenario: Login - Empty fields
- **WHEN** user tries to submit login with empty email or password
- **THEN** form shows validation error (already implemented via showError)

#### Scenario: Login - Invalid email format
- **WHEN** user enters email that doesn't match email regex pattern
- **THEN** form shows validation error

#### Scenario: Register - Password minimum
- **WHEN** user enters password with less than 1 character (empty)
- **THEN** form prevents submission (button disabled or shows error)

### Requirement: Form state management during submission
The login and register forms SHALL disable submission while processing to prevent race conditions.

#### Scenario: Submit button disabled during request
- **WHEN** user clicks submit and request is in progress
- **THEN** button shows "Ingresando..." or "Creando..." text
- **AND** button is disabled to prevent double submission
- **AND** button re-enables after request completes (success or failure)