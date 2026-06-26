import { sql } from 'drizzle-orm'
import {
	index,
	pgTable,
	primaryKey,
	text,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core'

import { organizationTable, teamTable } from '#/db/schemas/auth'
import { issueTable } from '#/db/schemas/issue'

export const labelTable = pgTable(
	'label',
	{
		id: uuid('id')
			.default(sql`pg_catalog.gen_random_uuid()`)
			.primaryKey(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizationTable.id, { onDelete: 'cascade' }),
		teamId: uuid('team_id')
			.notNull()
			.references(() => teamTable.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		color: text('color').default('#6b7280').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [
		index('label_organizationId_idx').on(table.organizationId),
		index('label_teamId_idx').on(table.teamId),
		unique('label_teamId_name_uq').on(table.teamId, table.name),
	]
)

export const issueLabelTable = pgTable(
	'issue_label',
	{
		issueId: uuid('issue_id')
			.notNull()
			.references(() => issueTable.id, { onDelete: 'cascade' }),
		labelId: uuid('label_id')
			.notNull()
			.references(() => labelTable.id, { onDelete: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.issueId, table.labelId] }),
		index('issueLabel_labelId_idx').on(table.labelId),
	]
)
