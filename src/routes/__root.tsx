import { TanStackDevtools } from '@tanstack/react-devtools'
import {
	ClientOnly,
	HeadContent,
	Scripts,
	createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { AppUpdateToast } from '#/components/providers/app-update-toast'
import { ThemeProvider } from '#/components/providers/theme-provider'
import { Toaster } from '#/components/ui/sonner'
import appCss from '#/styles.css?url'

export const Route = createRootRoute({
	head: () => {
		return {
			meta: [
				{
					charSet: 'utf-8',
				},
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1',
				},
				{
					title: 'TanStack Start Starter',
				},
			],
			links: [
				{
					rel: 'stylesheet',
					href: appCss,
				},
				{
					rel: 'manifest',
					href: '/manifest.webmanifest',
				},
			],
		}
	},
	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			className="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent scrollbar-gutter-stable selection:bg-primary selection:text-primary-foreground"
			suppressHydrationWarning
		>
			<head>
				<HeadContent />
			</head>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					disableTransitionOnChange
					storageKey="coret-ui-theme"
				>
					{children}
					<ClientOnly>
						<AppUpdateToast />
					</ClientOnly>
					<Toaster position="bottom-right" />
				</ThemeProvider>

				<TanStackDevtools
					config={{
						position: 'bottom-right',
					}}
					plugins={[
						{
							name: 'Tanstack Router',
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	)
}
