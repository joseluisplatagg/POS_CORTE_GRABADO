import { createFileRoute } from '@tanstack/react-router'
import ForgotPassword from '../../components/pages/Login/ForgotPassword'

export const Route = createFileRoute('/__public/forgotPassword')({
  loader: async () => {
    const res = await fetch('https://api.github.com') 
    if (!res.ok) throw new Error('Error al cargar los datos')
    return res.json()
  },
  component: ForgotPassword,
})
