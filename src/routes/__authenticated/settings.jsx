import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__authenticated/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/__authenticated/settings"!</div>
}
