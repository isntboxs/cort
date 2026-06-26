import { relations } from 'drizzle-orm'

import {
	accountTable,
	invitationTable,
	memberTable,
	organizationTable,
	sessionTable,
	teamMemberTable,
	teamTable,
	userTable,
} from '#/db/schemas/auth'
import { issueActivityTable } from '#/db/schemas/activity'
import { issueCommentTable } from '#/db/schemas/comment'
import { issueTable } from '#/db/schemas/issue'
import { issueLabelTable, labelTable } from '#/db/schemas/label'
import { priorityTable } from '#/db/schemas/priority'
import { projectStatusTable, projectTable } from '#/db/schemas/project'
import { issueStatusTable } from '#/db/schemas/status'
import { savedViewTable } from '#/db/schemas/view'

export const userRelations = relations(userTable, ({ many }) => {
	return {
		sessions: many(sessionTable),
		accounts: many(accountTable),
		teamMembers: many(teamMemberTable),
		members: many(memberTable),
		invitations: many(invitationTable),
		assignedIssues: many(issueTable, { relationName: 'assignee' }),
		createdIssues: many(issueTable, { relationName: 'creator' }),
		comments: many(issueCommentTable),
		activities: many(issueActivityTable),
		leadProjects: many(projectTable, { relationName: 'lead' }),
		savedViews: many(savedViewTable),
	}
})

export const sessionRelations = relations(sessionTable, ({ one }) => {
	return {
		user: one(userTable, {
			fields: [sessionTable.userId],
			references: [userTable.id],
		}),
	}
})

export const accountRelations = relations(accountTable, ({ one }) => {
	return {
		user: one(userTable, {
			fields: [accountTable.userId],
			references: [userTable.id],
		}),
	}
})

export const organizationRelations = relations(
	organizationTable,
	({ many }) => {
		return {
			teams: many(teamTable),
			members: many(memberTable),
			invitations: many(invitationTable),
			issues: many(issueTable),
			issueStatuses: many(issueStatusTable),
			priorities: many(priorityTable),
			labels: many(labelTable),
			projects: many(projectTable),
			projectStatuses: many(projectStatusTable),
			issueComments: many(issueCommentTable),
			issueActivities: many(issueActivityTable),
			savedViews: many(savedViewTable),
		}
	}
)

export const teamRelations = relations(teamTable, ({ one, many }) => {
	return {
		organization: one(organizationTable, {
			fields: [teamTable.organizationId],
			references: [organizationTable.id],
		}),
		teamMembers: many(teamMemberTable),
		issues: many(issueTable),
		issueStatuses: many(issueStatusTable),
		priorities: many(priorityTable),
		labels: many(labelTable),
		projects: many(projectTable),
		projectStatuses: many(projectStatusTable),
		savedViews: many(savedViewTable),
	}
})

export const teamMemberRelations = relations(teamMemberTable, ({ one }) => {
	return {
		team: one(teamTable, {
			fields: [teamMemberTable.teamId],
			references: [teamTable.id],
		}),
		user: one(userTable, {
			fields: [teamMemberTable.userId],
			references: [userTable.id],
		}),
	}
})

export const memberRelations = relations(memberTable, ({ one }) => {
	return {
		organization: one(organizationTable, {
			fields: [memberTable.organizationId],
			references: [organizationTable.id],
		}),
		user: one(userTable, {
			fields: [memberTable.userId],
			references: [userTable.id],
		}),
	}
})

export const invitationRelations = relations(invitationTable, ({ one }) => {
	return {
		organization: one(organizationTable, {
			fields: [invitationTable.organizationId],
			references: [organizationTable.id],
		}),
		user: one(userTable, {
			fields: [invitationTable.inviterId],
			references: [userTable.id],
		}),
	}
})

export const issueStatusRelations = relations(
	issueStatusTable,
	({ one, many }) => {
		return {
			organization: one(organizationTable, {
				fields: [issueStatusTable.organizationId],
				references: [organizationTable.id],
			}),
			team: one(teamTable, {
				fields: [issueStatusTable.teamId],
				references: [teamTable.id],
			}),
			issues: many(issueTable),
		}
	}
)

export const priorityRelations = relations(
	priorityTable,
	({ one, many }) => {
		return {
			organization: one(organizationTable, {
				fields: [priorityTable.organizationId],
				references: [organizationTable.id],
			}),
			team: one(teamTable, {
				fields: [priorityTable.teamId],
				references: [teamTable.id],
			}),
			issues: many(issueTable),
		}
	}
)

