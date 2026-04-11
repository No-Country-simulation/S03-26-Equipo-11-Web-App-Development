# Tasks: dashboard-real-data

## 1. API Endpoint Creation

- [x] 1.1 Create `app/api/dashboard/route.ts` with basic structure
- [x] 1.2 Add GET method handler
- [x] 1.3 Set up database connection (import db from lib/db)

## 2. KPI Queries Implementation

- [x] 2.1 Implement active contacts query with delta calculation
- [x] 2.2 Implement WhatsApp sent messages query with delta
- [x] 2.3 Implement emails sent query with delta
- [x] 2.4 Implement response rate query with delta
- [x] 2.5 Test all KPI queries return correct structure

## 3. Chart Queries Implementation

- [x] 3.1 Implement funnel query (contacts by stage)
- [x] 3.2 Implement channels query (messages by canal)
- [x] 3.3 Implement weekly activity query (last 7 days by canal)
- [x] 3.4 Implement conversion rate query (won by month, last 12 months)
- [x] 3.5 Test all chart queries return correct structure

## 4. Testing

- [x] 4.1 Test with empty database (should return 0s)
- [x] 4.2 Test with sample data
- [x] 4.3 Verify all 4 KPIs return correct structure
- [x] 4.4 Verify all 4 charts return correct structure

## Dependencies

- 1.1 → 1.2 → 1.3
- 1.3 → 2.1, 2.2, 2.3, 2.4 → 3.1, 3.2, 3.3, 3.4
- 3.1, 3.2, 3.3, 3.4 → 4.1, 4.2, 4.3, 4.4