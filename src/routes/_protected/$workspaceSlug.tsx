import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { getFullWorkspaceQueryOptions } from '#/features/workspace/api'

export const Route = createFileRoute('/_protected/$workspaceSlug')({
	loader: async ({ context, params, location }) => {
		if (location.pathname.includes(`/team`)) return

		const { auth, queryClient } = context

		if (!auth) return

		const workspace = await queryClient.ensureQueryData(
			getFullWorkspaceQueryOptions({
				workspaceSlug: params.workspaceSlug,
			})
		)

		const team = workspace.teams.find((t) => t.id === auth.session.activeTeamId)

		if (!team) {
			throw redirect({
				to: '/$workspaceSlug/team/$teamKey',
				params: {
					workspaceSlug: workspace.slug,
					teamKey: workspace.teams[0].key,
				},
				replace: true,
				viewTransition: true,
			})
		}

		throw redirect({
			to: '/$workspaceSlug/team/$teamKey',
			params: {
				workspaceSlug: workspace.slug,
				teamKey: team.key,
			},
			replace: true,
			viewTransition: true,
		})
	},
	component: RouteComponent,
})

function RouteComponent() {
	return <Outlet />
}
