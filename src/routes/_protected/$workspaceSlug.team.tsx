import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/$workspaceSlug/team')({
	component: RouteComponent,
})

function RouteComponent() {
	return <Outlet />
}