export const projectStatusRelations = relations(
	projectStatusTable,
	({ one, many }) => {
		return {
			organization: one(organizationTable, {
				fields: [projectStatusTable.organizationId],
				references: [organizationTable.id],
			}),
			team: one(teamTable, {
				fields: [projectStatusTable.teamId],
				references: [teamTable.id],
			}),
			projects: many(projectTable),
		}
	}
)

export const projectRelations = relations(projectTable, ({ one, many }) => {
	return {
		organization: one(organizationTable, {
			fields: [projectTable.organizationId],
			references: [organizationTable.id],
		}),
		team: one(teamTable, {
			fields: [projectTable.teamId],
			references: [teamTable.id],
		}),
		status: one(projectStatusTable, {
			fields: [projectTable.statusId],
			references: [projectStatusTable.id],
		}),
		lead: one(userTable, {
			fields: [projectTable.leadId],
			references: [userTable.id],
			relationName: 'lead',
		}),
		issues: many(issueTable),
	}
})

export const labelRelations = relations(labelTable, ({ one, many }) => {
	return {
		organization: one(organizationTable, {
			fields: [labelTable.organizationId],
			references: [organizationTable.id],
		}),
		team: one(teamTable, {
			fields: [labelTable.teamId],
			references: [teamTable.id],
		}),
		issueLabels: many(issueLabelTable),
	}
})

export const issueLabelRelations = relations(issueLabelTable, ({ one }) => {
	return {
		issue: one(issueTable, {
			fields: [issueLabelTable.issueId],
			references: [issueTable.id],
		}),
		label: one(labelTable, {
			fields: [issueLabelTable.labelId],
			references: [labelTable.id],
		}),
	}
})

export const issueRelations = relations(issueTable, ({ one, many }) => {
	return {
		organization: one(organizationTable, {
			fields: [issueTable.organizationId],
			references: [organizationTable.id],
		}),
		team: one(teamTable, {
			fields: [issueTable.teamId],
			references: [teamTable.id],
		}),
		project: one(projectTable, {
			fields: [issueTable.projectId],
			references: [projectTable.id],
		}),
		status: one(issueStatusTable, {
			fields: [issueTable.statusId],
			references: [issueStatusTable.id],
		}),
		priority: one(priorityTable, {
			fields: [issueTable.priorityId],
			references: [priorityTable.id],
		}),
		assignee: one(userTable, {
			fields: [issueTable.assigneeId],
			references: [userTable.id],
			relationName: 'assignee',
		}),
		creator: one(userTable, {
			fields: [issueTable.creatorId],
			references: [userTable.id],
			relationName: 'creator',
		}),
		comments: many(issueCommentTable),
		activities: many(issueActivityTable),
		issueLabels: many(issueLabelTable),
	}
})

export const issueCommentRelations = relations(
	issueCommentTable,
	({ one }) => {
		return {
			issue: one(issueTable, {
				fields: [issueCommentTable.issueId],
				references: [issueTable.id],
			}),
			organization: one(organizationTable, {
				fields: [issueCommentTable.organizationId],
				references: [organizationTable.id],
			}),
			author: one(userTable, {
				fields: [issueCommentTable.authorId],
				references: [userTable.id],
			}),
		}
	}
)

export const issueActivityRelations = relations(
	issueActivityTable,
	({ one }) => {
		return {
			issue: one(issueTable, {
				fields: [issueActivityTable.issueId],
				references: [issueTable.id],
			}),
			organization: one(organizationTable, {
				fields: [issueActivityTable.organizationId],
				references: [organizationTable.id],
			}),
			actor: one(userTable, {
				fields: [issueActivityTable.actorId],
				references: [userTable.id],
			}),
		}
	}
)

export const savedViewRelations = relations(savedViewTable, ({ one }) => {
	return {
		organization: one(organizationTable, {
			fields: [savedViewTable.organizationId],
			references: [organizationTable.id],
		}),
		team: one(teamTable, {
			fields: [savedViewTable.teamId],
			references: [teamTable.id],
		}),
		owner: one(userTable, {
			fields: [savedViewTable.ownerId],
			references: [userTable.id],
		}),
	}
})
