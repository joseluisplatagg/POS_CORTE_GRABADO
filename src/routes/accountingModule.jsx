import { createFileRoute } from '@tanstack/react-router'
import React, { useState , useEffect} from 'react';
import AccountingModule from '../components/pages/Finance/Accountability/AccountingModule';
import { loginUser } from '../api/auth';
import MainLayout from '../components/layouts/MainLayout'
import UserLayout from '../components/layouts/UserLayout'
export const Route = createFileRoute('/accountingModule')({
  component: AccountingModuleRoute,
})

function AccountingModuleRoute() {
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
      <AccountingModule />
    </UserLayout>
  ) : (
    <MainLayout>
      <AccountingModule />
    </MainLayout>
  )
}