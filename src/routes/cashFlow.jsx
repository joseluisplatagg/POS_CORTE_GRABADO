import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { loginUser } from '../api/auth';
import MainLayout from '../components/layouts/MainLayout'
import UserLayout from '../components/layouts/UserLayout'
import CashFlow from '../components/pages/Finance/Accountability/CashFlow'
export const Route = createFileRoute('/cashFlow')({
  component: CashFlowRoute,
})

function CashFlowRoute() {
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
      <CashFlow />
    </UserLayout>
  ) : (
    <MainLayout>
      <CashFlow />
    </MainLayout>
  )
}
