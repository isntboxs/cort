import '@tanstack/react-start/server-only'
import pino from 'pino'

import { env } from '#/env'
import { createServerLoggerOptions } from '#/lib/logger/shared'

export const serverLogger = pino(
	createServerLoggerOptions({
		appName: env.APP_NAME,
		nodeEnv: env.NODE_ENV,
		level: env.LOG_LEVEL,
		pretty: env.LOG_PRETTY,
		requestResponse: env.LOG_REQUEST_RESPONSE,
		requestAbort: env.LOG_REQUEST_ABORT,
	})
)
