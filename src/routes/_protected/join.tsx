import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/join')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/join"!</div>
}
