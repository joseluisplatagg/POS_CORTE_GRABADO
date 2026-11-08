// src/routes/__root.jsx
import { createRootRoute, createRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => <Outlet />,
})