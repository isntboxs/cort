import limax from 'limax'
import { z } from 'zod'

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
	id: z.uuid(),
	name: z.string(),
	slug: z.string(),
	logo: z.string().nullable().optional(),
	metadata: z.unknown(),
	createdAt: z.date(),
	members: z.array(
		z.object({
			id: z.uuid(),
			organizationId: z.uuid(),
			workspaceId: z.uuid(),
			userId: z.uuid(),
			role: z.string(),
			createdAt: z.date(),
		})
	),
})

export type WorkspaceCreateOutput = z.infer<typeof workspaceCreateOutputSchema>
