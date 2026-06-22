import '@tanstack/react-start/server-only'
import { LoggingHandlerPlugin, getLogger } from '@orpc/experimental-pino'
import type { LoggerContext } from '@orpc/experimental-pino'
import type { Context } from '@orpc/server'

import { env } from '#/env'
import { serverLogger } from '#/lib/logger/server'

export function getOrpcLogger(context: LoggerContext) {
	return getLogger(context)
}

export function createOrpcLoggingPlugin<TContext extends Context>() {
	return new LoggingHandlerPlugin<TContext>({
		logger: serverLogger,
		generateId: () => crypto.randomUUID(),
		logRequestResponse: env.LOG_REQUEST_RESPONSE,
		logRequestAbort: env.LOG_REQUEST_ABORT,
	})
}
