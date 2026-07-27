import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'Invoicely - Professional Invoice Generator',
  description: 'Create, manage, and download professional invoices with automatic calculations',
}

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Invoicely
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-8">
          Professional Invoice Generation Made Simple
        </p>
        <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto">
          Create, manage, and download beautiful invoices with automatic calculations. Perfect for freelancers and small businesses.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="text-lg font-semibold text-white mb-2">Easy Creation</h3>
            <p className="text-slate-400">Create invoices in minutes with our intuitive form</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">🧮</div>
            <h3 className="text-lg font-semibold text-white mb-2">Auto Calculations</h3>
            <p className="text-slate-400">Automatic subtotal, GST, and total calculations</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-3">📥</div>
            <h3 className="text-lg font-semibold text-white mb-2">PDF Export</h3>
            <p className="text-slate-400">Download invoices as professional PDFs</p>
          </div>
        </div>
      </div>
    </div>
  )
}
