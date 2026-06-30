import { auth } from '#/lib/auth'
import { protectedProcedure } from '#/orpc/procedures'
import {
	applyBetterAuthResponseHeaders,
	withBetterAuthErrorHandling,
} from '#/orpc/utils'

const teamCreate = protectedProcedure.team.create.handler(
	async ({ context, input }) => {
		const { headers, response } = await withBetterAuthErrorHandling(() =>
			auth.api.createTeam({
				headers: context.headers,
				body: {
					name: input.name,
					key: input.key,
					organizationId: input.workspaceId,
				},
				returnHeaders: true,
			})
		)

		applyBetterAuthResponseHeaders(headers, context)

		return {
			...response,
			workspaceId: response.organizationId,
		}
	}
)

export const teamRouter = {
	create: teamCreate,
}
