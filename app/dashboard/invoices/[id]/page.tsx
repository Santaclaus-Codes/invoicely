'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getInvoice, updateInvoice, sendInvoice } from '@/app/actions/invoices'
import Button from '@/components/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function InvoiceDetailPage() {
  const params = useParams()
  const invoiceId = params.id as string

  const [invoice, setInvoice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadInvoice()
  }, [invoiceId])

  async function loadInvoice() {
    try {
      const data = await getInvoice(invoiceId)
      setInvoice(data)
    } catch (error) {
      console.error('Failed to load invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    try {
      await sendInvoice(invoiceId)
      setInvoice({ ...invoice, status: 'sent' })
    } catch (error) {
      console.error('Failed to send invoice:', error)
    }
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const element = document.getElementById('invoice-content')
      if (!element) return

      const canvas = await html2canvas(element)
      const img = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`invoice-${invoice?.invoiceNumber}.pdf`)
    } catch (error) {
      console.error('Failed to export PDF:', error)
    } finally {
      setExporting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading invoice...</p>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Invoice not found</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoice {invoice.invoiceNumber}</h1>
          <p className="text-muted-foreground mt-2">
            Status:{' '}
            <span
              className={`font-medium ${
                invoice.status === 'paid'
                  ? 'text-green-600'
                  : invoice.status === 'sent'
                    ? 'text-blue-600'
                    : 'text-yellow-600'
              }`}
            >
              {invoice.status}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {invoice.status !== 'sent' && invoice.status !== 'paid' && (
            <Button onClick={handleSend}>Send Invoice</Button>
          )}
          <Button onClick={handleExportPDF} disabled={exporting} variant="outline">
            {exporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      <div id="invoice-content" className="bg-white border border-border rounded-lg p-8 mb-8">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Invoicely</h2>
            <p className="text-muted-foreground text-sm">Your Company</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground">
              <span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}
            </p>
            <p className="text-sm text-foreground mt-2">
              <span className="font-medium">Issue Date:</span> {formatDate(invoice.issueDate)}
            </p>
            <p className="text-sm text-foreground mt-2">
              <span className="font-medium">Due Date:</span> {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 border-t border-b border-border py-6">
          <div>
            <h3 className="font-bold text-foreground mb-2">Bill To:</h3>
            <p className="text-foreground">{invoice.client?.name || 'N/A'}</p>
            {invoice.client?.email && <p className="text-sm text-muted-foreground">{invoice.client.email}</p>}
            {invoice.client?.address && (
              <p className="text-sm text-muted-foreground">{invoice.client.address}</p>
            )}
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 font-medium text-foreground">Description</th>
              <th className="text-right py-2 font-medium text-foreground">Quantity</th>
              <th className="text-right py-2 font-medium text-foreground">Unit Price</th>
              <th className="text-right py-2 font-medium text-foreground">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items?.map((item: any) => (
              <tr key={item.id} className="border-b border-border">
                <td className="py-3 text-foreground">{item.description}</td>
                <td className="text-right py-3 text-foreground">{item.quantity}</td>
                <td className="text-right py-3 text-foreground">
                  {formatCurrency(item.unitPrice, invoice.currency)}
                </td>
                <td className="text-right py-3 text-foreground">
                  {formatCurrency(item.amount, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2 border-t border-border">
              <span className="text-foreground">Subtotal:</span>
              <span className="text-foreground">
                {formatCurrency(invoice.subtotal, invoice.currency)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-foreground">Tax (10%):</span>
              <span className="text-foreground">{formatCurrency(invoice.tax, invoice.currency)}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold">
              <span className="text-foreground">Total:</span>
              <span className="text-primary">{formatCurrency(invoice.total, invoice.currency)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Notes:</h3>
            <p className="text-foreground whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
