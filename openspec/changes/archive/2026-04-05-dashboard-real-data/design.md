## Context

The CRM dashboard needs real-time data from the database. The database already contains the necessary tables (`contacts`, `messages`) with data, but no API endpoint exists to query these metrics. The goal is to create a unified API endpoint that returns all metrics in a single response.

## Goals / Non-Goals

**Goals:**
- Create single API endpoint `/api/dashboard` returning all metrics
- Implement SQL queries from `tmp/dash_prop_q.txt` adapted for Drizzle/raw SQL
- Return proper response structure for frontend consumption

**Non-Goals:**
- WebSocket real-time updates
- Date range filtering
- Frontend integration (separate change)

## Decisions

### 1. Single vs Multiple Endpoints
**Decision:** Single `/api/dashboard` endpoint returning all data in one response.

**Rationale:**
- Simpler for frontend (one fetch call)
- Reduces HTTP overhead vs multiple endpoints

### 2. Raw SQL vs Drizzle Query Builder
**Decision:** Use raw SQL queries for complex metrics (CTEs, aggregations).

**Rationale:**
- Complex queries with CTEs are cleaner in raw SQL
- Easier to maintain 1:1 mapping with provided SQL in `dash_prop_q.txt`
- Use Drizzle query builder for simple queries (funnel, channels)

### 3. Response Structure
**Decision:** Return nested object with `kpis` and `charts` keys.

**Rationale:**
- Matches frontend component structure
- Easy to destructure: `const { kpis, charts } = data`
- Extensible for future metrics

### 4. Error Handling
**Decision:** Return empty defaults on error (return 0 for metrics).

**Rationale:**
- API stays functional even if DB has issues
- Console log errors for debugging

### 5. Date Handling (SQLite)
**Decision:** Use SQLite date functions: `DATE('now')`, `DATE('now', '-1 day')`, `strftime('%w', fecha)`.

**Rationale:**
- SQLite doesn't support standard `DATE_SUB()`
- Need to use SQLite-specific functions

## Risks / Trade-offs

| Risk | Mitigation |
|------|-------------|
| Empty database | Return 0s for all metrics |
| Slow queries with large tables | Add indexes on `contacts.stage`, `messages.fecha`, `messages.canal` |
| Different date format in DB | Verify date columns are ISO strings |

## Migration Plan

1. Create `app/api/dashboard/route.ts` with basic structure
2. Implement KPI queries one by one
3. Implement chart queries
4. Test endpoint with empty DB
5. Test endpoint with sample data

## Open Questions

1. **Timezone**: Are dates stored in UTC or local timezone?
2. **Empty state**: Return 0s or null for empty metrics?