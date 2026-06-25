import * as React from 'react'

import type { RealtimeEvent } from '#/lib/realtime-events'

export type RealtimeStatus =
	| 'idle'
	| 'connecting'
	| 'open'
	| 'closed'
	| 'reconnecting'
	| 'error'

export type { RealtimeEvent }

interface UseRealtimeOptions {
	path?: string
	reconnect?: boolean
	maxReconnectDelayMs?: number
	heartbeatMs?: number
	onMessage?: (event: RealtimeEvent) => void
}

const getWebSocketUrl = (path: string) => {
	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
	return `${protocol}//${window.location.host}${path}`
}

const parseRealtimeEvent = (data: MessageEvent['data']): RealtimeEvent => {
	if (typeof data !== 'string') {
		return { type: 'message', payload: { data } }
	}

	try {
		const parsed = JSON.parse(data) as RealtimeEvent

		if (typeof parsed.type === 'string') {
			return parsed
		}
	} catch {
		return { type: 'message', payload: { message: data } }
	}

	return { type: 'message', payload: { message: data } }
}

export function useRealtime({
	path = '/_ws',
	reconnect = true,
	maxReconnectDelayMs = 10_000,
	heartbeatMs = 25_000,
	onMessage,
}: UseRealtimeOptions = {}) {
	const [status, setStatus] = React.useState<RealtimeStatus>('idle')
	const [lastEvent, setLastEvent] = React.useState<RealtimeEvent | null>(null)
	const [reconnectAttempt, setReconnectAttempt] = React.useState(0)
	const socketRef = React.useRef<WebSocket | null>(null)
	const reconnectTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
		null
	)
	const heartbeatTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(
		null
	)
	const reconnectAttemptRef = React.useRef(0)
	const shouldReconnectRef = React.useRef(reconnect)
	const onMessageRef = React.useRef(onMessage)

	React.useEffect(() => {
		shouldReconnectRef.current = reconnect
		onMessageRef.current = onMessage
	}, [onMessage, reconnect])

	React.useEffect(() => {
		let disposed = false

		const clearReconnectTimer = () => {
			if (reconnectTimerRef.current) {
				clearTimeout(reconnectTimerRef.current)
				reconnectTimerRef.current = null
			}
		}

		const clearHeartbeatTimer = () => {
			if (heartbeatTimerRef.current) {
				clearInterval(heartbeatTimerRef.current)
				heartbeatTimerRef.current = null
			}
		}

		const connect = () => {
			if (disposed) {
				return
			}

			clearReconnectTimer()
			clearHeartbeatTimer()
			setStatus(reconnectAttemptRef.current > 0 ? 'reconnecting' : 'connecting')

			const socket = new WebSocket(getWebSocketUrl(path))
			socketRef.current = socket

			socket.addEventListener('open', () => {
				if (disposed) {
					socket.close(1000, 'Realtime hook disposed')
					return
				}

				reconnectAttemptRef.current = 0
				setReconnectAttempt(0)
				setStatus('open')

				heartbeatTimerRef.current = setInterval(() => {
					if (socket.readyState === WebSocket.OPEN) {
						socket.send('ping')
					}
				}, heartbeatMs)
			})

			socket.addEventListener('message', (message) => {
				if (disposed) {
					return
				}

				const event = parseRealtimeEvent(message.data)
				setLastEvent(event)
				onMessageRef.current?.(event)
			})

			socket.addEventListener('error', () => {
				if (disposed) {
					return
				}

				setStatus('error')
			})

			socket.addEventListener('close', () => {
				clearHeartbeatTimer()

				if (disposed) {
					return
				}

				if (!shouldReconnectRef.current) {
					setStatus('closed')
					return
				}

				reconnectAttemptRef.current += 1
				setReconnectAttempt(reconnectAttemptRef.current)
				setStatus('reconnecting')

				const delay = Math.min(
					1_000 * 2 ** (reconnectAttemptRef.current - 1),
					maxReconnectDelayMs
				)
				reconnectTimerRef.current = setTimeout(connect, delay)
			})
		}

		connect()

		return () => {
			disposed = true
			clearReconnectTimer()
			clearHeartbeatTimer()
			socketRef.current?.close(1000, 'Component unmounted')
			socketRef.current = null
		}
	}, [heartbeatMs, maxReconnectDelayMs, path])

	const send = (message: string | RealtimeEvent) => {
		const socket = socketRef.current

		if (!socket || socket.readyState !== WebSocket.OPEN) {
			return false
		}

		socket.send(typeof message === 'string' ? message : JSON.stringify(message))
		return true
	}

	return { lastEvent, reconnectAttempt, send, status }
}
