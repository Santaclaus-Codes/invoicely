'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/actions/clients'
import Button from '@/components/button'
import Input from '@/components/input'

export default function CreateClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await createClient(formData)
      router.push('/dashboard/clients')
    } catch (error) {
      console.error('Failed to create client:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Add Client</h1>
        <p className="text-muted-foreground mt-2">Create a new client for your invoices</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Client Name *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Acme Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Country</label>
            <Input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="United States"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">Address</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">City</label>
            <Input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">State</label>
            <Input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State/Province"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Zip Code</label>
            <Input
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Zip/Postal Code"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Client'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
