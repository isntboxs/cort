import { createFileRoute } from '@tanstack/react-router'

import { LogoIcon } from '#/components/logo'
import { env } from '#/env'
import { CreateWorkspaceForm } from '#/features/workspace/components/create-workspace-form'

export const Route = createFileRoute('/_protected/join')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<main className="relative flex min-h-svh items-center justify-center">
			<div className="absolute top-6 left-6 flex items-center gap-2">
				<LogoIcon className="size-6" />
				<span className="text-lg font-bold">{env.VITE_APP_NAME}</span>
			</div>

			<CreateWorkspaceForm />
		</main>
	)
}
