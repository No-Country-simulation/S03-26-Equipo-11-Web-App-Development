# Tasks: dashboard-frontend-real-data

## 1. State Setup

- [x] 1.1 Add dashboard data state (kpis, charts)
- [x] 1.2 Add loading state
- [x] 1.3 Add error state

## 2. Data Fetching

- [x] 2.1 Add useEffect to fetch from `/api/dashboard`
- [x] 2.2 Handle successful response
- [x] 2.3 Handle error response (set zeros)

## 3. KPI Integration

- [x] 3.1 Map activeContacts to KPI card
- [x] 3.2 Map whatsappSent to KPI card
- [x] 3.3 Map emailsSent to KPI card
- [x] 3.4 Map responseRate to KPI card
- [x] 3.5 Handle trend direction (up/down/neutral)

## 4. Chart Integration

- [x] 4.1 Connect funnel chart to charts.funnel data
- [x] 4.2 Connect channels pie chart to charts.channels data
- [x] 4.3 Connect weekly activity chart to charts.weeklyActivity data
- [x] 4.4 Connect conversion rate chart to charts.conversionRate data

## 5. Loading and Error States

- [x] 5.1 Add loading spinner
- [x] 5.2 Add fallback to zeros on error
- [x] 5.3 Preserve export PDF button

## 6. Testing

- [x] 6.1 Test with logged-in user
- [x] 6.2 Verify all 4 KPIs display correctly
- [x] 6.3 Verify all 4 charts render correctly
- [x] 6.4 Test loading state
- [x] 6.5 Test error fallback

## Dependencies

- 1.1, 1.2, 1.3 → 2.1 → 2.2, 2.3
- 2.2 → 3.1, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4
- 3.5, 4.4 → 5.1, 5.2
- 5.1, 5.2, 5.3 → 6.1, 6.2, 6.3, 6.4, 6.5