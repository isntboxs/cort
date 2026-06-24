import { orpcBaseContract as baseContract } from '#/orpc/contracts/base.contract'
import {
	workspaceCreateInputSchema,
	workspaceCreateOutputSchema,
} from '#/orpc/schemas/workspace.schema'

const workspaceCreate = baseContract
	.route({
		path: '/workspace/create',
		method: 'POST',
		summary: 'Create workspace',
		description: 'Create a workspace for an user.',
		tags: ['Workspace'],
		operationId: 'createWorkspace',
		successStatus: 200,
		successDescription: 'Workspace created',
	})
	.input(workspaceCreateInputSchema)
	.output(workspaceCreateOutputSchema)

export const workspaceContract = {
	create: workspaceCreate,
}
