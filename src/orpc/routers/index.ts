import type {
	InferRouterInputs,
	InferRouterOutputs,
	RouterClient,
} from '@orpc/server'

import { orpcBase } from '#/orpc/base'
import { healthRouter } from './health.router'
import { todoRouter } from './todo.router'
import { workspaceRouter } from './workspace.router'

export const orpcRouters = orpcBase.router({
	workspace: workspaceRouter,
	health: healthRouter,
	todo: todoRouter,
})

export type ORPCRouterClient = RouterClient<typeof orpcRouters>

export type RouterInputs = InferRouterInputs<typeof orpcRouters>
export type RouterOutputs = InferRouterOutputs<typeof orpcRouters>
