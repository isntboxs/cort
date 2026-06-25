import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import * as React from 'react'

import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '#/components/ui/card'
import { Checkbox } from '#/components/ui/checkbox'
import { Input } from '#/components/ui/input'
import { useRealtime } from '#/lib/realtime'
import type { RealtimeEvent } from '#/lib/realtime'
import { cn } from '#/lib/utils'
import { orpc } from '#/orpc/client'
import type { Todo } from '#/orpc/schemas/todo.schema'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
	const [events, setEvents] = React.useState<Array<RealtimeEvent>>([])
	const [nama, setNama] = React.useState('')
	const queryClient = useQueryClient()
	const todoListQuery = useQuery(orpc.todo.list.queryOptions())
	const invalidateTodos = () =>
		queryClient.invalidateQueries({ queryKey: orpc.todo.key() })
	const createTodoMutation = useMutation(
		orpc.todo.create.mutationOptions({ onSuccess: invalidateTodos })
	)
	const updateTodoMutation = useMutation(
		orpc.todo.update.mutationOptions({ onSuccess: invalidateTodos })
	)
	const deleteTodoMutation = useMutation(
		orpc.todo.delete.mutationOptions({ onSuccess: invalidateTodos })
	)
	const { reconnectAttempt, send, status } = useRealtime({
		onMessage: (event) => {
			setEvents((currentEvents) => [event, ...currentEvents].slice(0, 8))

			if (event.type === 'todo:changed') {
				void invalidateTodos()
			}
		},
	})
	const todos = todoListQuery.data ?? []
	const completedCount = todos.filter((todo) => todo.isComplete).length
	const isMutatingTodo =
		createTodoMutation.isPending ||
		updateTodoMutation.isPending ||
		deleteTodoMutation.isPending

	const handleCreateTodo = (event: React.SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault()

		const trimmedNama = nama.trim()
		if (!trimmedNama) {
			return
		}

		createTodoMutation.mutate(
			{ nama: trimmedNama },
			{
				onSuccess: () => {
					setNama('')
				},
			}
		)
	}

	const handleToggleTodo = (todo: Todo) => {
		updateTodoMutation.mutate({ id: todo.id, isComplete: !todo.isComplete })
	}

	const handleRenameTodo = (todo: Todo) => {
		const nextNama = window.prompt('Ubah nama todo', todo.nama)?.trim()

		if (!nextNama || nextNama === todo.nama) {
			return
		}

		updateTodoMutation.mutate({ id: todo.id, nama: nextNama })
	}

	const handleDeleteTodo = (todo: Todo) => {
		deleteTodoMutation.mutate({ id: todo.id })
	}

	const sendClientEvent = () => {
		send({
			type: 'client:message',
			payload: {
				message: `Client event at ${new Date().toLocaleTimeString()}`,
			},
		})
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top_left,var(--muted),transparent_34rem)] p-6 md:p-10">
			<main className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_22rem]">
				<section className="rounded-3xl border bg-background/80 p-8 shadow-sm backdrop-blur">
					<div className="mb-8 flex flex-wrap items-center gap-3">
						<span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
							Nitro WebSocket
						</span>
						<span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
							Auto reconnect:{' '}
							{reconnectAttempt > 0 ? reconnectAttempt : 'ready'}
						</span>
					</div>
					<h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
						Realtime server-to-client stream
					</h1>
					<p className="mt-5 max-w-2xl text-lg text-muted-foreground">
						Halaman ini tersambung ke <code>/_ws</code>, menerima tick dari
						server, dan otomatis reconnect dengan exponential backoff saat
						koneksi terputus.
					</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Button onClick={sendClientEvent} disabled={status !== 'open'}>
							Send realtime message
						</Button>
						<div className="rounded-lg border bg-card px-3 py-2 text-sm">
							Status: <span className="font-medium">{status}</span>
						</div>
					</div>
				</section>

				<Card className="self-start">
					<CardHeader>
						<CardTitle>Connection</CardTitle>
						<CardDescription>Live websocket state</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center justify-between rounded-lg border p-3">
							<span className="text-muted-foreground">Endpoint</span>
							<code>/_ws</code>
						</div>
						<div className="flex items-center justify-between rounded-lg border p-3">
							<span className="text-muted-foreground">Reconnect attempt</span>
							<span>{reconnectAttempt}</span>
						</div>
					</CardContent>
				</Card>

				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Realtime Todo CRUD</CardTitle>
						<CardDescription>
							Data disimpan di Postgres via oRPC, dibaca dengan TanStack Query,
							dan di-refresh oleh event websocket <code>todo:changed</code>.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<form className="flex gap-2" onSubmit={handleCreateTodo}>
							<Input
								aria-label="Nama todo"
								onChange={(event) => setNama(event.target.value)}
								placeholder="Tambah todo baru..."
								value={nama}
							/>
							<Button disabled={createTodoMutation.isPending || !nama.trim()}>
								Tambah
							</Button>
						</form>

						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="secondary">{todos.length} total</Badge>
							<Badge variant="outline">{completedCount} selesai</Badge>
							{isMutatingTodo ? <Badge>Menyimpan...</Badge> : null}
						</div>

						{todoListQuery.isPending ? (
							<p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
								Memuat todo dari database...
							</p>
						) : null}

						{todoListQuery.isError ? (
							<p className="rounded-lg border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
								Gagal memuat todo: {todoListQuery.error.message}
							</p>
						) : null}

						{todoListQuery.isSuccess && todos.length === 0 ? (
							<p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
								Belum ada todo. Tambahkan item pertama untuk melihat realtime
								CRUD.
							</p>
						) : null}

						<div className="grid gap-2">
							{todos.map((todo) => (
								<div
									className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"
									key={todo.id}
								>
									<label className="flex min-w-0 items-center gap-3">
										<Checkbox
											checked={todo.isComplete}
											onCheckedChange={() => handleToggleTodo(todo)}
										/>
										<span
											className={cn(
												'truncate text-sm font-medium',
												todo.isComplete && 'text-muted-foreground line-through'
											)}
										>
											{todo.nama}
										</span>
									</label>
									<div className="flex gap-2">
										<Button
											onClick={() => handleRenameTodo(todo)}
											size="sm"
											variant="outline"
										>
											Rename
										</Button>
										<Button
											onClick={() => handleDeleteTodo(todo)}
											size="sm"
											variant="destructive"
										>
											Hapus
										</Button>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Realtime events</CardTitle>
						<CardDescription>
							Events terbaru dari server dan broadcast peer lain.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-3">
							{events.length === 0 ? (
								<p className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
									Menunggu event pertama dari server...
								</p>
							) : (
								events.map((event, index) => (
									<div
										className="rounded-lg border bg-muted/30 p-3 font-mono text-xs"
										key={`${event.type}-${index}`}
									>
										<div className="mb-2 font-semibold text-foreground">
											{event.type}
										</div>
										<pre className="overflow-auto text-muted-foreground">
											{JSON.stringify(event.payload ?? {}, null, 2)}
										</pre>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
