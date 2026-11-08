import { createFileRoute } from '@tanstack/react-router'
import PricesServicesSettings from '../components/pages/Settings/PricesServicesSettings'
import { useState, useEffect } from 'react';
import { loginUser } from '../api/auth';
import MainLayout from '../components/layouts/MainLayout'
import UserLayout from '../components/layouts/UserLayout'
export const Route = createFileRoute('/priceServicesSettings')({
  component: PricesServicesSettingsRoute,
})

function PricesServicesSettingsRoute() {
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
      <PricesServicesSettings />
    </UserLayout>
  ) : (
    <MainLayout>
      <PricesServicesSettings />
    </MainLayout>
  )
}