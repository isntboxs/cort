import type {
	InferRouterInputs,
	InferRouterOutputs,
	RouterClient,
} from '@orpc/server'

import { orpcBase } from '#/orpc/base'
import { healthRouter } from './health.router'
import { teamRouter } from './team.router'
import { workspaceRouter } from './workspace.router'

export const orpcRouters = orpcBase.router({
	workspace: workspaceRouter,
	team: teamRouter,
	health: healthRouter,
})

export type ORPCRouterClient = RouterClient<typeof orpcRouters>

export type RouterInputs = InferRouterInputs<typeof orpcRouters>
export type RouterOutputs = InferRouterOutputs<typeof orpcRouters>
