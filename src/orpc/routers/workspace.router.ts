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

export const workspaceRouter = {
	create: workspaceCreate,
}
