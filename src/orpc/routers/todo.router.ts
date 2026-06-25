import { asc, eq } from 'drizzle-orm'

import { todoTable } from '#/db/schemas'
import {
	createRealtimeEvent,
	publishRealtimeEvent,
} from '#/lib/realtime-events'
import { publicProcedure } from '#/orpc/procedures'
import type { Todo } from '#/orpc/schemas/todo.schema'

type TodoAction = 'created' | 'updated' | 'deleted'

const getFirstTodo = (todos: ReadonlyArray<Todo>) => todos.at(0)

const publishTodoChanged = (action: TodoAction, todo: Todo) => {
	publishRealtimeEvent(
		createRealtimeEvent('todo:changed', {
			action,
			todo,
		})
	)
}

const todoList = publicProcedure.todo.list.handler(async ({ context }) =>
	context.db.select().from(todoTable).orderBy(asc(todoTable.nama))
)

const todoCreate = publicProcedure.todo.create.handler(
	async ({ context, input }) => {
		const todos = await context.db
			.insert(todoTable)
			.values({ nama: input.nama })
			.returning()
		const todo = getFirstTodo(todos)

		if (!todo) {
			throw new Error('Todo gagal dibuat')
		}

		publishTodoChanged('created', todo)

		return todo
	}
)

const todoUpdate = publicProcedure.todo.update.handler(
	async ({ context, errors, input }) => {
		const values: { nama?: string; isComplete?: boolean } = {}

		if (input.nama !== undefined) {
			values.nama = input.nama
		}

		if (input.isComplete !== undefined) {
			values.isComplete = input.isComplete
		}

		const todos = await context.db
			.update(todoTable)
			.set(values)
			.where(eq(todoTable.id, input.id))
			.returning()
		const todo = getFirstTodo(todos)

		if (!todo) {
			throw errors.NOT_FOUND
		}

		publishTodoChanged('updated', todo)

		return todo
	}
)

const todoDelete = publicProcedure.todo.delete.handler(
	async ({ context, errors, input }) => {
		const todos = await context.db
			.delete(todoTable)
			.where(eq(todoTable.id, input.id))
			.returning()
		const todo = getFirstTodo(todos)

		if (!todo) {
			throw errors.NOT_FOUND
		}

		publishTodoChanged('deleted', todo)

		return todo
	}
)

export const todoRouter = {
	list: todoList,
	create: todoCreate,
	update: todoUpdate,
	delete: todoDelete,
}
