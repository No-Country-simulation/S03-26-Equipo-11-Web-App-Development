## ADDED Requirements

### Requirement: Contact create form validates name
The system SHALL validate that the name field contains at least 3 characters with only letters and spaces.

#### Scenario: Valid name
- **WHEN** user enters "Juan Perez" in name field
- **THEN** validation passes for name field

#### Scenario: Invalid name - too short
- **WHEN** user enters "ab" in name field and submits
- **THEN** form shows error "Nombre debe tener al menos 3 caracteres"
- **THEN** submit is blocked

#### Scenario: Invalid name - with numbers
- **WHEN** user enters "Juan123" in name field and submits
- **THEN** form shows error "Nombre inválido (solo letras)"
- **THEN** submit is blocked

### Requirement: Contact create form validates email
The system SHALL validate that the email field is in valid format.

#### Scenario: Valid email
- **WHEN** user enters "juan@example.com" in email field
- **THEN** validation passes for email field

#### Scenario: Invalid email
- **WHEN** user enters "not-an-email" in email field and submits
- **THEN** form shows error "Email inválido"
- **THEN** submit is blocked

### Requirement: Contact create form validates phone (optional)
The system SHALL validate that the phone field (if provided) contains only numbers and spaces.

#### Scenario: No phone
- **WHEN** user leaves phone field empty
- **THEN** validation passes (phone is optional)

#### Scenario: Valid phone
- **WHEN** user enters "+54 9 11 1234 5678" in phone field
- **THEN** validation passes for phone field

#### Scenario: Invalid phone
- **WHEN** user enters "abc123" in phone field and submits
- **THEN** form shows error "Teléfono inválido"
- **THEN** submit is blocked

### Requirement: Contact create form validates company (optional)
The system SHALL accept the company field as optional without validation.

#### Scenario: No company
- **WHEN** user leaves company field empty
- **THEN** validation passes (company is optional)

### Requirement: Contact create form submits to API
The system SHALL send POST request to /api/contacts when form is valid.

#### Scenario: Successful create
- **WHEN** user fills valid form and submits
- **THEN** system sends POST /api/contacts with JSON body
- **THEN** on success (201), dialog closes
- **THEN** contact list refreshes

### Requirement: Contact create form handles duplicate email
The system SHALL display error when backend returns 409 (email already exists).

#### Scenario: Duplicate email
- **WHEN** user submits form with existing email
- **THEN** backend returns 409
- **THEN** form shows error "Ya existe un contacto con ese email"
- **THEN** form remains open

### Requirement: Contact create form handles API errors
The system SHALL display error message for other server errors.

#### Scenario: Server error
- **WHEN** API returns 500 error
- **THEN** form shows error "Error del servidor"
- **THEN** user can retry

### Requirement: Contact create form shows loading during submit
The system SHALL disable submit button and show loading state during API request.

#### Scenario: Submitting
- **WHEN** form is being submitted
- **THEN** submit button shows spinner/loading
- **THEN** fields are disabled
- **THEN** cancel button is disabled