'use client'

import { useEffect, useState } from 'react'
import { getClients, deleteClient } from '@/app/actions/clients'
import Link from 'next/link'
import Button from '@/components/button'

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadClients()
  }, [])

  async function loadClients() {
    try {
      const data = await getClients()
      setClients(data)
    } catch (error) {
      console.error('Failed to load clients:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(clientId: string) {
    if (!confirm('Are you sure you want to delete this client?')) return
    try {
      await deleteClient(clientId)
      setClients(clients.filter((c) => c.id !== clientId))
    } catch (error) {
      console.error('Failed to delete client:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clients</h1>
          <p className="text-muted-foreground mt-2">Manage your clients</p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button>Add Client</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading clients...</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No clients yet</p>
          <Link href="/dashboard/clients/new">
            <Button>Add Your First Client</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-foreground">
                  City
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{client.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{client.email || '—'}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{client.phone || '—'}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{client.city || '—'}</td>
                  <td className="px-6 py-4 text-right flex gap-2 justify-end">
                    <Link href={`/dashboard/clients/${client.id}`}>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(client.id)}
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
