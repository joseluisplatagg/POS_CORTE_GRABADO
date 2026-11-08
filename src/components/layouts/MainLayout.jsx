
import { Outlet, useLocation } from '@tanstack/react-router'
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  const location = useLocation();

  return ( 
    // Min-h-screen obliga a la app a medir toda la pantalla
    <div className="min-h-screen flex flex-col justify-between w-full">
      
      {/* PARTE SUPERIOR */}
      <div className="w-full flex flex-col flex-1">
        <Header />
        
        {/* El contenido dinámico va aquí adentro */}
        <main className="w-full flex-1">       
          <Outlet />     
        </main>
      </div>

      {/* PARTE INFERIOR: El footer vive libre aquí abajo, al 100% de ancho */}
      <Footer />
      
    </div>
  )

};
export default MainLayout;