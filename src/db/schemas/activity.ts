import { sql } from 'drizzle-orm'
import {
	index,
	jsonb,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'

import { organizationTable, userTable } from '#/db/schemas/auth'
import { issueTable } from '#/db/schemas/issue'

export const issueActivityTable = pgTable(
	'issue_activity',
	{
		id: uuid('id')
			.default(sql`pg_catalog.gen_random_uuid()`)
			.primaryKey(),
		issueId: uuid('issue_id')
			.notNull()
			.references(() => issueTable.id, { onDelete: 'cascade' }),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizationTable.id, { onDelete: 'cascade' }),
		actorId: uuid('actor_id').references(() => userTable.id, {
			onDelete: 'set null',
		}),
		eventType: text('event_type').notNull(),
		metadata: jsonb('metadata'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [
		index('issueActivity_issueId_idx').on(table.issueId),
		index('issueActivity_organizationId_idx').on(table.organizationId),
		index('issueActivity_actorId_idx').on(table.actorId),
	]
)
