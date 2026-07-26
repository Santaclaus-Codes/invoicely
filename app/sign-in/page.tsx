import { headers, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import AuthForm from '@/components/auth-form'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Invoicely</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        <AuthForm mode="sign-in" />
        <p className="text-center text-muted-foreground text-sm mt-6">
          Don&apos;t have an account?{' '}
          <a href="/sign-up" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
