## ADDED Requirements

### Requirement: Dashboard API returns KPIs with trend calculation
The endpoint `GET /api/dashboard` SHALL return 4 KPIs with current value, percentage change vs previous day, and trend direction (up/down/neutral).

#### Scenario: Successful KPI query with data
- **WHEN** the database contains contacts and messages from today and yesterday
- **THEN** API returns `activeContacts`, `whatsappSent`, `emailsSent`, `responseRate` with value, change percentage, and trend

#### Scenario: Empty database (no data)
- **WHEN** tables `contacts` and `messages` are empty
- **THEN** API returns all KPIs with value: 0 and trend: "neutral"

#### Scenario: Partial data (only today's records)
- **WHEN** there are records for today but none for yesterday
- **THEN** API calculates delta as 100% increase (or appropriate based on query logic)

### Requirement: Dashboard API returns funnel data by stage
The endpoint SHALL return count of contacts grouped by stage (new, contacted, qualified, proposal, won, lost).

#### Scenario: Query funnel with populated contacts
- **WHEN** there are contacts in various stages
- **THEN** API returns array with objects containing `stage` and `count` for each stage

#### Scenario: Empty contacts table
- **THEN** API returns array with all 6 stages having count: 0

### Requirement: Dashboard API returns channel distribution
The endpoint SHALL return count of messages grouped by canal (whatsapp, email, sms).

#### Scenario: Query channels with messages
- **WHEN** there are messages in the database
- **THEN** API returns array with canal name and total count for each canal

### Requirement: Dashboard API returns weekly activity
The endpoint SHALL return messages grouped by day (last 7 days) and canal for activity chart.

#### Scenario: Query weekly activity with recent messages
- **WHEN** there are messages from the last 7 days
- **THEN** API returns array with `date`, `dayName`, `canal`, and `count` for each day/canal combination

#### Scenario: No messages in last 7 days
- **THEN** API returns empty array

### Requirement: Dashboard API returns conversion rate by month
The endpoint SHALL return percentage of contacts marked as "won" per month (last 12 months).

#### Scenario: Query conversion rate with historical data
- **WHEN** there are contacts with various stage values across months
- **THEN** API returns array with `month`, `total`, `won`, and `rate` (percentage) for each month

#### Scenario: New database with recent contacts only
- **THEN** API returns data only for months with records

### Requirement: Dashboard returns data in expected structure
The API response SHALL match the expected structure for frontend consumption.

#### Scenario: Valid response structure
- **WHEN** API successfully queries database
- **THEN** response contains:
  - `kpis.activeContacts`: { value, change, trend }
  - `kpis.whatsappSent`: { value, change, trend }
  - `kpis.emailsSent`: { value, change, trend }
  - `kpis.responseRate`: { value, change, trend }
  - `charts.funnel`: Array<{ stage, count }>
  - `charts.channels`: Array<{ canal, count }>
  - `charts.weeklyActivity`: Array<{ date, dayName, canal, count }>
  - `charts.conversionRate`: Array<{ month, total, won, rate }>