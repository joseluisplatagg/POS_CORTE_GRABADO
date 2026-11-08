import { createFileRoute, Outlet } from '@tanstack/react-router'
import MainLayout from '../components/layouts/MainLayout'

export const Route = createFileRoute('/__public')({
  component: MainLayout,
})