## Why

The CRM dashboard at `app/(crm)/dashboard/page.tsx` currently displays hardcoded mock data for all KPIs and charts. The backend endpoint `/api/dashboard` is already implemented and returning real data from the database. The frontend needs to be updated to fetch and display this real data instead of static mock values.

## What Changes

- **Update `app/(crm)/dashboard/page.tsx`**: Replace mock data with fetch to `/api/dashboard`
- **Add loading state**: Show spinner while fetching data
- **Add error handling**: Display fallback zeros on API error
- **Connect KPIs**: Map `kpis.activeContacts`, `kpis.whatsappSent`, `kpis.emailsSent`, `kpis.responseRate` to UI
- **Connect funnel chart**: Map `charts.funnel` data to bar chart
- **Connect channels pie chart**: Map `charts.channels` data to pie chart
- **Connect weekly activity**: Map `charts.weeklyActivity` data to bar chart
- **Connect conversion rate**: Map `charts.conversionRate` data to line chart

## Capabilities

### New Capabilities
- **dashboard-frontend-real-data**: Frontend integration to display live metrics from API

### Modified Capabilities
- None

## Non-goals
- Real-time updates (polling or manual refresh only)
- Date range filtering
- Export to formats other than PDF

## Impact

**Modified Files:**
- `app/(crm)/dashboard/page.tsx` - Fetch real data and display

**Dependencies:**
- Endpoint `/api/dashboard` (already implemented)
- Session cookie for authentication