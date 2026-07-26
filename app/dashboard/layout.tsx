import { headers, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Navigation from '@/components/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-8">{children}</main>
    </div>
  )
}
