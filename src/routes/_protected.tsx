import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
	beforeLoad: ({ context: { auth }, location }) => {
		if (!auth) {
			throw redirect({
				to: '/login',
				search: {
					callbackURL: location.pathname,
				},
			})
		}

		return { auth }
	},
	component: () => <Outlet />,
})
