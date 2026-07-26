'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { client } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { generateId } from '@/lib/utils'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createClient(data: {
  name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}) {
  const userId = await getUserId()

  const clientId = generateId()

  await db.insert(client).values({
    id: clientId,
    userId,
    ...data,
  })

  revalidatePath('/dashboard/clients')
  return clientId
}

export async function updateClient(
  clientId: string,
  data: {
    name?: string
    email?: string
    phone?: string
    address?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
) {
  const userId = await getUserId()

  await db
    .update(client)
    .set(data)
    .where(and(eq(client.id, clientId), eq(client.userId, userId)))

  revalidatePath('/dashboard/clients')
}

export async function getClients() {
  const userId = await getUserId()

  const clients = await db
    .select()
    .from(client)
    .where(eq(client.userId, userId))
    .orderBy(desc(client.createdAt))

  return clients
}

export async function getClient(clientId: string) {
  const userId = await getUserId()

  const clients = await db
    .select()
    .from(client)
    .where(and(eq(client.id, clientId), eq(client.userId, userId)))
    .limit(1)

  if (!clients.length) throw new Error('Client not found')

  return clients[0]
}

export async function deleteClient(clientId: string) {
  const userId = await getUserId()

  await db
    .delete(client)
    .where(and(eq(client.id, clientId), eq(client.userId, userId)))

  revalidatePath('/dashboard/clients')
}
