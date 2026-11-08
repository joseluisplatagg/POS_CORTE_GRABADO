import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import UserLayout from '../components/layouts/UserLayout'
import HomePage from '../components/pages/Login/HomePage';

export const Route = createFileRoute('/__authenticated')({
  beforeLoad: ({ context }) => {
    // Aquí accedes a tu estado de autenticación (inyectado mediante el router context)
    const isAuthenticated = true; // context.auth.isAuthenticated 

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          // Guarda de dónde venía el usuario para redireccionarlo después
          redirect: window.location.pathname, 
        },
      })
    }
  },
  // Este es el layout donde se renderizarán tus páginas protegidas
  
})

