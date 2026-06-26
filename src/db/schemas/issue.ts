import { sql } from 'drizzle-orm'
import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core'

import { organizationTable, teamTable, userTable } from '#/db/schemas/auth'
import { priorityTable } from '#/db/schemas/priority'
import { projectTable } from '#/db/schemas/project'
import { issueStatusTable } from '#/db/schemas/status'

export const issueTable = pgTable(
	'issue',
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
		projectId: uuid('project_id').references(() => projectTable.id, {
			onDelete: 'set null',
		}),
		number: integer('number').notNull(),
		identifier: text('identifier').notNull(),
		title: text('title').notNull(),
		description: text('description'),
		statusId: uuid('status_id').references(() => issueStatusTable.id, {
			onDelete: 'set null',
		}),
		priorityId: uuid('priority_id').references(() => priorityTable.id, {
			onDelete: 'set null',
		}),
		assigneeId: uuid('assignee_id').references(() => userTable.id, {
			onDelete: 'set null',
		}),
		creatorId: uuid('creator_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		archivedAt: timestamp('archived_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index('issue_organizationId_idx').on(table.organizationId),
		index('issue_teamId_idx').on(table.teamId),
		index('issue_projectId_idx').on(table.projectId),
		index('issue_statusId_idx').on(table.statusId),
		index('issue_priorityId_idx').on(table.priorityId),
		index('issue_assigneeId_idx').on(table.assigneeId),
		index('issue_creatorId_idx').on(table.creatorId),
		index('issue_updatedAt_idx').on(table.updatedAt),
		unique('issue_teamId_number_uq').on(table.teamId, table.number),
		unique('issue_organizationId_identifier_uq').on(
			table.organizationId,
			table.identifier
		),
	]
)
