import { createFileRoute } from '@tanstack/react-router'
import HomePage from '../../components/pages/Login/HomePage'

export const Route = createFileRoute('/__authenticated/homePage')({
  component: HomePage,
})
