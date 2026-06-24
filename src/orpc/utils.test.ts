import { ORPCError } from '@orpc/server'
import { APIError } from 'better-auth/api'
import { describe, expect, it } from 'vitest'

import type { ORPCContext } from '#/orpc/context'
import {
	applyBetterAuthResponseHeaders,
	throwORPCErrorFromBetterAuth,
	toORPCErrorFromBetterAuth,
	withBetterAuthErrorHandling,
} from '#/orpc/utils'

describe('Better Auth oRPC error handling', () => {
	it('maps Better Auth APIError status and body into ORPCError', () => {
		const error = new APIError('UNAUTHORIZED', {
			code: 'FAILED_TO_GET_SESSION',
			message: 'Not authenticated',
		})

		const mapped = toORPCErrorFromBetterAuth(error)

		expect(mapped).toBeInstanceOf(ORPCError)
		expect(mapped.code).toBe('UNAUTHORIZED')
		expect(mapped.status).toBe(401)
		expect(mapped.message).toBe('Not authenticated')
		expect(mapped.data).toEqual({
			betterAuthCode: 'FAILED_TO_GET_SESSION',
			betterAuthStatus: 'UNAUTHORIZED',
			betterAuthStatusCode: 401,
		})
	})

	it('rethrows non Better Auth errors unchanged', () => {
		const error = new Error('database unavailable')

		expect(() => throwORPCErrorFromBetterAuth(error)).toThrow(error)
	})

	it('wraps async Better Auth calls', () =>
		expect(
			withBetterAuthErrorHandling(() =>
				Promise.reject(
					new APIError('FORBIDDEN', {
						code: 'USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION',
						message: 'Not a member',
					})
				)
			)
		).rejects.toMatchObject({
			code: 'FORBIDDEN',
			status: 403,
			message: 'Not a member',
		}))

	it('copies Better Auth response headers into the ORPC response context', () => {
		const headers = new Headers({
			'cache-control': 'no-store',
			'set-cookie': 'session=abc; HttpOnly',
		})
		const resHeaders = new Headers()
		const context = { resHeaders } as ORPCContext

		applyBetterAuthResponseHeaders(headers, context)

		expect(resHeaders.get('cache-control')).toBe('no-store')
		expect(resHeaders.getSetCookie()).toEqual(['session=abc; HttpOnly'])
	})
})
