'use client'

import { createAuthClient } from 'better-auth/react'

const baseURL =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000'

export const { signUp, signIn, signOut, useSession, ...authClient } =
  createAuthClient({
    baseURL,
  })
