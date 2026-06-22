import { createFileRoute } from '@tanstack/react-router'

import { handleORPCRequest } from '#/orpc/server'

export const Route = createFileRoute('/api/rpc/$')({
	server: {
		handlers: {
			ANY: handleORPCRequest,
		},
	},
})
