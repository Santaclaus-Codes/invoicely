'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoiceTemplate } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { generateId } from '@/lib/utils'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createTemplate(data: {
  name: string
  templateData: Record<string, any>
}) {
  const userId = await getUserId()

  const templateId = generateId()

  await db.insert(invoiceTemplate).values({
    id: templateId,
    userId,
    name: data.name,
    templateData: data.templateData,
  })

  revalidatePath('/dashboard/templates')
  return templateId
}

export async function updateTemplate(
  templateId: string,
  data: {
    name?: string
    templateData?: Record<string, any>
  }
) {
  const userId = await getUserId()

  await db
    .update(invoiceTemplate)
    .set(data)
    .where(and(eq(invoiceTemplate.id, templateId), eq(invoiceTemplate.userId, userId)))

  revalidatePath('/dashboard/templates')
}

export async function getTemplates() {
  const userId = await getUserId()

  const templates = await db
    .select()
    .from(invoiceTemplate)
    .where(eq(invoiceTemplate.userId, userId))
    .orderBy(desc(invoiceTemplate.createdAt))

  return templates
}

export async function deleteTemplate(templateId: string) {
  const userId = await getUserId()

  await db
    .delete(invoiceTemplate)
    .where(and(eq(invoiceTemplate.id, templateId), eq(invoiceTemplate.userId, userId)))

  revalidatePath('/dashboard/templates')
}
