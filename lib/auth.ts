import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { pool, db } from './db'
import * as schema from './db/schema'
import { google } from 'better-auth/social-providers'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: google({
      clientId: process.env.GOOGLE_CLIENT_ID_3 || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_4 || '',
    }),
  },
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-do-not-use-in-production',
  trustedOrigins: [
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    process.env.V0_RUNTIME_URL || 'http://localhost:3000',
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === 'development' ? ('none' as const) : ('lax' as const),
      secure: process.env.NODE_ENV === 'development' ? true : true,
    },
  },
})
