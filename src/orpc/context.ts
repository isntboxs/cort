import '@tanstack/react-start/server-only'
import type { LoggerContext } from '@orpc/experimental-pino'
import type { ResponseHeadersPluginContext } from '@orpc/server/plugins'

import { db } from '#/db'
import { auth } from '#/lib/auth'

interface BaseORPCContext extends ResponseHeadersPluginContext, LoggerContext {
	headers: Headers
}

export const createORPCContext = async (opts: BaseORPCContext) => {
	let session: Awaited<ReturnType<typeof auth.api.getSession>> = null
	try {
		session = await auth.api.getSession({ headers: opts.headers })
	} catch {
		session = null
	}

	return { ...opts, auth: session, db }
}

export type ORPCContext = Awaited<ReturnType<typeof createORPCContext>>
