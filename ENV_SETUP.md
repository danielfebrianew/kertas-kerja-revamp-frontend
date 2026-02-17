# Environment Variables Setup

## Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` as needed for your environment.

## Environment Variables

### Required Variables

- **NEXT_PUBLIC_API_URL** - Base URL for the backend API
  - Default: `https://api-ekak.zeabur.app`
  - This is used for all API calls throughout the application

- **NEXTAUTH_URL** - URL of your Next.js application
  - Development: `http://localhost:3000`
  - Production: Your deployed URL

- **NEXTAUTH_SECRET** - Secret key for NextAuth session encryption
  - Generate a secure random string for production
  - Can use: `openssl rand -base64 32`

### Optional Variables

- **SITE_URL** - Legacy support for old environment variable name
  - Will use `NEXT_PUBLIC_API_URL` if not set

- **BASIC_AUTH_TOKEN** - Basic authentication token (if needed)

## Files Updated

The following files have been updated to use environment variables:

1. **lib/fetcher.ts** - Main API fetcher utility
   - Uses `NEXT_PUBLIC_API_URL` or falls back to `SITE_URL`

2. **app/page.tsx** - Login page
   - Uses `NEXT_PUBLIC_API_URL` for authentication endpoint

3. **app/api/auth/[...nextauth]/route.ts** - NextAuth configuration
   - Uses `NEXT_PUBLIC_API_URL` for authentication API calls

## Important Notes

- `.env.local` is ignored by git and should never be committed
- `.env.example` is committed to git as a template
- Always use `NEXT_PUBLIC_` prefix for client-side accessible variables
- Server-only variables don't need the `NEXT_PUBLIC_` prefix

## Development vs Production

### Development (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api-ekak.zeabur.app
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=development-secret-key
```

### Production (Deployment Platform)
```env
NEXT_PUBLIC_API_URL=https://your-production-api.com
NEXTAUTH_URL=https://your-app.com
NEXTAUTH_SECRET=your-secure-random-string
```

## Vercel Deployment

If deploying to Vercel, add these environment variables in your project settings:
- Go to Project Settings → Environment Variables
- Add each variable with appropriate values for each environment (Production, Preview, Development)
