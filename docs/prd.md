# PRD: Coret Linear-Style Issue Tracker SaaS

## 1. Executive Summary

**Problem Statement**: Startup product-engineering teams need a focused issue tracker that is faster to adopt than enterprise project management tools, but still structured enough to scale from a small team to multiple teams/workspaces.

**Proposed Solution**: Build a Linear-inspired SaaS in phases, starting with a core tracker: workspace, teams, issues, projects, comments, filters, and basic views. Use the existing TanStack Start, Better Auth organization/team, Drizzle/Postgres, ORPC, TanStack Query, and shadcn/Radix stack.

**Success Criteria**:

- New user can sign in, create a workspace, create a team, and create the first issue in under 5 minutes.
- 80% of beta workspaces create at least 10 issues within 7 days.
- Issue list interactions for 1,000 issues return usable UI data in <= 500ms server time.
- Zero cross-workspace data exposure in authorization tests.
- At least 5 external startup teams actively use the free beta before paid billing is added.

## 2. User Experience & Functionality

**User Personas**:

- Founder/PM: organizes product work, tracks delivery, and prioritizes issues.
- Engineer: creates, updates, filters, comments on, and closes issues.
- Team lead: manages team workflow, project scope, and assignees.
- Workspace admin: invites members and manages workspace/team access.

**User Stories**:

- As a user, I want to sign in with GitHub so that I can start without password setup.
- As a workspace admin, I want to create a workspace and teams so that work is separated by function.
- As a member, I want to create issues with title, description, status, priority, assignee, team, labels, and project so that work is trackable.
- As a member, I want issue IDs like `ENG-123` so that issues are easy to reference.
- As a member, I want list and board views so that I can scan work by status, priority, assignee, project, or team.
- As a member, I want comments and lightweight activity history so that context stays attached to the issue.
- As a team lead, I want projects with status and target dates so that related issues can be grouped into outcomes.
- As a member, I want filters and saved views so that repeated workflows are one click away.
- As an admin, I want to invite members into a workspace/team so that beta teams can collaborate.

**Acceptance Criteria**:

- Auth:
  - GitHub login works through Better Auth.
  - Unauthenticated users cannot access app routes or ORPC protected procedures.
  - User sessions use existing Better Auth session tables.

- Workspace and team:
  - User can create, switch, and list organizations/workspaces.
  - User can create and list teams inside a workspace.
  - Member access is scoped by `organizationId`; team-scoped data is scoped by `teamId`.

- Issues:
  - Issue create/edit supports title, description, status, priority, assignee, labels, project, and team.
  - Default priorities are No Priority, Urgent, High, Medium, and Low.
  - Issues have stable workspace/team sequence identifiers.
  - Issue list supports pagination or cursor loading.
  - Issue mutations update TanStack Query cache or invalidate the relevant queries.
  - Deleting issues is soft-delete or archived, not hard-delete, for MVP safety.

- Views:
  - Default views: All issues, My issues, Team issues, Project issues.
  - Filters support status, priority, assignee, team, project, and label.
  - Saved views persist per workspace and can be private or shared.

- Projects:
  - Project has name, description, status, lead, target date, and workspace/team scope.
  - Project page shows grouped issues and progress by closed vs total issues.

- Comments/activity:
  - Members can comment on issues.
  - Activity records creation, status change, assignee change, priority change, project change, and comments.

- Beta readiness:
  - App supports multiple unrelated workspaces in one deployment.
  - No billing required in MVP.
  - Basic onboarding guides users from first login to first issue.

**Non-Goals**:

- No billing/payments in MVP.
- No enterprise SSO/SAML in MVP.
- No audit log UI in MVP.
- No GitHub/Slack integrations in MVP.
- No cycles, initiatives, roadmaps, automation rules, importers, or AI features in MVP.
- No mobile-native app; responsive web only.
- No custom permission system beyond Better Auth owner/admin/member unless a beta team proves the need.

## 3. AI System Requirements

Not applicable for MVP.

AI-assisted issue writing, summaries, duplicate detection, or triage can be considered after core tracker usage exists.

## 4. Technical Specifications

**Architecture Overview**:

- Frontend: TanStack Start + React 19 + TanStack Router file routes.
- Server/data boundary: ORPC protected procedures for app data mutations and reads.
- Data fetching: TanStack Query.
- Database: Postgres via Drizzle ORM.
- Auth/multi-tenancy: Better Auth with organization and team plugins.
- UI: Existing shadcn/Radix components, Tailwind, lucide/tabler icons.
- Deployment: current Nitro/Vite setup; build with `bun run build`.

**Core Data Model Additions**:

