import { sql } from 'drizzle-orm'
import {
	index,
	pgTable,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core'

import { organizationTable, userTable } from '#/db/schemas/auth'
import { issueTable } from '#/db/schemas/issue'

export const issueCommentTable = pgTable(
	'issue_comment',
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
		authorId: uuid('author_id')
			.notNull()
			.references(() => userTable.id, { onDelete: 'cascade' }),
		body: text('body').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		deletedAt: timestamp('deleted_at'),
	},
	(table) => [
		index('issueComment_issueId_idx').on(table.issueId),
		index('issueComment_organizationId_idx').on(table.organizationId),
		index('issueComment_authorId_idx').on(table.authorId),
	]
)
