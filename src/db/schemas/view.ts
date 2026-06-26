import { sql } from 'drizzle-orm'
import {
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'

import { organizationTable, teamTable, userTable } from '#/db/schemas/auth'

export const savedViewVisibilityEnum = pgEnum('saved_view_visibility', [
	'private',
	'shared',
])

export const savedViewTable = pgTable(
	'saved_view',
	{
		id: uuid('id')
			.default(sql`pg_catalog.gen_random_uuid()`)
			.primaryKey(),
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizationTable.id, { onDelete: 'cascade' }),
		teamId: uuid('team_id').references(() => teamTable.id, {
			onDelete: 'cascade',
		}),
		ownerId: uuid('owner_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		name: text('name').notNull(),
		visibility: savedViewVisibilityEnum('visibility')
			.default('private')
			.notNull(),
		filters: jsonb('filters').notNull().default(sql`'{}'::jsonb`),
		sort: jsonb('sort'),
		groupBy: text('group_by'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index('savedView_organizationId_idx').on(table.organizationId),
		index('savedView_teamId_idx').on(table.teamId),
		index('savedView_ownerId_idx').on(table.ownerId),
	]
)
