import '@tanstack/react-start/server-only'
import { and, eq } from 'drizzle-orm'

import { db } from '#/db'
import { teamTable } from '#/db/schemas'

type TeamKeyExists = (key: string) => Promise<boolean>

function normalizeKeySegment(value: string) {
	return value.replace(/[^a-z0-9]/gi, '').toUpperCase()
}

export function getTeamKeyBase(name: string) {
	return normalizeKeySegment(name).slice(0, 4) || 'TEAM'
}

function withNumericSuffix(base: string, index: number) {
	const suffix = String(index)
	const prefix = base.slice(0, Math.max(1, 5 - suffix.length))
	return `${prefix}${suffix}`
}

export async function generateTeamKeyFromExists(
	name: string,
	keyExists: TeamKeyExists
) {
	const base = getTeamKeyBase(name)

	for (let index = 0; index < 100; index++) {
		const key = index === 0 ? base : withNumericSuffix(base, index + 1)
		const existing = await keyExists(key)

		if (!existing) {
			return key
		}
	}

	throw new Error('Unable to generate a unique team key')
}

export async function generateTeamKey(
	organizationId: string,
	name: string
) {
	return generateTeamKeyFromExists(name, async (key) => {
		const existing = await db.query.teamTable.findFirst({
			where: and(
				eq(teamTable.organizationId, organizationId),
				eq(teamTable.key, key)
			),
			columns: { id: true },
		})

		return Boolean(existing)
	})
}
