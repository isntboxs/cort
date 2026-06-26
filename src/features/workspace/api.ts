import { useSuspenseQuery } from '@tanstack/react-query'

import { useMemo } from 'react'

import { workspaceORPC } from '#/orpc/client'
import type { WorkspaceGetFullInput } from '#/orpc/schemas/workspace.schema'

export const getFullWorkspaceQueryOptions = (input: WorkspaceGetFullInput) =>
	workspaceORPC.getFull.queryOptions({ input })

export const useGetFullWorkspace = (input: WorkspaceGetFullInput) => {
	const options = useMemo(() => getFullWorkspaceQueryOptions(input), [input])

	return useSuspenseQuery(options)
}

export const listWorkspacesQueryOptions = () =>
	workspaceORPC.list.queryOptions()

export const useListWorkspaces = () =>
	useSuspenseQuery(listWorkspacesQueryOptions())
