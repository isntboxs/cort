import '@tanstack/react-start/server-only'
import { onError } from '@orpc/server'
import { experimental_RPCHandler as RPCHandler } from '@orpc/server/crossws'
import type { Message, Peer } from 'crossws'

import { serverLogger } from '#/lib/logger/server'
import { createORPCContext } from '#/orpc/context'
import { createOrpcLoggingPlugin } from '#/orpc/logger'
import { orpcRouters } from '#/orpc/routers'

const websocketHandler = new RPCHandler(orpcRouters, {
	interceptors: [
		onError((error) => {
			serverLogger.error({ err: error }, 'WebSocket RPC handler error')
		}),
	],
	plugins: [createOrpcLoggingPlugin()],
})

export async function handleORPCWebSocketMessage(peer: Peer, message: Message) {
	const context = await createORPCContext({ headers: peer.request.headers })

	await websocketHandler.message(peer, message, { context })
}

export function closeORPCWebSocket(peer: Peer) {
	websocketHandler.close(peer)
}
