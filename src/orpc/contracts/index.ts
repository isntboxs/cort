import { healthContract } from '#/orpc/contracts/health.contract'
import { teamContract } from '#/orpc/contracts/team.contract'
import { workspaceContract } from '#/orpc/contracts/workspace.contract'

export const orpcContracts = {
	workspace: workspaceContract,
	team: teamContract,
	health: healthContract,
} as const
