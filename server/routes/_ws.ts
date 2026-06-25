import { defineWebSocketHandler } from 'nitro'

import {
	createRealtimeEvent,
	subscribeRealtimeEvents,
} from '#/lib/realtime-events'

const topic = 'realtime'
let connectedPeers = 0
const heartbeatIntervals = new Map<string, ReturnType<typeof setInterval>>()
const realtimeUnsubscribes = new Map<string, () => void>()

const createServerEvent = (type: string, payload: Record<string, unknown>) =>
	createRealtimeEvent(type, {
		...payload,
		connectedPeers,
	})

export default defineWebSocketHandler({
	open(peer) {
		connectedPeers += 1
		peer.subscribe(topic)
		realtimeUnsubscribes.set(
			peer.id,
			subscribeRealtimeEvents((event) => {
				peer.send(event)
			})
		)
		peer.send(createServerEvent('connected', { peerId: peer.id }))
		peer.publish(topic, createServerEvent('peer:joined', { peerId: peer.id }))

		const interval = setInterval(() => {
			peer.send(createServerEvent('server:tick', { peerId: peer.id }))
		}, 5_000)
		heartbeatIntervals.set(peer.id, interval)
	},
	message(peer, message) {
		const text = message.text()

		if (text === 'ping') {
			peer.send(createServerEvent('pong', { peerId: peer.id }))
			return
		}

		const event = createServerEvent('message', {
			message: text,
			peerId: peer.id,
		})

		peer.send(event)
		peer.publish(topic, event)
	},
	close(peer) {
		const interval = heartbeatIntervals.get(peer.id)
		const unsubscribe = realtimeUnsubscribes.get(peer.id)

		if (interval) {
			clearInterval(interval)
			heartbeatIntervals.delete(peer.id)
		}

		if (unsubscribe) {
			unsubscribe()
			realtimeUnsubscribes.delete(peer.id)
		}

		connectedPeers = Math.max(0, connectedPeers - 1)
		peer.publish(topic, createServerEvent('peer:left', { peerId: peer.id }))
	},
	error(peer, error) {
		peer.send(
			createServerEvent('error', {
				message:
					error instanceof Error ? error.message : 'Unknown websocket error',
				peerId: peer.id,
			})
		)
	},
})
