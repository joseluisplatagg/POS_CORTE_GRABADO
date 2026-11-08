import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { loginUser } from '../api/auth';
import MainLayout from '../components/layouts/MainLayout'
import UserLayout from '../components/layouts/UserLayout'
import PurchasesHistory from '../components/pages/Purchases/PurchasesHistory'
export const Route = createFileRoute('/purchasesHistory')({
  component: PurchasesHistoryRoute,
})

function PurchasesHistoryRoute() {
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
      <PurchasesHistory />
    </UserLayout>
  ) : (
    <MainLayout>
      <PurchasesHistory />
    </MainLayout>
  )
}