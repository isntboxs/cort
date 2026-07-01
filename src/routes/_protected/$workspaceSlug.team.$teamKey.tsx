import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/$workspaceSlug/team/$teamKey',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/$workspaceSlug/team/$teamKey"!</div>
}
