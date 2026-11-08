import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { loginUser } from '../api/auth';
import MainLayout from '../components/layouts/MainLayout'
import UserLayout from '../components/layouts/UserLayout'
import EmployeeAttendece from '../components/pages/HumanResources/Employee/EmployeeAttendence'
export const Route = createFileRoute('/employeeAttendence')({
  component: EmployeeAttendeceRoute,
})

function EmployeeAttendeceRoute() {
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
      <EmployeeAttendece />
    </UserLayout>
  ) : (
    <MainLayout>
      <EmployeeAttendece />
    </MainLayout>
  )
}

