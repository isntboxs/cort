import limax from 'limax'
import { z } from 'zod'

const workspaceBaseField = {
	id: z.uuid(),
	name: z.string(),
	slug: z.string(),
	logo: z.string().nullable().optional(),
	metadata: z.unknown(),
	createdAt: z.date(),
}

export const workspaceMemberBaseSchema = z.object({
	id: z.uuid(),
	workspaceId: z.uuid(),
	userId: z.uuid(),
	role: z.string(),
	createdAt: z.date(),
})

export const workspaceCreateInputSchema = z.object({
	name: z
		.string()
		.nonempty({ error: 'Name is required' })
		.min(3, { error: 'Name must be at least 3 characters long' })
		.max(100, { error: 'Name must be at most 100 characters long' }),
	slug: z
		.string()
		.trim()
		.min(1, { error: 'Slug is required' })
		.transform((value) => limax(value))
		.pipe(z.string().min(1, { error: 'Slug must contain usable characters' })),
	logo: z.string().nullable().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	keepCurrentActiveWorkspace: z.boolean().optional(),
})

export const workspaceCreateOutputSchema = z.object({
	...workspaceBaseField,
	members: z.array(workspaceMemberBaseSchema),
})

export const workspaceGetFullInputSchema = z
	.object({
		workspaceId: z.uuid().optional(),
		workspaceSlug: z.string().optional(),
		membersLimit: z.string().or(z.number()).optional(),
	})
	.optional()

export type WorkspaceGetFullInput = z.infer<typeof workspaceGetFullInputSchema>

export const workspaceGetFullOutputSchema = z.object({
	...workspaceBaseField,
	metadata: z.unknown().optional(),
	invitations: z.array(
		z.object({
			id: z.uuid(),
			workspaceId: z.uuid(),
			email: z.email(),
			role: z.enum(['owner', 'member', 'admin']),
			status: z.enum(['canceled', 'pending', 'accepted', 'rejected']),
			inviterId: z.uuid(),
			expiresAt: z.date(),
			createdAt: z.date(),
			teamId: z.uuid().optional(),
		})
	),
	members: z.array(
		workspaceMemberBaseSchema.omit({ role: true }).extend({
			role: z.enum(['owner', 'member', 'admin']),
			teamId: z.uuid().optional(),
			user: z.object({
				id: z.uuid(),
				email: z.string(),
				name: z.string(),
				image: z.string().optional(),
			}),
		})
	),
	teams: z.array(
		z.object({
			id: z.uuid(),
			workspaceId: z.uuid(),
			name: z.string(),
			teamKey: z.string(),
			createdAt: z.date(),
			updatedAt: z.date().optional(),
		})
	),
})

export const workspaceListOutputSchema = z.array(
	z
		.object(workspaceBaseField)
		.omit({ metadata: true })
		.extend({ metadata: z.unknown().optional() })
)
