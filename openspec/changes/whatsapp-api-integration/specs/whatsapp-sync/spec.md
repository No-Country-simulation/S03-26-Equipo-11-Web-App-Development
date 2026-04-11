## ADDED Requirements

### Requirement: Sync WhatsApp messages from WPPConnect
The system SHALL fetch new messages from WPPConnect and store them in the database.

#### Scenario: Manual sync trigger
- **WHEN** user POSTs to /api/whatsapp/sync
- **THEN** call WPPConnect API to fetch recent messages
- **THEN** for each new message:
  - Find or create contact by phone number
  - Insert into messages table with canal = 'whatsapp', direccion = 'entrante'
  - Update contact's lastContact field
- **THEN** return summary: new messages count, contacts updated

#### Scenario: Cron-based sync
- **WHEN** external cron triggers POST /api/whatsapp/sync
- **THEN** same as manual sync process

#### Scenario: No new messages
- **WHEN** WPPConnect returns no new messages
- **THEN** return { newMessages: 0, contactsUpdated: 0 }

#### Scenario: WPPConnect unavailable
- **WHEN** WPPConnect API is unreachable
- **THEN** return 503 error with "WPPConnect unavailable" message
- **THEN** do not update last sync timestamp