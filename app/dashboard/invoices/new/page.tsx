'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createInvoice } from '@/app/actions/invoices'
import { getClients } from '@/app/actions/clients'
import Button from '@/components/button'
import Input from '@/components/input'
import { generateId } from '@/lib/utils'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export default function CreateInvoicePage() {
  const router = useRouter()
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`)
  const [clientId, setClientId] = useState('')
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  )
  const [currency, setCurrency] = useState('USD')
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: generateId(), description: '', quantity: 1, unitPrice: 0 },
  ])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    try {
      const data = await getClients()
      setClients(data)
    } catch (error) {
      console.error('Failed to load clients:', error)
    }
  }

  const handleAddItem = () => {
    setItems([...items, { id: generateId(), description: '', quantity: 1, unitPrice: 0 }])
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleItemChange = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createInvoice({
        clientId,
        invoiceNumber,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        currency,
        items: items.map((item) => ({
          description: item.description,
          quantity: parseFloat(item.quantity.toString()),
          unitPrice: parseFloat(item.unitPrice.toString()),
        })),
        notes,
      })

      router.push('/dashboard/invoices')
    } catch (error) {
      console.error('Failed to create invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Create Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Invoice Number
            </label>
            <Input
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full border border-border rounded-lg px-3 py-2"
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Issue Date
            </label>
            <Input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
              <option value="AUD">AUD</option>
            </select>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Items</h2>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <Input
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                  />
                </div>
                <div className="w-20">
                  <label className="block text-sm font-medium text-foreground mb-2">Qty</label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(item.id, 'quantity', parseFloat(e.target.value))
                    }
                    min="0.01"
                    step="0.01"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-foreground mb-2">Price</label>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value))
                    }
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                  <div className="px-3 py-2 bg-muted rounded-lg text-foreground">
                    ${(item.quantity * item.unitPrice).toFixed(2)}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  className="mb-0"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <Button type="button" variant="outline" onClick={handleAddItem} className="mt-4">
            Add Item
          </Button>
        </div>

        <div className="bg-muted rounded-lg p-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-foreground">Subtotal:</span>
            <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground">Tax (10%):</span>
            <span className="text-foreground font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border">
            <span className="text-lg font-bold text-foreground">Total:</span>
            <span className="text-lg font-bold text-primary">${total.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or payment instructions"
            className="w-full border border-border rounded-lg px-3 py-2 min-h-24"
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Invoice'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
