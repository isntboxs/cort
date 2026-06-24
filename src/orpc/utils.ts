import { ORPCError } from '@orpc/server'
import { isAPIError } from 'better-auth/api'
import type { APIError } from 'better-auth/api'

import type { ORPCContext } from '#/orpc/context'

const betterAuthStatusToORPCError = {
	400: { code: 'BAD_REQUEST', status: 400 },
	401: { code: 'UNAUTHORIZED', status: 401 },
	403: { code: 'FORBIDDEN', status: 403 },
	404: { code: 'NOT_FOUND', status: 404 },
	409: { code: 'CONFLICT', status: 409 },
	422: { code: 'UNPROCESSABLE_CONTENT', status: 422 },
	429: { code: 'TOO_MANY_REQUESTS', status: 429 },
	500: { code: 'INTERNAL_SERVER_ERROR', status: 500 },
} as const

type BetterAuthStatusCode = keyof typeof betterAuthStatusToORPCError
type BetterAuthORPCErrorCode =
	(typeof betterAuthStatusToORPCError)[BetterAuthStatusCode]['code']

export interface BetterAuthORPCErrorData {
	betterAuthCode?: string
	betterAuthStatus: APIError['status']
	betterAuthStatusCode: number
}

function isMappedBetterAuthStatus(
	status: number
): status is BetterAuthStatusCode {
	return status in betterAuthStatusToORPCError
}

export function toORPCErrorFromBetterAuth(error: APIError) {
	const config = isMappedBetterAuthStatus(error.statusCode)
		? betterAuthStatusToORPCError[error.statusCode]
		: betterAuthStatusToORPCError[500]

	return new ORPCError<BetterAuthORPCErrorCode, BetterAuthORPCErrorData>(
		config.code,
		{
			status: config.status,
			message: error.body?.message ?? error.message,
			data: {
				betterAuthCode: error.body?.code,
				betterAuthStatus: error.status,
				betterAuthStatusCode: error.statusCode,
			},
			cause: error,
		}
	)
}

export function throwORPCErrorFromBetterAuth(error: unknown): never {
	if (isAPIError(error)) {
		throw toORPCErrorFromBetterAuth(error)
	}

	throw error
}

export async function withBetterAuthErrorHandling<T>(
	callback: () => Promise<T>
): Promise<T> {
	try {
		return await callback()
	} catch (error) {
		throwORPCErrorFromBetterAuth(error)
	}
}

export function applyBetterAuthResponseHeaders(
	headers: Headers,
	context: ORPCContext
) {
	headers.forEach((value, key) => {
		if (key.toLowerCase() === 'set-cookie') {
			context.resHeaders?.append('Set-Cookie', value)
			return
		}

		context.resHeaders?.set(key, value)
	})
}
