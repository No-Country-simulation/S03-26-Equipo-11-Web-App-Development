## ADDED Requirements

### Requirement: WhatsApp contacts list displays with last message preview
The system SHALL return a list of contacts who have exchanged WhatsApp messages, including a preview of the last message (max 10 characters).

#### Scenario: Get contacts with WhatsApp conversations
- **WHEN** user calls GET /api/whatsapp
- **THEN** return contacts that have messages with canal = 'whatsapp'
- **THEN** include last message preview (truncated to 10 chars)
- **THEN** include unread message count
- **THEN** include last message timestamp

#### Scenario: Pagination
- **WHEN** user provides limit and offset parameters
- **THEN** return paginated results
- **THEN** include total count in pagination object

### Requirement: Contact list filters by unread
The system SHALL allow filtering contacts by unread message count.

#### Scenario: Filter by unread
- **WHEN** user calls GET /api/whatsapp?unread=true
- **THEN** return only contacts with unread messages

### Requirement: Contact list supports search
The system SHALL filter contacts by name or phone number.

#### Scenario: Search contacts
- **WHEN** user calls GET /api/whatsapp?search=Juan
- **THEN** return contacts matching name or phone