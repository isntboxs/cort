import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import {
	multiSession as multiSessionPlugin,
	openAPI as openAPIPlugin,
	username as usernamePlugin,
	organization as organizationPlugin,
} from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import type { BetterAuthOptions } from 'better-auth'

import { db } from '#/db'
import * as schema from '#/db/schemas'
import { env } from '#/env'

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
		level: 'debug',
	},
	plugins: [
		multiSessionPlugin(),
		openAPIPlugin(),
		usernamePlugin(),
		organizationPlugin({ teams: { enabled: true } }),
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
