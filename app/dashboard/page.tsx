import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard - Invoicely',
  description: 'Manage your invoices',
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {session.user.name}!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Link
            href="/dashboard/company"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Company Setup
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your company details and information
            </p>
          </Link>

          <Link
            href="/dashboard/invoices/new"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Create Invoice
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create a new invoice for your customers
            </p>
          </Link>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Invoices
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No invoices yet. Create your first invoice to get started.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
