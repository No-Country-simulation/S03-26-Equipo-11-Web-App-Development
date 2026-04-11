# Tasks: better-auth-implementation

## Phase 1: Dependencies

- [x] **T001**: Install `better-auth`, `better-auth-adapters`, `bcrypt`, `drizzle-zod`
- [x] **T002**: Install `@types/bcrypt` as dev dependency

## Phase 2: Auth Configuration

- [x] **T003**: Create `lib/auth/index.ts` with Better Auth configuration
- [x] **T004**: Configure drizzle adapter to use existing `users` table
- [x] **T005**: Configure emailPassword plugin with bcrypt

## Phase 3: Auth API Routes

- [x] **T006**: Create `app/api/auth/[...all]/route.ts` (catch-all handler)
- [ ] **T007**: Test auth endpoints with curl/postman

## Phase 4: Session Helpers

- [x] **T008**: Create `lib/auth/session.ts` with helper functions
- [x] **T009**: Implement `getSession()`, `requireAuth()`, `requireRole()`

## Phase 5: Middleware

- [x] **T010**: Create `middleware.ts` at project root
- [x] **T011**: Configure public routes (/api/auth/*, /api/health)
- [x] **T012**: Configure protected routes (/api/*)
- [x] **T013**: Add user headers (x-user-id, x-user-role)

## Phase 6: Protect Endpoints

- [x] **T014**: Protect `app/api/email/send/route.ts`
- [x] **T015**: Protect `app/api/email/receive/route.ts`
- [x] **T016**: Protect `app/api/email/receive-sync/route.ts`
- [x] **T017**: Protect `app/api/email/receiveOne/route.ts`
- [x] **T018**: Protect `app/api/email/sync-status/route.ts`

## Phase 7: Existing Users

- [x] **T019**: Hash existing user passwords with bcrypt
- [ ] **T020**: Verify existing 3 users can login

## Phase 8: Testing

- [ ] **T021**: Test login flow end-to-end
- [ ] **T022**: Test protected endpoint without session (should 401)
- [ ] **T023**: Test protected endpoint with valid session
- [ ] **T024**: Test logout flow

## Dependencies

- T001 → T003
- T003 → T006
- T006 → T008
- T008 → T010
- T010 → T014
- T001 + T019 → T020
- T020 → T021
- T021 → T022, T023, T024
