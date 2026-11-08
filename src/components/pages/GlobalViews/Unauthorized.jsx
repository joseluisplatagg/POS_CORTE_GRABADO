import { createRoute } from '@tanstack/react-router'
import { Route } from '../routes/__root'



export const unauthorizedRoute = createRoute({
  getParentRoute: () => Route,
  path: '/unauthorized',
  loader: async () => {
    const res = await fetch('https://api.github.com') // Nota: Usa la API, github.com normal devuelve HTML y rompería el .json()
    if (!res.ok) throw new Error('Error al cargar los datos')
    return res.json()
  },
  component: Unauthorized,
})