import { sql } from 'drizzle-orm'
import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core'

import { organizationTable, teamTable } from '#/db/schemas/auth'

export const issueStatusTypeEnum = pgEnum('issue_status_type', [
	'backlog',
	'todo',
	'in_progress',
	'in_review',
	'done',
	'canceled',
])

export const issueStatusTable = pgTable(
	'issue_status',
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
		type: issueStatusTypeEnum('type').notNull(),
		position: integer('position').notNull().default(0),
		color: text('color'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index('issueStatus_organizationId_idx').on(table.organizationId),
		index('issueStatus_teamId_idx').on(table.teamId),
		unique('issueStatus_teamId_name_uq').on(table.teamId, table.name),
	]
)
