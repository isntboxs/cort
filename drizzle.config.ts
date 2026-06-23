import { defineConfig } from 'drizzle-kit'

const dbUrl = process.env.DATABASE_URL
if (!dbUrl) throw new Error('DATABASE_URL is not defined')

export default defineConfig({
	schema: './src/db/schemas',
	out: './src/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: dbUrl,
	},
})
