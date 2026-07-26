'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth-client'
import Button from './button'
import Input from './input'

export default function AuthForm({ mode = 'sign-in' }: { mode?: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'sign-up') {
        await signUp.email(
          { email, password, name },
          { onSuccess: () => router.push('/dashboard') }
        )
      } else {
        await signIn.email(
          { email, password },
          { onSuccess: () => router.push('/dashboard') }
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      await signIn.social(
        { provider: 'google', callbackURL: '/dashboard' },
        { onSuccess: () => router.push('/dashboard') }
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'sign-up' && (
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Loading...' : mode === 'sign-up' ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>

      <div className="my-4 flex items-center">
        <div className="flex-1 border-t border-border"></div>
        <span className="px-2 text-muted-foreground text-sm">or</span>
        <div className="flex-1 border-t border-border"></div>
      </div>

      <Button onClick={handleGoogleSignIn} disabled={loading} variant="outline" className="w-full">
        {loading ? 'Loading...' : 'Continue with Google'}
      </Button>
    </div>
  )
}
