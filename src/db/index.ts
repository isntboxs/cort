import '@tanstack/react-start/server-only'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from '#/db/schemas'
import { env } from '#/env'

export function createDb() {
	const pool = new Pool({
		connectionString: env.DATABASE_URL,
	})

	return drizzle({ client: pool, schema })
}

export const db = createDb()
