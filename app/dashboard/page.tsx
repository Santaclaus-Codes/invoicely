'use client'

import { useEffect, useState } from 'react'
import { getInvoices } from '@/app/actions/invoices'
import { getClients } from '@/app/actions/clients'
import Link from 'next/link'
import Button from '@/components/button'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalClients: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [invoices, clients] = await Promise.all([getInvoices(), getClients()])

        const totalRevenue = invoices
          .filter((inv) => inv.status === 'paid')
          .reduce((sum, inv) => sum + (inv.total || 0), 0)

        const pending = invoices.filter((inv) => inv.status !== 'paid').length

        setStats({
          totalInvoices: invoices.length,
          totalClients: clients.length,
          totalRevenue,
          pendingInvoices: pending,
        })
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to Invoicely</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Invoices</h3>
          <p className="text-3xl font-bold text-foreground mt-2">
            {loading ? '—' : stats.totalInvoices}
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Clients</h3>
          <p className="text-3xl font-bold text-foreground mt-2">
            {loading ? '—' : stats.totalClients}
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
          <p className="text-3xl font-bold text-foreground mt-2">
            {loading ? '—' : `$${stats.totalRevenue.toFixed(2)}`}
          </p>
        </div>

        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">Pending Invoices</h3>
          <p className="text-3xl font-bold text-accent mt-2">
            {loading ? '—' : stats.pendingInvoices}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Link href="/dashboard/invoices/new">
          <Button>Create Invoice</Button>
        </Link>
        <Link href="/dashboard/clients/new">
          <Button variant="outline">Add Client</Button>
        </Link>
      </div>
    </div>
  )
}
