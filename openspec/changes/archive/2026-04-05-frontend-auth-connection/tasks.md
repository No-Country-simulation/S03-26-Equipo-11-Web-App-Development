# Tasks: frontend-auth-connection

## 1. Login Page Integration

- [x] 1.1 Modify `app/login/page.tsx` handleSubmit to use async fetch
- [x] 1.2 Add POST to `/api/auth/signin` with { email, password }
- [x] 1.3 Handle success: redirect to `/dashboard`
- [x] 1.4 Handle error: show "Credenciales incorrectas" message

## 2. Register Page Integration

- [x] 2.1 Modify `app/register/page.tsx` handleSubmit to use async fetch
- [x] 2.2 Add POST to `/api/auth/signup` with { email, password, name }
- [x] 2.3 Update password validation from ≥6 to ≥1 char
- [x] 2.4 Handle success: show "¡Cuenta creada exitosamente!" then redirect to dashboard
- [x] 2.5 Handle error: show appropriate error message

## 3. Testing

- [x] 3.1 Test login flow with valid credentials
- [x] 3.2 Test login flow with invalid credentials  
- [x] 3.3 Test register flow with new user
- [x] 3.4 Test register flow with existing email

## Dependencies

- 1.1 → 1.2 → 1.3, 1.4
- 2.1 → 2.2 → 2.3, 2.4, 2.5
- 1.1, 2.1 → 3.1, 3.2, 3.3, 3.4