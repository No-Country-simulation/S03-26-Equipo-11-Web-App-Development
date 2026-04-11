## Why

Currently the login (`app/login/page.tsx`) and register (`app/register/page.tsx`) pages use mock/stub implementations that don't connect to the actual Better Auth API endpoints. Users cannot authenticate or register through the UI. This blocks the user flow and prevents testing the authentication system end-to-end.

## What Changes

- **Modify `app/login/page.tsx`**: Replace mock `handleSubmit` with actual fetch to `/api/auth/signin`
- **Modify `app/register/page.tsx`**: Replace mock `handleSubmit` with actual fetch to `/api/auth/signup`
- Add server-side validation feedback for invalid credentials
- Maintain existing UI validations (email regex, password minimums)
- On successful auth, redirect to `/dashboard`

## Capabilities

### New Capabilities
- **frontend-auth-api**: Connect login/register forms to Better Auth API endpoints with proper validation and error handling

### Modified Capabilities
- None (existing auth capability is backend-only; this adds frontend integration)

## Non-goals
- Password reset flow
- Session persistence across page reloads (handled by better-auth cookies)
- Logout functionality in UI (already tested via API)

## Impact

**Modified Files:**
- `app/login/page.tsx`
- `app/register/page.tsx`

**Affected APIs:**
- `POST /api/auth/signin`
- `POST /api/auth/signup`

**Dependencies:**
- Better Auth backend (already configured in `lib/auth/index.ts`)