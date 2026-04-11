## Context

The login and register pages currently use mock submissions that simulate authentication without calling the actual API. The backend Better Auth is already configured with endpoints at `/api/auth/signin` and `/api/auth/signup`. The frontend needs to connect to these endpoints with proper validation and error handling.

## Goals / Non-Goals

**Goals:**
- Connect login form to `/api/auth/signin` endpoint
- Connect register form to `/api/auth/signup` endpoint  
- Validate form inputs client-side before submission
- Display appropriate error messages on auth failure
- Redirect to `/dashboard` on successful authentication

**Non-Goals:**
- Password reset functionality
- Remember me / persistent sessions (handled by cookies)
- Logout button in UI
- OAuth providers (email + password only)

## Decisions

### 1. Fetch vs Library Client
**Decision:** Use native `fetch` API instead of `better-auth/react` client library.

**Rationale:** 
- Simpler for this use case (just need signin/signup)
- No additional dependencies needed
- Better control over error handling and redirects

### 2. Error Handling Strategy
**Decision:** Show inline error messages in existing error container.

**Rationale:**
- Minimal UI changes needed
- Existing `showError` state and error UI already in place
- User stays on same page to retry

### 3. Validation Rules
**Decision:** Use client-side validation with the following rules:
- Login: email regex + password ≥ 1 char
- Register: name ≥ 3 chars + email regex + password ≥ 1 char

**Rationale:**
- Quick feedback for user
- Backend will also validate, but client validation is faster
- Min password 1 char per dev requirement in `lib/auth/index.ts`

### 4. Register Success Flow
**Decision:** Show success toast/message, then redirect to `/dashboard`.

**Rationale:**
- User gets confirmation account was created
- Immediate access to dashboard (autoSignIn enabled in config)
- Matches user's requirement from requirements

## Risks / Trade-offs

| Risk | Mitigation |
|------|-------------|
| API timeout or network error | Show generic "Error de conexión" message |
| Server returns non-JSON error | Add try/catch with fallback error message |
| Race condition on fast submissions | Disable button during submission (`isSubmitting`) |
| Session cookie not set properly | Better Auth handles this; verify with manual test |

## Migration Plan

1. Modify `app/login/page.tsx` to call `/api/auth/signin`
2. Modify `app/register/page.tsx` to call `/api/auth/signup` 
3. Test both flows manually
4. No rollback needed - changes are additive only