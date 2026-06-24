import { defineWebSocketHandler } from 'nitro'

import { serverLogger } from '#/lib/logger/server'
import {
	closeORPCWebSocket,
	handleORPCWebSocketMessage,
} from '#/orpc/websocket'

function assertSameOrigin(request: Request) {
	const origin = request.headers.get('origin')
	if (!origin) return

	const host =
		request.headers.get('x-forwarded-host') ?? request.headers.get('host')

	if (!host || new URL(origin).host !== host) {
		throw new Response('Forbidden', { status: 403 })
	}
}

export default defineWebSocketHandler({
	upgrade(request) {
		assertSameOrigin(request)
	},
	async message(peer, message) {
		try {
			await handleORPCWebSocketMessage(peer, message)
		} catch (error) {
			serverLogger.error({ err: error }, 'WebSocket RPC message error')
			peer.close(1011, 'Internal server error')
		}
	},
	close(peer) {
		closeORPCWebSocket(peer)
	},
	error(peer, error) {
		serverLogger.error(
			{ err: error, peerId: peer.id },
			'WebSocket RPC connection error'
		)
	},
})
