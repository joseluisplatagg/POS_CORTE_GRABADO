import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard"!</div>
}
