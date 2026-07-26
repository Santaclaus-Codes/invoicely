'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoice, invoiceItem, client } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { generateId } from '@/lib/utils'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createInvoice(data: {
  clientId: string
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  currency: string
  items: Array<{ description: string; quantity: number; unitPrice: number }>
  notes?: string
  paymentTerms?: string
}) {
  const userId = await getUserId()

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const invoiceId = generateId()

  await db.insert(invoice).values({
    id: invoiceId,
    userId,
    clientId: data.clientId,
    invoiceNumber: data.invoiceNumber,
    issueDate: data.issueDate,
    dueDate: data.dueDate,
    currency: data.currency,
    subtotal,
    tax,
    total,
    notes: data.notes,
    paymentTerms: data.paymentTerms,
    status: 'draft',
  })

  for (const item of data.items) {
    await db.insert(invoiceItem).values({
      id: generateId(),
      invoiceId,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      amount: item.quantity * item.unitPrice,
    })
  }

  revalidatePath('/dashboard/invoices')
  return invoiceId
}

export async function updateInvoice(
  invoiceId: string,
  data: {
    clientId?: string
    invoiceNumber?: string
    issueDate?: Date
    dueDate?: Date
    currency?: string
    status?: string
    notes?: string
    paymentTerms?: string
  }
) {
  const userId = await getUserId()

  await db
    .update(invoice)
    .set(data)
    .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, userId)))

  revalidatePath('/dashboard/invoices')
}

export async function getInvoices() {
  const userId = await getUserId()

  const invoices = await db
    .select()
    .from(invoice)
    .where(eq(invoice.userId, userId))
    .orderBy(desc(invoice.createdAt))

  return invoices
}

export async function getInvoice(invoiceId: string) {
  const userId = await getUserId()

  const inv = await db
    .select()
    .from(invoice)
    .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, userId)))
    .limit(1)

  if (!inv.length) throw new Error('Invoice not found')

  const items = await db
    .select()
    .from(invoiceItem)
    .where(eq(invoiceItem.invoiceId, invoiceId))

  const clientData = await db
    .select()
    .from(client)
    .where(eq(client.id, inv[0].clientId))
    .limit(1)

  return {
    ...inv[0],
    items,
    client: clientData[0] || null,
  }
}

export async function deleteInvoice(invoiceId: string) {
  const userId = await getUserId()

  await db
    .delete(invoiceItem)
    .where(eq(invoiceItem.invoiceId, invoiceId))

  await db
    .delete(invoice)
    .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, userId)))

  revalidatePath('/dashboard/invoices')
}

export async function sendInvoice(invoiceId: string) {
  const userId = await getUserId()

  await db
    .update(invoice)
    .set({ status: 'sent' })
    .where(and(eq(invoice.id, invoiceId), eq(invoice.userId, userId)))

  revalidatePath('/dashboard/invoices')
}
