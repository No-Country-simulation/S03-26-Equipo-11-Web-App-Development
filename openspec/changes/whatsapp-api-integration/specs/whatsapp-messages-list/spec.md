## ADDED Requirements

### Requirement: View messages for a specific contact
The system SHALL return a list of messages for a given WhatsApp contact.

#### Scenario: Get messages for contact
- **WHEN** user calls GET /api/whatsapp/{contactId}
- **THEN** return messages from messages table where canal = 'whatsapp' and contactId = {contactId}
- **THEN** include message content, direction, timestamp, and read status
- **THEN** sort by fecha descending (newest first)

#### Scenario: Pagination
- **WHEN** user provides limit and offset parameters
- **THEN** return paginated results with total count
- **THEN** default limit is 20, max is 100

#### Scenario: Mark messages as read
- **WHEN** user views messages for a contact
- **THEN** mark all unread incoming messages as read