import { createFileRoute } from '@tanstack/react-router'
import Login from '../../components/pages/Login/Login'

export const Route = createFileRoute('/__public/login')({
  loader: async () => {
    const res = await fetch('https://api.github.com') 
    if (!res.ok) throw new Error('Error al cargar los datos')
    return res.json()
  },
  component: Login,
})
