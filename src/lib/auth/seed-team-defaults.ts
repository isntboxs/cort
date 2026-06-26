import '@tanstack/react-start/server-only'

import { db } from '#/db'
import { labelTable } from '#/db/schemas/label'
import { priorityTable } from '#/db/schemas/priority'
import { projectStatusTable } from '#/db/schemas/project'
import { issueStatusTable } from '#/db/schemas/status'

const defaultIssueStatuses = [
	{ name: 'Backlog', type: 'backlog' as const, position: 0, color: '#8e8e93' },
	{ name: 'Todo', type: 'todo' as const, position: 1, color: '#6e56cf' },
	{
		name: 'In Progress',
		type: 'in_progress' as const,
		position: 2,
		color: '#f2c94c',
	},
	{
		name: 'In Review',
		type: 'in_review' as const,
		position: 3,
		color: '#4cb782',
	},
	{ name: 'Done', type: 'done' as const, position: 4, color: '#4cb782' },
	{
		name: 'Canceled',
		type: 'canceled' as const,
		position: 5,
		color: '#e5484d',
	},
]

const defaultPriorities = [
	{ name: 'No Priority', position: 0, color: '#8e8e93' },
	{ name: 'Urgent', position: 1, color: '#e5484d' },
	{ name: 'High', position: 2, color: '#f2c94c' },
	{ name: 'Medium', position: 3, color: '#4cb782' },
	{ name: 'Low', position: 4, color: '#6e56cf' },
]

const defaultLabels = [
	{ name: 'Bug', color: '#e5484d' },
	{ name: 'Feature', color: '#6e56cf' },
	{ name: 'Improvement', color: '#4cb782' },
]

const defaultProjectStatuses = [
	{ name: 'Planned', position: 0, color: '#8e8e93' },
	{ name: 'In Progress', position: 1, color: '#f2c94c' },
	{ name: 'Completed', position: 2, color: '#4cb782' },
	{ name: 'Canceled', position: 3, color: '#e5484d' },
]

export async function seedTeamDefaults(
	organizationId: string,
	teamId: string
) {
	await db.transaction(async (tx) => {
		await tx.insert(issueStatusTable).values(
			defaultIssueStatuses.map((status) => {
				return {
					organizationId,
					teamId,
					name: status.name,
					type: status.type,
					position: status.position,
					color: status.color,
				}
			})
		)

		await tx.insert(priorityTable).values(
			defaultPriorities.map((priority) => {
				return {
					organizationId,
					teamId,
					name: priority.name,
					position: priority.position,
					color: priority.color,
				}
			})
		)

		await tx.insert(labelTable).values(
			defaultLabels.map((label) => {
				return {
					organizationId,
					teamId,
					name: label.name,
					color: label.color,
				}
			})
		)

		await tx.insert(projectStatusTable).values(
			defaultProjectStatuses.map((status) => {
				return {
					organizationId,
					teamId,
					name: status.name,
					position: status.position,
					color: status.color,
				}
			})
		)
	})
}
