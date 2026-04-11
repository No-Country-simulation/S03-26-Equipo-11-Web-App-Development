## ADDED Requirements

### Requirement: Send WhatsApp message to contact
The system SHALL send a text message to a contact via WhatsApp.

#### Scenario: Send text message
- **WHEN** user POSTs to /api/whatsapp/send with { contactId, text }
- **THEN** look up contact's phone number from contacts table
- **THEN** call WPPConnect API to send message
- **THEN** on success, store message in messages table with canal = 'whatsapp', direccion = 'saliente'
- **THEN** return success with messageId

#### Scenario: Contact not found
- **WHEN** user tries to send to non-existent contact
- **THEN** return 404 error with message "Contact not found"

#### Scenario: WPPConnect API failure
- **WHEN** WPPConnect API returns error
- **THEN** return 500 error with details
- **THEN** do not store failed message in DB

#### Scenario: Missing required fields
- **WHEN** user omits contactId or text
- **THEN** return 400 error with validation message

### Requirement: Auto-create contact if not exists
The system SHALL create a new contact if sending to unknown phone number.

#### Scenario: New phone number
- **WHEN** user sends message to unknown phone number
- **THEN** create new contact with phone number
- **THEN** name as "WhatsApp: {phone}"
- **THEN** proceed to send message