- `issue`:
  - `id`, `organizationId`, `teamId`, `projectId`, `number`, `identifier`, `title`, `description`, `statusId`, `priority`, `assigneeId`, `creatorId`, `archivedAt`, `createdAt`, `updatedAt`.

- `issueStatus`:
  - `id`, `organizationId`, `teamId`, `name`, `type`, `position`, `createdAt`, `updatedAt`.
  - Default statuses: Backlog, Todo, In Progress, In Review, Done, Canceled.

- `project`:
  - `id`, `organizationId`, `teamId`, `name`, `description`, `status`, `leadId`, `targetDate`, `createdAt`, `updatedAt`, `archivedAt`.

- `label`:
  - `id`, `organizationId`, `teamId`, `name`, `color`, `createdAt`.
  - Default labels: Bug, Feature, Improvement.

- `issueLabel`:
  - `issueId`, `labelId`.

- `issueComment`:
  - `id`, `issueId`, `organizationId`, `authorId`, `body`, `createdAt`, `updatedAt`, `deletedAt`.

- `issueActivity`:
  - `id`, `issueId`, `organizationId`, `actorId`, `eventType`, `metadata`, `createdAt`.

- `savedView`:
  - `id`, `organizationId`, `teamId`, `ownerId`, `name`, `visibility`, `filters`, `sort`, `groupBy`, `createdAt`, `updatedAt`.

**Public API / ORPC Interface Additions**:

- `workspace.getCurrent`
- `team.list`
- `issue.list`
- `issue.get`
- `issue.create`
- `issue.update`
- `issue.archive`
- `issue.comment.create`
- `project.list`
- `project.get`
- `project.create`
- `project.update`
- `label.list`
- `label.create`
- `view.list`
- `view.create`
- `view.update`
- `view.delete`

All protected procedures must verify the user is a member of `organizationId`; team-scoped operations must verify team membership or organization admin/owner role.

**Integration Points**:

- Better Auth organization plugin handles workspace, members, invitations, active organization, and teams.
- ORPC exposes typed app APIs under existing `/api/rpc`.
- Drizzle migrations add tracker tables beside existing auth tables.
- TanStack Router keeps generated `routeTree.gen.ts` untouched.

**Security & Privacy**:

- Every query includes `organizationId` scoping.
- Never trust client-provided workspace/team IDs without membership checks.
- Keep secrets server-side; only public client vars use `VITE_`.
- Use soft deletion/archive for issue/project data in beta.
- Add authorization tests for cross-workspace and cross-team access.
- Free beta has no payment data, reducing compliance scope.

**Testing & Acceptance Scenarios**:

- Unit/integration:
  - Issue creation rejects missing title/team.
  - Issue update rejects users outside workspace.
  - Cross-workspace issue ID lookup returns not found/unauthorized.
  - Saved view filters round-trip through validation.
  - Project progress counts open/closed issues correctly.

- UI:
  - First-run flow: login -> create workspace -> create team -> create issue.
  - Issue list filter by status, priority, assignee, project, label.
  - Board drag/status update persists and refreshes.
  - Comment creation appears without full page reload.

- Build/check:
  - `bun run lint`
  - `bun run test`
  - `bun run build`

## 5. Risks & Roadmap

**Phased Rollout**:

- MVP: Core tracker
  - Auth, workspace/team, member invite, issues, statuses, priorities, labels, projects, comments, activity, filters, saved views, list/board UI.

- v1.1: Planning
  - Cycles, triage inbox, issue relations, parent/sub-issues, project milestones.

- v1.2: Integrations
  - GitHub issue/PR linking, Slack notifications, importer from GitHub/Jira/Linear.

- v2.0: Commercial SaaS
  - Billing, plan limits, audit logs, advanced RBAC, SSO/SAML, admin analytics.

**Technical Risks**:

- Multi-tenant authorization mistakes are the highest risk; solve with shared protected ORPC helpers and tests.
- Issue list performance can degrade; add indexes on `organizationId`, `teamId`, `statusId`, `assigneeId`, `projectId`, and `updatedAt`.
- Saved view filters can become messy; keep MVP filter schema small and Zod-validated.
- Building too much Linear parity too early will slow beta learning; skip cycles/integrations until core tracker is used.

**Assumptions & Defaults**:

- Product name remains `coret` unless changed later.
- Target customer: startup product-engineering teams.
- Launch mode: free beta, no billing in MVP.
- MVP scope: core tracker only.
- Linear docs are used as product inspiration, especially Issues, Projects, Views, Teams, Triage, and Issue Relations.
- Better Auth organization/team remains the multi-tenant foundation.
