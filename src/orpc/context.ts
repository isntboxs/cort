import type { LoggerContext } from '@orpc/experimental-pino'
import type { ResponseHeadersPluginContext } from '@orpc/server/plugins'

interface BaseORPCContext extends ResponseHeadersPluginContext, LoggerContext {
	headers: Headers
}

// TODO: implement auth and db in context

// oxlint-disable-next-line typescript/require-await
export const createORPCContext = async (opts: BaseORPCContext) => {
	return { ...opts }
}

export type ORPCContext = Awaited<ReturnType<typeof createORPCContext>>
