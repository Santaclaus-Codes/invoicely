'use client'

import { useEffect, useState } from 'react'
import { getInvoices, deleteInvoice } from '@/app/actions/invoices'
import Link from 'next/link'
import Button from '@/components/button'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInvoices()
  }, [])

  async function loadInvoices() {
    try {
      const data = await getInvoices()
      setInvoices(data)
    } catch (error) {
      console.error('Failed to load invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(invoiceId: string) {
    if (!confirm('Are you sure you want to delete this invoice?')) return
    try {
      await deleteInvoice(invoiceId)
      setInvoices(invoices.filter((inv) => inv.id !== invoiceId))
    } catch (error) {
      console.error('Failed to delete invoice:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-2">Manage your invoices</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button>Create Invoice</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading invoices...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No invoices yet</p>
          <Link href="/dashboard/invoices/new">
            <Button>Create Your First Invoice</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {invoice.clientId || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex gap-2 justify-end">
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
