import '@tanstack/react-start/server-only'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import {
	multiSession as multiSessionPlugin,
	openAPI as openAPIPlugin,
	username as usernamePlugin,
	organization as organizationPlugin,
} from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { eq } from 'drizzle-orm'
import type { BetterAuthOptions } from 'better-auth'

import { db } from '#/db'
import * as schema from '#/db/schemas'
import { env } from '#/env'
import { generateTeamKey } from '#/lib/auth/generate-team-key'
import { seedTeamDefaults } from '#/lib/auth/seed-team-defaults'

export const authConfig = {
	account: {
		accountLinking: {
			enabled: true,
			trustedProviders: ['github'],
		},
		encryptOAuthTokens: true,
	},
	advanced: {
		database: {
			generateId: 'uuid',
		},
	},
	appName: env.APP_NAME,
	baseURL: env.BETTER_AUTH_URL,
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema: {
			account: schema.accountTable,
			member: schema.memberTable,
			organization: schema.organizationTable,
			session: schema.sessionTable,
			team: schema.teamTable,
			teamMember: schema.teamMemberTable,
			user: schema.userTable,
			invitation: schema.invitationTable,
			verification: schema.verificationTable,
		},
	}),
	emailAndPassword: {
		enabled: false,
	},
	logger: {
		disabled: false,
		disableColors: false,
		level: env.NODE_ENV === 'development' ? 'debug' : 'error',
	},
	plugins: [
		multiSessionPlugin(),
		openAPIPlugin(),
		usernamePlugin(),
		organizationPlugin({
			teams: { enabled: true },
			schema: {
				team: {
					additionalFields: {
						key: {
							type: 'string',
							input: true,
							required: true,
						},
					},
				},
			},
			organizationHooks: {
				beforeCreateTeam: async ({ team, organization }) => {
					if (!team.key) {
						const key = await generateTeamKey(
							organization.id,
							team.name
						)
						return { data: { key } }
					}
				},
				afterCreateTeam: async ({ team, organization }) => {
					try {
						await seedTeamDefaults(organization.id, team.id)
					} catch (error) {
						await db
							.delete(schema.teamTable)
							.where(eq(schema.teamTable.id, team.id))
						throw error
					}
				},
			},
		}),
		tanstackStartCookies(),
	],
	secret: env.BETTER_AUTH_SECRET,
	session: {
		expiresIn: 60 * 60 * 24 * 3,
	},
	socialProviders: {
		github: {
			enabled: true,
			clientId: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
		},
	},
	trustedOrigins: env.BETTER_AUTH_TRUSTED_ORIGINS,
} satisfies BetterAuthOptions
