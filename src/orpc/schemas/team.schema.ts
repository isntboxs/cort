import { z } from 'zod'

const teamBaseField = {
	id: z.uuid(),
	name: z.string(),
	key: z.string(),
	workspaceId: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date().optional(),
}

export const teamCreateInputSchema = z.object({
	name: z
		.string()
		.nonempty({ error: 'Name is required' })
		.min(2, { error: 'Name must be at least 2 characters long' })
		.max(100, { error: 'Name must be at most 100 characters long' }),
	key: z
		.string()
		.trim()
		.min(1, { error: 'Team key is required' })
		.max(10, { error: 'Team key must be at most 10 characters long' }),
	workspaceId: z.uuid(),
})

export const teamCreateOutputSchema = z.object({
	...teamBaseField,
})
