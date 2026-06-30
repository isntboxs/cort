import { orpcBaseContract as baseContract } from '#/orpc/contracts/base.contract'
import {
	teamCreateInputSchema,
	teamCreateOutputSchema,
} from '#/orpc/schemas/team.schema'

const teamCreate = baseContract
	.route({
		path: '/team/create',
		method: 'POST',
		summary: 'Create team',
		description: 'Create a team within a workspace.',
		tags: ['Team'],
		operationId: 'createTeam',
		successStatus: 200,
		successDescription: 'Team created',
	})
	.input(teamCreateInputSchema)
	.output(teamCreateOutputSchema)

export const teamContract = {
	create: teamCreate,
}
