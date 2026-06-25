import { sql } from 'drizzle-orm'
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const todoTable = pgTable('todo', {
	id: uuid('id')
		.default(sql`pg_catalog.gen_random_uuid()`)
		.primaryKey(),
	nama: text('nama').notNull(),
	isComplete: boolean('is_complete').default(false).notNull(),
})
