# Google OAuth Setup - Invoicely

## ✅ Google Sign-In is Now Enabled

Your Invoicely invoice management app now supports **Google OAuth Sign-In** alongside traditional email/password authentication.

## What's Implemented

### Authentication Methods
- **Email + Password**: Traditional email/password sign-up and sign-in
- **Google OAuth 2.0**: One-click Google Sign-In on both sign-up and sign-in pages

### Where Google OAuth Appears
1. **Sign-Up Page** (`/sign-up`)
   - "Continue with Google" button with Google logo
   - Located above the email/password form
   - Users can create account instantly with Google credentials

2. **Sign-In Page** (`/sign-in`)
   - "Continue with Google" button with Google logo
   - Located above the email/password form
   - Existing users can log in with Google account

## Configuration Details

### Environment Variables Required
The following environment variables are already configured in your Vercel project:
- `GOOGLE_ID` - Google OAuth Client ID
- `GOOGLE_SECRET` - Google OAuth Client Secret
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Session encryption key

### Tech Stack
- **Auth Framework**: Better Auth v1.6+
- **OAuth Provider**: Google OAuth 2.0
- **Database**: PostgreSQL (Neon)
- **Frontend Framework**: Next.js 16 with React 19

## How It Works

### User Flow - Google Sign-In
1. User clicks "Continue with Google" button
2. Redirected to Google OAuth consent screen
3. User approves app access to their Google account
4. User data (name, email, profile picture) returned to app
5. User account automatically created or existing account logged in
6. Redirected to dashboard (`/dashboard`)

### User Flow - Email/Password Alternative
1. User enters name (sign-up), email, and password
2. Clicks "Create Account" or "Sign In"
3. Account created or credentials verified
4. Redirected to dashboard
5. Session established via Better Auth

## File Structure

```
lib/
├── auth.ts              ← Google OAuth + Better Auth config
├── auth-client.ts       ← Client-side auth functions
└── db/
    ├── index.ts         ← Drizzle ORM setup
    └── schema.ts        ← Database tables

app/
├── page.tsx             ← Landing page
├── sign-in/page.tsx     ← Sign-in with Google OAuth
├── sign-up/page.tsx     ← Sign-up with Google OAuth
└── dashboard/
    ├── page.tsx         ← Protected dashboard
    └── layout.tsx       ← Authenticated layout

components/
└── auth-form.tsx        ← Unified auth form with Google button
```

## Testing Google OAuth

### Local Development
1. Ensure `GOOGLE_ID` and `GOOGLE_SECRET` are set in `.env.development.local`
2. Start dev server: `npm run dev`
3. Visit `http://localhost:3000/sign-up`
4. Click "Continue with Google"
5. Complete Google OAuth flow

### Production Deployment
1. Add `GOOGLE_ID` and `GOOGLE_SECRET` to Vercel environment variables
2. Update Google OAuth app authorized redirect URIs to your production domain
3. Deploy to Vercel

## Security Features

✅ **Built-In Security**
- Secure session management with Better Auth
- CSRF protection
- Encrypted session tokens
- Automatic password hashing (for email/password auth)
- User data isolation (each user can only access their own data)
- Row-level security via userId scoping

## Troubleshooting

### "Google Sign-In not showing"
- Verify `GOOGLE_ID` and `GOOGLE_SECRET` are set
- Check browser console for auth errors
- Ensure database tables are created

### "Invalid OAuth credentials"
- Confirm Google OAuth app credentials are correct
- Check authorized redirect URIs in Google Console
- Verify redirect matches: `{BASE_URL}/api/auth/callback/google`

### "User not created after Google sign-in"
- Check database connection
- Ensure `user`, `account`, `session`, and `verification` tables exist
- Review PostgreSQL error logs

## Next Steps

### To Deploy:
```bash
git push origin invoice-management-system
```

### To Add More OAuth Providers:
Edit `lib/auth.ts` and add providers like:
- GitHub
- Discord
- Microsoft
- Facebook

### To Test Email Sign-Up:
1. Visit `/sign-up`
2. Enter name, email, and password (8+ characters)
3. Click "Create Account"
4. Verify email validation works

## Support

For issues or questions:
1. Check Better Auth documentation: https://www.better-auth.com/
2. Review Google OAuth setup: https://developers.google.com/identity/protocols/oauth2
3. Check Neon PostgreSQL docs: https://neon.tech/docs
