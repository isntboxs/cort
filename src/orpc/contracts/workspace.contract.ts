import { orpcBaseContract as baseContract } from '#/orpc/contracts/base.contract'
import {
	workspaceCreateInputSchema,
	workspaceCreateOutputSchema,
	workspaceGetFullInputSchema,
	workspaceGetFullOutputSchema,
	workspaceListOutputSchema,
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

const workspaceGetFull = baseContract
	.route({
		path: '/workspace/get-full',
		method: 'GET',
		summary: 'Get full workspace',
		description: 'Get a workspace for an user.',
		tags: ['Workspace'],
		operationId: 'getFullWorkspace',
		successStatus: 200,
		successDescription: 'Workspace get full',
	})
	.input(workspaceGetFullInputSchema)
	.output(workspaceGetFullOutputSchema)

const workspaceList = baseContract
	.route({
		path: '/workspace/list',
		method: 'GET',
		summary: 'List workspaces',
		description: 'List workspaces for an user.',
		tags: ['Workspace'],
		operationId: 'listWorkspaces',
		successStatus: 200,
		successDescription: 'Workspace list',
	})
	.output(workspaceListOutputSchema)

export const workspaceContract = {
	create: workspaceCreate,
	getFull: workspaceGetFull,
	list: workspaceList,
}
