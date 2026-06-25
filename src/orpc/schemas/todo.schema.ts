import { z } from 'zod'

export const todoSchema = z.object({
	id: z.uuid(),
	nama: z.string(),
	isComplete: z.boolean(),
})

export const todoCreateInputSchema = z.object({
	nama: z.string().trim().min(1, 'Nama todo wajib diisi').max(120),
})

export const todoUpdateInputSchema = z
	.object({
		id: z.uuid(),
		nama: z.string().trim().min(1).max(120).optional(),
		isComplete: z.boolean().optional(),
	})
	.refine(
		(input) => input.nama !== undefined || input.isComplete !== undefined,
		{
			message: 'Minimal satu field harus diubah',
		}
	)

export const todoDeleteInputSchema = z.object({
	id: z.uuid(),
})

export const todoListOutputSchema = z.array(todoSchema)

export type Todo = z.infer<typeof todoSchema>
