# Verification Checklist

Use this checklist to verify that the implementation is working correctly.

## Prerequisites Check

- [ ] .NET 8.0 SDK is installed (`dotnet --version`)
- [ ] Node.js 18+ is installed (`node --version`)
- [ ] npm is installed (`npm --version`)

## Installation Check

- [ ] Backend dependencies installed (`cd backend-dotnet && dotnet restore`)
- [ ] Next.js dependencies installed (`cd frontend-nextjs && npm install`)
- [ ] Angular1 dependencies installed (`cd frontend-angular1 && npm install`)
- [ ] Angular2 dependencies installed (`cd frontend-angular2 && npm install`)

## Service Startup Check

- [ ] Backend starts on `http://localhost:5000`
- [ ] Next.js starts on `http://localhost:3000`
- [ ] Angular1 starts on `http://localhost:4200`
- [ ] Angular2 starts on `http://localhost:4201`

## Flow 1: Next.js → Angular1 (User Flow)

1. [ ] Open `http://localhost:3000` in browser
2. [ ] See login form with phone and OTP fields
3. [ ] Enter phone: `1234567890` and OTP: `1234`
4. [ ] Click "Login" - should see success message
5. [ ] See "Resume Application" button
6. [ ] Click "Resume Application" - redirects to `http://localhost:4200`
7. [ ] Angular1 shows welcome message (no login required)
8. [ ] Click "Go Back to Home" - returns to Next.js
9. [ ] Still authenticated in Next.js (no login form)

## Flow 2: Angular2 → Angular1 (Admin Flow)

1. [ ] Open `http://localhost:4201` in browser
2. [ ] See admin login form
3. [ ] Enter email: `admin@example.com` and password: `admin123`
4. [ ] Click "Login" - redirects to dashboard
5. [ ] See admin dashboard with list of applications
6. [ ] Click on first application - redirects to `http://localhost:4200`
7. [ ] Angular1 shows welcome message with admin name displayed
8. [ ] Click "Back to App" - returns to Angular2 dashboard
9. [ ] Still authenticated in Angular2

## Session Cookie Check

1. [ ] Open browser DevTools → Application → Cookies
2. [ ] After login, see `auth.session` cookie set
3. [ ] Cookie has `HttpOnly` flag
4. [ ] Cookie persists across navigation between apps
5. [ ] Cookie is sent with requests (check Network tab)

## API Endpoints Check

Test these endpoints directly (using curl or Postman):

- [ ] `GET http://localhost:5000/api/auth/session` - returns session info
- [ ] `POST http://localhost:5000/api/auth/login/phone` - phone login works
- [ ] `POST http://localhost:5000/api/auth/login/admin` - admin login works
- [ ] `POST http://localhost:5000/api/auth/logout` - logout works

## Error Handling Check

- [ ] Invalid credentials show error message
- [ ] Network errors are handled gracefully
- [ ] Unauthenticated access to Angular1 shows "Access Denied"
- [ ] Unauthenticated access to Angular2 dashboard redirects to login

## Production Readiness Check

- [ ] Cookie settings documented for production (Secure, SameSite)
- [ ] CORS configuration can be updated for production domain
- [ ] API URLs can be configured for production
- [ ] All hard-coded values are clearly marked as test credentials

## Code Quality Check

- [ ] No console errors in browser
- [ ] No TypeScript compilation errors
- [ ] No C# compilation errors
- [ ] All imports are correct
- [ ] Code is well-organized and readable

---

If all items are checked, the implementation is complete and ready for review! ✅
