import { auth } from '#/lib/auth'
import { protectedProcedure } from '#/orpc/procedures'
import {
	applyBetterAuthResponseHeaders,
	withBetterAuthErrorHandling,
} from '#/orpc/utils'

const workspaceCreate = protectedProcedure.workspace.create.handler(
	async ({ context, input }) => {
		const { headers, response } = await withBetterAuthErrorHandling(() =>
			auth.api.createOrganization({
				headers: context.headers,
				body: {
					name: input.name,
					slug: input.slug,
					logo: input.logo,
					metadata: input.metadata,
					keepCurrentActiveOrganization: input.keepCurrentActiveWorkspace,
				},
				returnHeaders: true,
			})
		)

		applyBetterAuthResponseHeaders(headers, context)

		return {
			...response,
			members: response.members.flatMap((member) => {
				if (!member) return []

				return [
					{
						...member,
						workspaceId: member.organizationId,
					},
				]
			}),
		}
	}
)

const workspaceGetFull = protectedProcedure.workspace.getFull.handler(
	async ({ context, errors, input }) => {
		const { headers, response } = await withBetterAuthErrorHandling(() =>
			auth.api.getFullOrganization({
				headers: context.headers,
				query: {
					organizationId: input?.workspaceId,
					organizationSlug: input?.workspaceSlug,
					membersLimit: input?.membersLimit,
				},
				returnHeaders: true,
			})
		)

		applyBetterAuthResponseHeaders(headers, context)

		if (!response) {
			throw errors.NOT_FOUND()
		}

		return {
			...response,
			invitations: response.invitations.map((invitation) => {
				return {
					...invitation,
					workspaceId: invitation.organizationId,
				}
			}),
			members: response.members.map((member) => {
				return {
					...member,
					workspaceId: member.organizationId,
				}
			}),
			teams: response.teams.map((team) => {
				return {
					...team,
					workspaceId: team.organizationId,
				}
			}),
		}
	}
)

const workspaceList = protectedProcedure.workspace.list.handler(
	async ({ context }) => {
		const { headers, response } = await withBetterAuthErrorHandling(() =>
			auth.api.listOrganizations({
				headers: context.headers,
				returnHeaders: true,
			})
		)

		applyBetterAuthResponseHeaders(headers, context)

		return response
	}
)

export const workspaceRouter = {
	create: workspaceCreate,
	getFull: workspaceGetFull,
	list: workspaceList,
}
