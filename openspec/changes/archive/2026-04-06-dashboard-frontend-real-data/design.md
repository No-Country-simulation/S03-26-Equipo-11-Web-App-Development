## Context

The dashboard page (`app/(crm)/dashboard/page.tsx`) currently uses hardcoded mock data arrays. The backend API endpoint `/api/dashboard` is already implemented and returns structured JSON data. The frontend needs to connect to this endpoint and replace the static data with dynamic data fetching.

## Goals / Non-Goals

**Goals:**
- Fetch data from `/api/dashboard` on component mount
- Display loading spinner while fetching
- Handle errors gracefully (show zeros as fallback)
- Map all KPIs and charts to real data
- Preserve existing export PDF functionality

**Non-Goals:**
- Real-time updates via WebSocket (polling acceptable)
- Date range filtering
- Additional chart types beyond existing 4

## Decisions

### 1. Fetch Strategy
**Decision:** Fetch data once on mount using `useEffect`.

**Rationale:**
- Dashboard doesn't need real-time updates
- Simpler than polling
- Data refreshes on page navigation

### 2. Data Flow
**Decision:** Use simple state with `useState` and `useEffect`.

**Rationale:**
- Dashboard is a leaf component (no children needing data)
- No need for context or global state management
- Matches existing component patterns in the codebase

### 3. Error Handling
**Decision:** Return zeros for all metrics on error (same as API fallback).

**Rationale:**
- Consistent with API error response
- User sees empty state gracefully
- No breaking UI changes

### 4. Loading State
**Decision:** Show spinner in main content area.

**Rationale:**
- User knows data is loading
- Better than showing empty state momentarily

## Risks / Trade-offs

| Risk | Mitigation |
|------|-------------|
| API timeout | Show loading spinner, then zeros |
| Session expired | Redirect to login (handled by layout) |
| Different data structure | Use optional chaining + fallback |

## Migration Plan

1. Add state for dashboard data and loading
2. Add useEffect to fetch from `/api/dashboard`
3. Replace mock data arrays with state variables
4. Add loading spinner
5. Add error handling (zeros fallback)
6. Test with real data

## Open Questions

1. Should we add a manual refresh button?
2. Should we show "Sin datos" message or just zeros?