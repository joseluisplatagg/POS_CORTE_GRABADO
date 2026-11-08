import { createFileRoute, redirect } from '@tanstack/react-router'
import UserLayout from '../components/layouts/UserLayout'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // -> HomePagePrincipal
    throw redirect({ to: '/login' })
    },
  component: UserLayout, 
})