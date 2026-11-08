import { Link, Navigate, useNavigate,Outlet, useLocation } from '@tanstack/react-router';
import React, { useState } from 'react';
import { useMutation, useQueryClient,useQuery  } from '@tanstack/react-query';
import { useLogin } from '../../../hooks/useLogin';
import Title from '../../layouts/Title';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sidebar} from '../../layouts/Sidebar';
import Footer from '../../layouts/Footer';

const HomePage = () =>{
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const navigate = useNavigate();
    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: useLogin,
        // La función de consulta es opcional aquí si sabes que los datos ya estarán en caché
        // o si tienes una función de "fetchUser" en caso de que el token exista pero no la caché.
        // En este caso, simplemente usamos los datos de la caché si existen.
    });
    console.log("home",isError);
    
    return(
       <>
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

      {/* CONTENEDOR PRINCIPAL */}
      <div className={`flex-1 flex flex-col justify-between min-h-screen min-w-0 transition-all duration-300 bg-radial-[at_25%_25%] from-white to-orange-700/10 to-75%
          ${isSidebarOpen ? 'md:pl-64' : 'md:pl-0'}`}
      >
        <div className='w-full flex flex-col flex-1'>
          
          <main className='w-full p-6 md:p-10 pt-20 md:pt-16 max-w-7xl mx-auto flex-1 flex flex-col gap-8'>
            
            {/* 🌟 ENCABEZADO DE BIENVENIDA */}
            <div className='flex flex-col gap-1'>
              <h1 className='text-2xl font-black text-gray-900 tracking-tight'>
                ¡Bienvenida de vuelta! 👋
              </h1>
              <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                Service Sucursal Corte y grabado láser - Panel de Control
              </p>
            </div>

            {/* 📰 SECCIÓN DE NOTICIAS E IMÁGENES (BICOLUMNA) */}
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 w-full'>
              
              {/* COLUMNA IZQUIERDA: NOTICIAS Y AVISOS (Ocupa 7 de 12 columnas) */}
              <div className='lg:col-span-7 flex flex-col gap-4'>
                <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider px-1'>
                  Valor Actual
                </h3>
                
                <div className='flex flex-col gap-3'>
                  {/* Nota 1 */}
                  <div className='bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex gap-3.5 items-start'>
                    <div className='p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-sm shrink-0'>
                      12.5 K
                    </div>
                    <div className='flex flex-col gap-1 text-left'>
                      <h4 className='text-xs font-bold text-gray-800'>Inventario </h4>
                      <p className='text-[11px] font-semibold text-gray-500 leading-relaxed'>
                        Valor de los artículos que se encuentran en el inventario y que están disponibles para su uso o venta.
                      </p>
                    </div>
                  </div>

                  {/* Nota 2 */}
                  <div className='bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex gap-3.5 items-start'>
                    <div className='p-2.5 bg-emerald-50 text-emerald-900 rounded-xl text-sm shrink-0'>
                      14.5 K
                    </div>
                    <div className='flex flex-col gap-1 text-left'>
                      <h4 className='text-xs font-bold text-gray-800'> Ventas</h4>
                      <p className='text-[11px] font-semibold text-gray-500 leading-relaxed'>
                        Monto total de ventas al dia de hoy, incluyendo ventas en efectivo y ventas a crédito.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA: IMÁGENES / BANNERS (Ocupa 5 de 12 columnas) */}
              <div className='lg:col-span-5 flex flex-col gap-4'>
                <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider px-1'>
                  Utilidad
                </h3>
                
                <div className='w-full h-full min-h-[180px] bg-linear-to-br from-emerald-900 to-purple-950 rounded-2xl border border-emerald-950 p-6 flex flex-col justify-end text-left relative overflow-hidden shadow-sm group'>
                  {/* Efecto decorativo de fondo */}
                  <div className='absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all duration-300' />
                  <span className='mx-auto md:ml-20 text-xl font-bold bg-emerald-800 text-white backdrop-blur-md px-2.5 py-1 rounded-full self-center md:self-start mb-2 uppercase tracking-wide'> 
                    $ 100,000.00 
                  </span>
                  <span className='text-2xs font-bold bg-white/20 text-white backdrop-blur-md px-2.5 py-1 rounded-full self-start mb-2 uppercase tracking-wide'>
                    Valor actual utilidad - NOV 2026
                  </span>
                  <h4 className='text-sm font-bold text-white mb-1'>Monto actual que se paga por la plantilla de los colaboradores.</h4>
                  <p className='text-[11px] font-medium text-emerald-100/80 leading-snug'>
                    Recuerda realizar la nómina, el pago de impuestos y las bajas
                  </p>
                </div>
              </div>

            </div>

            {/* 🧩 SECCIÓN DINÁMICA DE LAS PÁGINAS HIJAS */}
            {/* Aquí abajo es donde se inyectará tu /reservation u otras vistas cuando navegues */}
            <div className="w-full border-t border-gray-100 pt-4 bg-radial-[at_25%_25%] from-white to-orange-700/10 to-75%">
              <Outlet />
            </div>

          </main>

        </div>
        <Footer />
      </div>
    </div>
  </>
    );
}

export default HomePage;