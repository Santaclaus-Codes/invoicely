'use client'

import { useSession, signOut } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from './button'

export default function Navigation() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
  }

  return (
    <nav className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            Invoicely
          </Link>
          <div className="flex gap-6">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/invoices"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Invoices
            </Link>
            <Link
              href="/dashboard/clients"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Clients
            </Link>
            <Link
              href="/dashboard/templates"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Templates
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{session?.user?.email}</span>
          <Button onClick={handleSignOut} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  )
}
