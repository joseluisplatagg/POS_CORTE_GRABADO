import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { loginUser } from '../api/auth';
import MainLayout from '../components/layouts/MainLayout'
import UserLayout from '../components/layouts/UserLayout'
import SalidaInventarioForm from '../components/pages/Inventory/SalidaInventarioForm'
export const Route = createFileRoute('/inventoryOutput')({
  component: InventoryOutputRoute,
})

function InventoryOutputRoute() {
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
      <SalidaInventarioForm />
    </UserLayout>
  ) : (
    <MainLayout>
      <SalidaInventarioForm />
    </MainLayout>
  )
}
