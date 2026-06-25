export interface RealtimeEvent {
	type: string
	payload?: Record<string, unknown>
}

type RealtimeListener = (event: RealtimeEvent) => void

interface RealtimeEventState {
	listeners: Set<RealtimeListener>
}

const realtimeStateKey = Symbol.for('coret.realtime-events')

const realtimeGlobal = globalThis as typeof globalThis & {
	[realtimeStateKey]?: RealtimeEventState
}

const realtimeState = (realtimeGlobal[realtimeStateKey] ??= {
	listeners: new Set<RealtimeListener>(),
})

export const createRealtimeEvent = (
	type: string,
	payload: Record<string, unknown> = {}
): RealtimeEvent => {
	return {
		type,
		payload: {
			...payload,
			serverTime: new Date().toISOString(),
		},
	}
}

export const publishRealtimeEvent = (event: RealtimeEvent) => {
	for (const listener of realtimeState.listeners) {
		listener(event)
	}
}

export const subscribeRealtimeEvents = (listener: RealtimeListener) => {
	realtimeState.listeners.add(listener)

	return () => {
		realtimeState.listeners.delete(listener)
	}
}
