import { createFileRoute } from '@tanstack/react-router'
import TimeAttendenceSettings from '../components/pages/Settings/TimeAttendenceSettings'
import { useState, useEffect } from 'react';
import { loginUser } from '../api/auth';
import MainLayout from '../components/layouts/MainLayout'
import UserLayout from '../components/layouts/UserLayout'

export const Route = createFileRoute('/timeAttendenceSettings')({
  component: TimeAttendenceSettingsRoute,
})

function TimeAttendenceSettingsRoute() {
  const [ isAuthenticate, setIsAuthenticate] = useState(false);

  useEffect(() =>{
    loginUser().then((isAuth) => {
    setIsAuthenticate(isAuth)
    });
  },[])

  
  if (isAuthenticate === null || isAuthenticate === false) {
    return <div>Cargando verificación...</div> 
  }
    
  // Reutilizas el mismo componente <ReservationComponent />, 
  // pero lo envuelves en el template que corresponda:
  return isAuthenticate ? (
    <UserLayout>
      <TimeAttendenceSettings />
    </UserLayout>
  ) : (
    <MainLayout>
      <TimeAttendenceSettings />
    </MainLayout>
  )
}