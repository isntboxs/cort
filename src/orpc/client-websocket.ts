import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { createORPCClient } from '@orpc/client'
import { RPCLink as WebSocketRPCLink } from '@orpc/client/websocket'
import type { LinkWebsocketClientOptions } from '@orpc/client/websocket'
import { createRouterClient } from '@orpc/server'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { WebSocket as PartySocketWebSocket } from 'partysocket'

import { createORPCContext } from '#/orpc/context'
import { orpcRouters } from '#/orpc/routers'
import type { ORPCRouterClient } from '#/orpc/routers'

function createORPCWebSocket(
	websocket: PartySocketWebSocket
): LinkWebsocketClientOptions['websocket'] {
	return websocket as unknown as LinkWebsocketClientOptions['websocket']
}

const getORPCWebSocketClient = createIsomorphicFn()
	.server(() =>
		createRouterClient(orpcRouters, {
			context: async () => createORPCContext({ headers: getRequestHeaders() }),
		})
	)
	.client((): ORPCRouterClient => {
		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
		const websocket = new PartySocketWebSocket(
			`${protocol}//${window.location.host}/api/rpc/ws`,
			[],
			{
				connectionTimeout: 4_000,
				maxEnqueuedMessages: 100,
			}
		)
		const link = new WebSocketRPCLink({
			websocket: createORPCWebSocket(websocket),
		})

		return createORPCClient(link)
	})

const client: ORPCRouterClient = getORPCWebSocketClient()
export const orpcWs = createTanstackQueryUtils(client)
