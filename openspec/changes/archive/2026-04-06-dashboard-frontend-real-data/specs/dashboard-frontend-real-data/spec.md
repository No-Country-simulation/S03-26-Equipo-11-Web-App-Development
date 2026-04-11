## ADDED Requirements

### Requirement: Dashboard fetches data from API on mount
The dashboard component SHALL fetch data from `/api/dashboard` when the component mounts.

#### Scenario: Successful data fetch
- **WHEN** the component mounts and the API returns data
- **THEN** the dashboard displays the real KPIs and charts

#### Scenario: API error
- **WHEN** the API returns an error or is unreachable
- **THEN** the dashboard displays all metrics as 0

#### Scenario: Loading state
- **WHEN** the component is fetching data
- **THEN** a loading spinner is displayed

### Requirement: KPIs display real values from API
Each KPI card SHALL display values from the API response.

#### Scenario: Active contacts displays correctly
- **WHEN** API returns `kpis.activeContacts`
- **THEN** the card shows the value and trend icon

#### Scenario: WhatsApp messages displays correctly
- **WHEN** API returns `kpis.whatsappSent`
- **THEN** the card shows the value and trend icon

#### Scenario: Emails sent displays correctly
- **WHEN** API returns `kpis.emailsSent`
- **THEN** the card shows the value and trend icon

#### Scenario: Response rate displays correctly
- **WHEN** API returns `kpis.responseRate`
- **THEN** the card shows the value and trend icon

### Requirement: Funnel chart displays contacts by stage
The funnel bar chart SHALL display data from `charts.funnel`.

#### Scenario: Funnel with data
- **WHEN** API returns funnel data with stages
- **THEN** bar chart shows each stage with its count

#### Scenario: Funnel empty
- **WHEN** API returns empty funnel array
- **THEN** chart shows all 6 stages with count 0

### Requirement: Channels pie chart displays message distribution
The pie chart SHALL display data from `charts.channels`.

#### Scenario: Channels with data
- **WHEN** API returns channels data
- **THEN** pie chart shows distribution by canal

### Requirement: Weekly activity bar chart displays recent messages
The activity chart SHALL display data from `charts.weeklyActivity`.

#### Scenario: Weekly activity with data
- **WHEN** API returns weekly activity data
- **THEN** bar chart shows messages per day

### Requirement: Conversion rate line chart displays historical data
The line chart SHALL display data from `charts.conversionRate`.

#### Scenario: Conversion rate with data
- **WHEN** API returns conversion rate by month
- **THEN** line chart shows rate over time