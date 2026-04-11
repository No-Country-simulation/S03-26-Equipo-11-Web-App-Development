## ADDED Requirements

### Requirement: Contact list loads from API
The system SHALL fetch contact list from GET /api/contacts when the contacts page loads, replacing the current mock data.

#### Scenario: Page load
- **WHEN** user navigates to /contacts
- **THEN** system fetches contacts from /api/contacts with credentials: "include"
- **THEN** page displays loaded contacts in table

### Requirement: Contact list supports pagination
The system SHALL display contacts in pages and allow navigation between pages.

#### Scenario: First page
- **WHEN** page loads with default pagination
- **THEN** first page of contacts (default limit 20) is displayed
- **THEN** total contact count is shown

#### Scenario: Next page
- **WHEN** user clicks "Next" or page number
- **THEN** system fetches next page from /api/contacts?page=N
- **THEN** table updates with new contacts

### Requirement: Pagination controls exist
The system SHALL display pagination controls: Primero, Anterior, Siguiente, Último.

#### Scenario: Click Primero
- **WHEN** user clicks "Primero" button
- **THEN** fetch /api/contacts?page=1
- **THEN** display first page of contacts
- **THEN** disable Primero and Anterior buttons

#### Scenario: Click Anterior
- **WHEN** user clicks "Anterior" button and page > 1
- **THEN** fetch /api/contacts?page=CURRENT-1
- **THEN** display previous page

#### Scenario: Click Siguiente
- **WHEN** user clicks "Siguiente" button and not on last page
- **THEN** fetch /api/contacts?page=CURRENT+1
- **THEN** display next page

#### Scenario: Click Último
- **WHEN** user clicks "Último" button
- **THEN** fetch /api/contacts?page=TOTAL_PAGES
- **THEN** display last page
- **THEN** disable Siguiente and Último buttons

#### Scenario: Disable controls on first page
- **WHEN** current page is 1
- **THEN** disable "Primero" and "Anterior" buttons

#### Scenario: Disable controls on last page
- **WHEN** current page is TOTAL_PAGES
- **THEN** disable "Siguiente" and "Último" buttons

### Requirement: Limit selector
The system SHALL allow changing page size from dropdown (10, 20, 30, 50, 100).

#### Scenario: Change limit
- **WHEN** user selects a different limit from dropdown
- **THEN** fetch /api/contacts?page=1&limit=NEW_LIMIT
- **THEN** reset to page 1
- **THEN** display contacts with new limit

### Requirement: Pagination info displayed
The system SHALL display current page and total pages info.

#### Scenario: Display page info
- **WHEN** contacts are loaded
- **THEN** show "Página X de Y" text
- **THEN** show total contacts count

### Requirement: Contact list filters by stage
The system SHALL filter contacts by funnel stage when user selects a stage filter.

#### Scenario: Filter by stage
- **WHEN** user clicks a stage button (e.g., "Qualified")
- **THEN** system fetches /api/contacts?stage=qualified
- **THEN** table shows only contacts in that stage

### Requirement: Contact list supports search
The system SHALL filter contacts by name or email search term.

#### Scenario: Search by name
- **WHEN** user types in search box and submits
- **THEN** system fetches /api/contacts?search=TERM
- **THEN** table shows only matching contacts

### Requirement: Contact list shows loading state
The system SHALL display a loading indicator while fetching contacts.

#### Scenario: Loading
- **WHEN** contacts are being fetched
- **THEN** table shows skeleton or spinner
- **THEN** buttons are disabled

### Requirement: Contact list handles API errors
The system SHALL display an error message if API fetch fails.

#### Scenario: API error
- **WHEN** API returns error (non-OK status)
- **THEN** page displays error message
- **THEN** user can retry

### Requirement: Contact list shows stats
The system SHALL fetch and display funnel statistics from /api/contacts/stats.

#### Scenario: Stats display
- **WHEN** page renders
- **THEN** stats show total contacts and counts by stage
- **THEN** stats update after create/delete operations