import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'

import { useRef } from 'react'

import limax from 'limax'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '#/components/ui/card'
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '#/components/ui/input-group'
import { Spinner } from '#/components/ui/spinner'
import { env } from '#/env'
import { workspaceORPC } from '#/orpc/client'
import { workspaceCreateInputSchema } from '#/orpc/schemas/workspace.schema'

const formSchema = workspaceCreateInputSchema

export const CreateWorkspaceForm = () => {
	const router = useRouter()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const userEditedSlugRef = useRef(false)

	const createWorkspaceMutation = useMutation(
		workspaceORPC.create.mutationOptions({
			onSuccess: async (data) => {
				await queryClient.invalidateQueries()
				await router.invalidate({ sync: true })
				await navigate({
					to: '/$workspaceSlug',
					params: {
						workspaceSlug: data.slug,
					},
					viewTransition: true,
				})
			},
			onError: (error) => {
				toast.error('Failed to create workspace. Please try again later.', {
					description: error.message,
				})
			},
		})
	)

	const form = useForm({
		defaultValues: {
			name: '',
			slug: '',
		},
		validators: {
			onChange: formSchema,
			onSubmit: formSchema,
		},
		onSubmit: async ({ value }) => {
			await createWorkspaceMutation.mutateAsync(value)
		},
	})

	return (
		<Card className="mx-auto w-full max-w-md gap-8 bg-transparent ring-0">
			<CardHeader className="gap-2 text-center">
				<CardTitle className="text-2xl font-semibold">
					Create a workspace
				</CardTitle>

				<CardDescription className="text-base text-muted-foreground">
					Move forward across teams.
				</CardDescription>
			</CardHeader>

			<CardContent>
				<form
					id="create-workspace-form"
					onSubmit={(e) => {
						e.preventDefault()
						e.stopPropagation()
						void form.handleSubmit()
					}}
				>
					<FieldGroup>
						<form.Field
							name="name"
							listeners={{
								onChange: ({ value }) => {
									if (userEditedSlugRef.current) return
									form.setFieldValue('slug', limax(value))
								},
							}}
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Name</FieldLabel>

										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => {
												field.handleChange(e.target.value)
											}}
											aria-invalid={isInvalid}
											placeholder="Acme Product"
											autoComplete="organization"
										/>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								)
							}}
						/>

						<form.Field
							name="slug"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched && !field.state.meta.isValid
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>URL</FieldLabel>

										<InputGroup className="border-l-0">
											<InputGroupAddon className="rounded-l-lg border-r border-border bg-muted pr-1.5">
												<InputGroupText>{env.VITE_APP_URL}/</InputGroupText>
											</InputGroupAddon>

											<InputGroupInput
												id={field.name}
												name={field.name}
												value={field.state.value}
												onBlur={(e) => {
													field.handleChange(limax(e.target.value))
													field.handleBlur()
												}}
												onChange={(e) => {
													userEditedSlugRef.current = true
													field.handleChange(e.target.value)
												}}
												aria-invalid={isInvalid}
												placeholder="acme-product"
												autoComplete="off"
												className="pl-0.5"
											/>
										</InputGroup>

										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								)
							}}
						/>
					</FieldGroup>
				</form>
			</CardContent>

			<CardFooter className="border-0 bg-transparent">
				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => {
						const isPending = isSubmitting
							? true
							: createWorkspaceMutation.isPending

						return (
							<Button
								form="create-workspace-form"
								type="submit"
								className="w-full"
								size="lg"
								disabled={!canSubmit || isPending}
							>
								{isPending ? <Spinner data-icon="inline-start" /> : null}
								Create Workspace
							</Button>
						)
					}}
				/>
			</CardFooter>
		</Card>
	)
}
