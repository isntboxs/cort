import { orpcBaseContract as baseContract } from '#/orpc/contracts/base.contract'
import {
	todoCreateInputSchema,
	todoDeleteInputSchema,
	todoListOutputSchema,
	todoSchema,
	todoUpdateInputSchema,
} from '#/orpc/schemas/todo.schema'

const todoList = baseContract
	.route({
		path: '/todo/list',
		method: 'GET',
		summary: 'List todos',
		description: 'Get all todos.',
		tags: ['Todo'],
		operationId: 'listTodos',
		successStatus: 200,
		successDescription: 'Todos listed',
	})
	.output(todoListOutputSchema)

const todoCreate = baseContract
	.route({
		path: '/todo/create',
		method: 'POST',
		summary: 'Create todo',
		description: 'Create a todo.',
		tags: ['Todo'],
		operationId: 'createTodo',
		successStatus: 201,
		successDescription: 'Todo created',
	})
	.input(todoCreateInputSchema)
	.output(todoSchema)

const todoUpdate = baseContract
	.route({
		path: '/todo/update',
		method: 'PATCH',
		summary: 'Update todo',
		description: 'Update todo fields.',
		tags: ['Todo'],
		operationId: 'updateTodo',
		successStatus: 200,
		successDescription: 'Todo updated',
	})
	.input(todoUpdateInputSchema)
	.output(todoSchema)

const todoDelete = baseContract
	.route({
		path: '/todo/delete',
		method: 'DELETE',
		summary: 'Delete todo',
		description: 'Delete a todo.',
		tags: ['Todo'],
		operationId: 'deleteTodo',
		successStatus: 200,
		successDescription: 'Todo deleted',
	})
	.input(todoDeleteInputSchema)
	.output(todoSchema)

export const todoContract = {
	list: todoList,
	create: todoCreate,
	update: todoUpdate,
	delete: todoDelete,
}
