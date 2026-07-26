import { pgTable, text, timestamp, integer, boolean, real, jsonb } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Better Auth Tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Invoice App Tables
export const client = pgTable('client', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  zipCode: text('zipCode'),
  country: text('country'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const invoice = pgTable('invoice', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  clientId: text('clientId').notNull(),
  invoiceNumber: text('invoiceNumber').notNull(),
  issueDate: timestamp('issueDate').notNull(),
  dueDate: timestamp('dueDate').notNull(),
  currency: text('currency').notNull().default('USD'),
  status: text('status').notNull().default('draft'),
  subtotal: real('subtotal').notNull().default(0),
  tax: real('tax').notNull().default(0),
  total: real('total').notNull().default(0),
  notes: text('notes'),
  paymentTerms: text('paymentTerms'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const invoiceItem = pgTable('invoiceItem', {
  id: text('id').primaryKey(),
  invoiceId: text('invoiceId').notNull(),
  description: text('description').notNull(),
  quantity: real('quantity').notNull().default(1),
  unitPrice: real('unitPrice').notNull(),
  amount: real('amount').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const invoiceTemplate = pgTable('invoiceTemplate', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  templateData: jsonb('templateData').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const payment = pgTable('payment', {
  id: text('id').primaryKey(),
  invoiceId: text('invoiceId').notNull(),
  amount: real('amount').notNull(),
  paymentDate: timestamp('paymentDate').notNull(),
  paymentMethod: text('paymentMethod').notNull(),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// Relations
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  clients: many(client),
  invoices: many(invoice),
  templates: many(invoiceTemplate),
}))

export const clientRelations = relations(client, ({ many }) => ({
  invoices: many(invoice),
}))

export const invoiceRelations = relations(invoice, ({ many, one }) => ({
  items: many(invoiceItem),
  payments: many(payment),
  client: one(client, {
    fields: [invoice.clientId],
    references: [client.id],
  }),
}))

export const invoiceItemRelations = relations(invoiceItem, ({ one }) => ({
  invoice: one(invoice, {
    fields: [invoiceItem.invoiceId],
    references: [invoice.id],
  }),
}))

export const paymentRelations = relations(payment, ({ one }) => ({
  invoice: one(invoice, {
    fields: [payment.invoiceId],
    references: [invoice.id],
  }),
}))
