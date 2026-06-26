import { createFileRoute, Link, redirect } from '@tanstack/react-router'

import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'

import { IconChevronLeft } from '@tabler/icons-react'
import Github from '@thesvg/react/github'
import { toast } from 'sonner'
import { z } from 'zod'
import type { SvgIconProps } from '@thesvg/react'

import { LogoIcon } from '#/components/logo'
import { Button, buttonVariants } from '#/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '#/components/ui/card'
import { Spinner } from '#/components/ui/spinner'
import { env } from '#/env'
import { authClient } from '#/lib/auth/client'
import { cn } from '#/lib/utils'

interface OAuthButtonProps {
	provider: 'github'
	icon: ComponentType<SvgIconProps>
	label: string
	onClick: (provider: OAuthButtonProps['provider']) => Promise<void>
}

const loginSearchSchema = z.object({
	callbackURL: z.string().optional(),
})

export const Route = createFileRoute('/login')({
	validateSearch: loginSearchSchema,
	beforeLoad: ({ context: { auth }, search }) => {
		if (auth) {
			throw redirect({
				to: search.callbackURL ?? '/',
				replace: true,
				viewTransition: true,
			})
		}
	},
	component: RouteComponent,
})

function RouteComponent() {
	const [loadingProvider, setLoadingProvider] = useState<
		OAuthButtonProps['provider'] | null
	>(null)

	const { callbackURL } = Route.useSearch()

	const handleSignIn = async (provider: OAuthButtonProps['provider']) => {
		await authClient.signIn.social({
			provider,
			callbackURL,
			newUserCallbackURL: '/join',
			fetchOptions: {
				onRequest: () => {
					setLoadingProvider(provider)
				},
				onSuccess: () => {
					setLoadingProvider(null)
				},
				onError: (ctx) => {
					setLoadingProvider(null)
					toast.error(ctx.error.message)
				},
			},
		})
	}

	const oAuthButtons = useMemo<Array<OAuthButtonProps>>(
		() => [
			{
				provider: 'github',
				icon: Github,
				label: 'Continue with GitHub',
				onClick: handleSignIn,
			},
		],
		// oxlint-disable-next-line react-hooks/exhaustive-deps
		[]
	)

	return (
		<main className="flex h-svh items-center justify-center">
			<Link
				to="/"
				className={cn(
					buttonVariants({ variant: 'ghost', size: 'lg' }),
					'absolute top-7 left-5'
				)}
				viewTransition
			>
				<IconChevronLeft />
				Back
			</Link>

			<Card className="w-full max-w-sm gap-8 bg-transparent ring-0">
				<CardHeader>
					<LogoIcon className="mb-6 size-8" />

					<CardTitle className="text-2xl font-bold tracking-wide">
						Get started with {env.VITE_APP_NAME}
					</CardTitle>

					<CardDescription className="text-base text-muted-foreground">
						Sign in or create your {env.VITE_APP_NAME} account to continue.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div className="flex flex-col gap-4">
						{oAuthButtons.map((button) => (
							<Button
								key={button.provider}
								size="lg"
								className="w-full"
								onClick={() => button.onClick(button.provider)}
								disabled={loadingProvider === button.provider}
							>
								{loadingProvider === button.provider ? (
									<Spinner data-icon="inline-start" />
								) : (
									<button.icon data-icon="inline-start" />
								)}
								{button.label}
							</Button>
						))}
					</div>
				</CardContent>

				<CardFooter className="border-0 bg-transparent text-center">
					<p className="text-xs text-muted-foreground">
						By clicking continue, you agree to our{' '}
						<Link
							to="."
							className="underline underline-offset-4 hover:text-primary"
						>
							Terms of Service
						</Link>{' '}
						and{' '}
						<Link
							to="."
							className="underline underline-offset-4 hover:text-primary"
						>
							Privacy Policy
						</Link>
						.
					</p>
				</CardFooter>
			</Card>
		</main>
	)
}
