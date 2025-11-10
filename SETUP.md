# Setup Instructions

This project consists of a multi-application system with a .NET backend and three frontend applications (Next.js and two Angular apps) that share session-based authentication.

## Prerequisites

- **.NET 8.0 SDK** - [Download here](https://dotnet.microsoft.com/download)
- **Node.js 18+** and **npm** - [Download here](https://nodejs.org/)
- **Angular CLI** (will be installed locally via npm)

## Project Structure

```
take-home-fe-test/
├── backend-dotnet/          # C# .NET API (Port 5000)
├── frontend-nextjs/         # Next.js App (Port 3000)
├── frontend-angular1/       # Angular User App (Port 4200)
└── frontend-angular2/       # Angular Admin App (Port 4201)
```

## Setup Steps

### Quick Setup (All at Once)

**Option 1: Using helper scripts**

```bash
# Install all dependencies
npm run install:all

# Start all services (requires 4 separate terminals)
./start-all.sh  # Or use individual start commands below
```

**Option 2: Manual setup (recommended for first-time setup)**

### 1. Backend (.NET)

```bash
cd backend-dotnet
dotnet restore
dotnet run
```

The backend will start on `http://localhost:5000`

### 2. Next.js Frontend

```bash
cd frontend-nextjs
npm install
npm run dev
```

The Next.js app will start on `http://localhost:3000`

### 3. Angular User App (Angular1)

```bash
cd frontend-angular1
npm install
npm start
```

The Angular user app will start on `http://localhost:4200`

### 4. Angular Admin App (Angular2)

```bash
cd frontend-angular2
npm install
npm start
```

The Angular admin app will start on `http://localhost:4201`

**Note:** Each service should run in its own terminal window. The order doesn't matter, but the backend should be running before testing authentication flows.

## Test Credentials

### User Login (Next.js)

- **Phone**: `1234567890`
- **OTP**: `1234`

### Admin Login (Angular2)

- **Email**: `admin@example.com`
- **Password**: `admin123`

## Testing the Flows

### Flow 1: Next.js → Angular1 (User Flow)

1. Open `http://localhost:3000` in your browser
2. Login with phone `1234567890` and OTP `1234`
3. Click "Resume Application" - you'll be redirected to Angular1
4. You should see a welcome message without needing to login again
5. Click "Go Back to Home" to return to Next.js, still authenticated

### Flow 2: Angular2 → Angular1 (Admin Flow)

1. Open `http://localhost:4201` in your browser
2. Login with email `admin@example.com` and password `admin123`
3. You'll see the admin dashboard with a list of applications
4. Click on the first application - you'll be redirected to Angular1
5. You should see a welcome message with the admin name displayed
6. Click "Back to App" to return to Angular2, still authenticated

## Session Management

All applications share the same session cookie (`auth.session`) managed by the .NET backend. The cookie is configured with:

- `SameSite=None` for cross-origin support (set to `Lax` or `Strict` in production with same domain)
- `HttpOnly=true` for security
- `Secure=false` for local development (set to `true` in production with HTTPS)

## Production Considerations

For production deployment (Azure + Cloudflare, same domain):

1. **Update cookie settings** in `backend-dotnet/Program.cs`:

   - Set `Secure = true` (requires HTTPS)
   - Set `SameSite = SameSiteMode.Lax` or `Strict` (since all apps share the same domain)

2. **Update CORS** in `backend-dotnet/Program.cs`:

   - Replace localhost origins with your production domain
   - Or remove CORS if all apps are served from the same domain

3. **Update API URLs** in frontend applications:
   - Replace `http://localhost:5000` with your production API URL

## Troubleshooting

### Cookies not persisting

- Ensure all apps are running
- Check browser console for CORS errors
- Verify cookies are being set in browser DevTools → Application → Cookies

### Session not recognized

- Clear browser cookies and try again
- Ensure backend is running and accessible
- Check network tab for failed API calls

### Port conflicts

- If ports are in use, update the ports in:
  - Next.js: `package.json` scripts or `next.config.js`
  - Angular: `package.json` scripts (change `--port` flag)
  - .NET: `Program.cs` (change `app.Run()` URL)

## Development Notes

- All authentication is hard-coded for simplicity (as per requirements)
- Session timeout is set to 30 minutes
- The applications use Tailwind CSS for styling
- All apps are configured to work with the shared session cookie
