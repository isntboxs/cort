import * as serializers from 'pino-std-serializers'
import type { LevelWithSilent, LoggerOptions, SerializerFn } from 'pino'

export type LogLevel = LevelWithSilent
export type NodeEnv = 'development' | 'production' | 'test'

export interface LoggerSettings {
	level: LogLevel
	pretty: boolean
	requestResponse: boolean
	requestAbort: boolean
}

export interface LoggerSettingsInput {
	nodeEnv: NodeEnv
	level?: LogLevel
	pretty?: boolean
	requestResponse?: boolean
	requestAbort?: boolean
}

export interface ServerLoggerOptionsInput extends LoggerSettingsInput {
	appName: string
}

export const REDACTED_VALUE = '[REDACTED]'
const SAFE_HEADER_NAMES = [
	'content-type',
	'content-length',
	'content-disposition',
] as const
export const LOGGER_REDACT_PATHS = [
	'password',
	'*.password',
	'*.*.password',
	'currentPassword',
	'newPassword',
	'token',
	'*.token',
	'*.*.token',
	'accessToken',
	'refreshToken',
	'idToken',
	'apiKey',
	'secret',
	'*.secret',
	'*.*.secret',
	'authorization',
	'cookie',
	'headers.authorization',
	'headers.Authorization',
	'headers.cookie',
	'headers.Cookie',
	'req.headers.authorization',
	'req.headers.Authorization',
	'req.headers.cookie',
	'req.headers.Cookie',
	'request.headers.authorization',
	'request.headers.Authorization',
	'request.headers.cookie',
	'request.headers.Cookie',
	'response.headers.authorization',
	'response.headers.Authorization',
	'response.headers.cookie',
	'response.headers.Cookie',
] as const

const loggerSerializers: Record<string, SerializerFn> = {
	err: serializers.errWithCause,
	error: serializers.errWithCause,
	req: serializeRequest,
}

export function resolveLoggerSettings({
	nodeEnv,
	level,
	pretty,
	requestResponse,
	requestAbort,
}: LoggerSettingsInput): LoggerSettings {
	return {
		level: level ?? (nodeEnv === 'development' ? 'debug' : 'info'),
		pretty: pretty ?? nodeEnv === 'development',
		requestResponse: requestResponse ?? false,
		requestAbort: requestAbort ?? false,
	}
}

export function createServerLoggerOptions({
	appName,
	...settingsInput
}: ServerLoggerOptionsInput): LoggerOptions {
	const settings = resolveLoggerSettings(settingsInput)

	const options: LoggerOptions = {
		base: {
			app: appName,
			runtime: 'server',
		},
		level: settings.level,
		redact: {
			paths: [...LOGGER_REDACT_PATHS],
			censor: REDACTED_VALUE,
		},
		serializers: loggerSerializers,
		timestamp: isoTimestamp,
	}

	if (settings.pretty) {
		options.transport = {
			target: 'pino-pretty',
			options: {
				colorize: true,
				ignore: 'pid,hostname',
				singleLine: false,
				translateTime: 'SYS:standard',
			},
		}
	}

	return options
}

function isoTimestamp() {
	return `,"time":"${new Date().toISOString()}"`
}

function serializeRequest(value: unknown) {
	if (!isRecord(value)) {
		return value
	}

	return stripUndefined({
		method: readString(value.method),
		url: readUrl(value.url),
		headers: serializeHeaders(value.headers),
	})
}

function serializeHeaders(value: unknown) {
	if (!isRecord(value)) {
		return undefined
	}

	return stripUndefined(
		Object.fromEntries(
			SAFE_HEADER_NAMES.map((name) => [
				name,
				readHeaderValue(
					value[name] ?? value[toHeaderCase(name)] ?? value[name.toUpperCase()]
				),
			])
		)
	)
}

function readUrl(value: unknown) {
	const raw = value instanceof URL ? value.href : readString(value)
	return raw?.split(/[?#]/, 1)[0]
}

function readHeaderValue(value: unknown): string | Array<string> | undefined {
	if (Array.isArray(value)) {
		const values = value
			.filter((item): item is string | number =>
				typeof item === 'string' || typeof item === 'number'
			)
			.map(String)

		return values.length > 0 ? values : undefined
	}

	return typeof value === 'string' || typeof value === 'number'
		? String(value)
		: undefined
}

function readString(value: unknown) {
	return typeof value === 'string' ? value : undefined
}

function stripUndefined<T extends Record<string, unknown>>(value: T) {
	return Object.fromEntries(
		Object.entries(value).filter(([, entryValue]) => entryValue !== undefined)
	)
}

function toHeaderCase(value: string) {
	return value
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('-')
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}
