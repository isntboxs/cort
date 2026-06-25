import { healthContract } from '#/orpc/contracts/health.contract'
import { todoContract } from '#/orpc/contracts/todo.contract'
import { workspaceContract } from '#/orpc/contracts/workspace.contract'

export const orpcContracts = {
	workspace: workspaceContract,
	health: healthContract,
	todo: todoContract,
} as const
