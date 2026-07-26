import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Invoicely - Invoice Management',
  description: 'Professional invoice management system with client tracking, templates, and PDF export.',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#3B82F6',
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body>{children}</body>
    </html>
  )
}
