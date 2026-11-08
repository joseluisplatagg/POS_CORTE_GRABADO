import { createFileRoute } from '@tanstack/react-router'
import Register from '../../components/pages/Login/Register'

export const Route = createFileRoute('/__public/register')({
  loader: async () => {
    const res = await fetch('https://api.github.com') 
    if (!res.ok) throw new Error('Error al cargar los datos')
    return res.json()
  },
  component: Register,
})
