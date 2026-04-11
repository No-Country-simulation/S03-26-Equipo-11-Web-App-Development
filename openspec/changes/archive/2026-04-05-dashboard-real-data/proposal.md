## Why

The CRM dashboard currently displays hardcoded mock data for KPIs (contactos activos, mensajes enviados, emails, tasa de respuesta) and charts (funnel, canales, actividad semanal, conversión). The database already has the necessary tables (contacts, messages) with real data - the dashboard API endpoint needs to be created to expose this data.

## What Changes

- **Create `app/api/dashboard/route.ts`**: New API endpoint that queries the database for all dashboard metrics
- **Implement 4 KPI queries**: Contactos activos, Mensajes WhatsApp enviados, Emails enviados, Tasa de respuesta
- **Implement 4 chart queries**: Embudo de ventas (contacts by stage), Canales de comunicación (messages by canal), Actividad semanal (messages last 7 days), Tasa de conversión (contacts won by month)

## Capabilities

### New Capabilities
- **dashboard-metrics-api**: API endpoint that returns KPIs and chart data from database queries

### Modified Capabilities
- None

## Non-goals
- Real-time updates via WebSocket (polling is acceptable)
- Historical data beyond 12 months
- Date range filtering (future enhancement)
- Frontend dashboard integration (separate change)

## Impact

**New Files:**
- `app/api/dashboard/route.ts` - API endpoint for metrics

**Dependencies:**
- SQLite database with `contacts` and `messages` tables
- Drizzle ORM for queries

**Affected Tables:**
- `contacts` - Used for active contacts count, funnel stages, conversion rate
- `messages` - Used for WhatsApp/email sent counts, channel distribution, weekly activity