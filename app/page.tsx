import { headers, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import Button from '@/components/button'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
          Invoicely
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Professional invoice management made simple. Create, send, and track invoices with ease.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/sign-up">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Create Invoices</h3>
            <p className="text-muted-foreground text-sm">
              Quickly create professional invoices with customizable templates.
            </p>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Track Payments</h3>
            <p className="text-muted-foreground text-sm">
              Keep track of invoice status and payment history in one place.
            </p>
          </div>

          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-2">Export PDFs</h3>
            <p className="text-muted-foreground text-sm">
              Download and share invoices as PDFs with just one click.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
