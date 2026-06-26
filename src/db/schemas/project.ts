import { sql } from 'drizzle-orm'
import {
	date,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	unique,
	uuid,
} from 'drizzle-orm/pg-core'

import { organizationTable, teamTable, userTable } from '#/db/schemas/auth'

export const projectStatusTable = pgTable(
	'project_status',
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
		position: integer('position').notNull().default(0),
		color: text('color'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index('projectStatus_organizationId_idx').on(table.organizationId),
		index('projectStatus_teamId_idx').on(table.teamId),
		unique('projectStatus_teamId_name_uq').on(table.teamId, table.name),
	]
)

export const projectTable = pgTable(
	'project',
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
		description: text('description'),
		statusId: uuid('status_id').references(() => projectStatusTable.id, {
			onDelete: 'set null',
		}),
		leadId: uuid('lead_id').references(() => userTable.id, {
			onDelete: 'set null',
		}),
		targetDate: date('target_date'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		archivedAt: timestamp('archived_at'),
	},
	(table) => [
		index('project_organizationId_idx').on(table.organizationId),
		index('project_teamId_idx').on(table.teamId),
		index('project_statusId_idx').on(table.statusId),
		index('project_leadId_idx').on(table.leadId),
	]
)
