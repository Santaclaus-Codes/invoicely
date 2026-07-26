'use client'

import { useEffect, useState } from 'react'
import { getTemplates, deleteTemplate } from '@/app/actions/templates'
import Link from 'next/link'
import Button from '@/components/button'
import { formatDate } from '@/lib/utils'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    try {
      const data = await getTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Failed to load templates:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(templateId: string) {
    if (!confirm('Are you sure you want to delete this template?')) return
    try {
      await deleteTemplate(templateId)
      setTemplates(templates.filter((t) => t.id !== templateId))
    } catch (error) {
      console.error('Failed to delete template:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoice Templates</h1>
          <p className="text-muted-foreground mt-2">Save and manage invoice templates</p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button>Create Invoice from Template</Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 bg-white border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">No templates saved yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Templates will appear here as you save them while creating invoices
          </p>
          <Link href="/dashboard/invoices/new">
            <Button>Create First Invoice</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-foreground mb-2">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Created {formatDate(template.createdAt)}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  Use Template
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(template.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
