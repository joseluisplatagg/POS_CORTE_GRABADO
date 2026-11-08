import { Outlet, useLocation } from '@tanstack/react-router'
import {Sidebar} from './Sidebar';
import Footer from './Footer';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const UserLayout = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return ( 
    <div className="min-h-screen flex flex-col justify-between w-full">

      {/* Botón flotante para abrir/cerrar el Sidebar */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-emerald-900 text-white hover:bg-emerald-800 transition-colors shadow-md"
      >
        <FontAwesomeIcon icon={isSidebarOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} className="w-5 h-5" />
      </button>
      
      <div className='flex min-h-screen w-full bg-gray-50/50 overflow-x-hidden relative'>
        
        {/* 1. SIDEBAR COLAPSABLE */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* CONTENEDOR PRINCIPAL: Se desplaza a la derecha en pantallas grandes si el sidebar está abierto */}
        <div className={`flex-1 flex flex-col justify-between min-h-screen min-w-0 transition-all duration-300
            ${isSidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}
        >
          <div className='w-full flex flex-col flex-1'>
            {/* Margen superior extra en el main para que el botón flotante no tape tu contenido */}
            <main className='w-full p-6 md:p-10 pt-16 md:pt-16 max-w-7xl mx-auto flex-1'>
              {children ? children : <Outlet />}  
            </main>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );

};
export default UserLayout;