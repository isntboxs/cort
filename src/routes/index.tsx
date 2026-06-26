import { createFileRoute, redirect } from '@tanstack/react-router'

import {
	getFullWorkspaceQueryOptions,
	listWorkspacesQueryOptions,
} from '#/features/workspace/api'

export const Route = createFileRoute('/')({
	beforeLoad: async ({ context: { auth, queryClient } }) => {
		if (auth) {
			const workspaces = await queryClient.ensureQueryData(
				listWorkspacesQueryOptions()
			)

			if (!auth.session.activeOrganizationId || workspaces.length === 0) {
				throw redirect({
					to: '/join',
				})
			}

			const workspace = await queryClient.ensureQueryData(
				getFullWorkspaceQueryOptions({
					workspaceId: auth.session.activeOrganizationId,
				})
			)

			console.debug('matched workspace', {
				activeWorkspace: auth.session.activeOrganizationId,
				workspace: workspace.id,
			})
		}
	},
	component: Home,
})

function Home() {
	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
			<p className="mt-4 text-lg">
				Edit <code>src/routes/index.tsx</code> to get started.
			</p>
		</div>
	)
}
