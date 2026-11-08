import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faUsers, faMobile, faPenToSquare,  faCirclePlus,
  faArrowsRotate,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';

// Datos Mock iniciales de Usuarios de la Base de Datos
const USUARIOS_MOCK = [
  { id: 1, firstname: 'Carlos', lastname: 'Mendoza', numeroCelular: '5512345678', createdAt: '2026-01-10 14:32', updatedAt: '2026-10-15 09:11', rol: 'Cajero', estado: 'activo' },
  { id: 2, firstname: 'Ana', lastname: 'López Torres', numeroCelular: '5598765432', createdAt: '2026-03-22 11:05', updatedAt: '2026-10-12 16:45', rol: 'Supervisor', estado: 'activo' },
  { id: 3, firstname: 'Sofía', lastname: 'Ríos Benítez', numeroCelular: '5544332211', createdAt: '2026-05-14 08:20', updatedAt: '2026-09-28 10:00', rol: 'Cajero', estado: 'inactivo' },
  { id: 4, firstname: 'Elena', lastname: 'Gómez', numeroCelular: '5566778899', createdAt: '2026-02-18 17:40', updatedAt: '2026-10-19 12:30', rol: 'Administrador', estado: 'activo' },
];

const UsersSettings = () => {
  const [busqueda, setBusqueda] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(USUARIOS_MOCK[0]);
  const [esEdicion, setEsEdicion] = useState(false);

  // Filtrado de usuarios en tiempo real por Nombre, Apellido o Celular
  const usuariosFiltrados = useMemo(() => {
    return USUARIOS_MOCK.filter(user => 
      user.firstname.toLowerCase().includes(busqueda.toLowerCase()) ||
      user.lastname.toLowerCase().includes(busqueda.toLowerCase()) ||
      user.numeroCelular.includes(busqueda)
    );
  }, [busqueda]);

  // Manejador para abrir formulario vacío de creación
  const handleNuevoUsuario = () => {
    setUsuarioSeleccionado({ firstname: '', lastname: '', numeroCelular: '', rol: 'Paciente', estado: 'activo' });
    setEsEdicion(true);
  };

 return (
    <div className='w-full flex flex-col gap-6 animate-fade-in text-left'>
      
      {/* 1. BARRA SUPERIOR DE CONTROLES */}
      <div className='w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='flex flex-col gap-0.5'>
          <h2 className='text-base font-black text-gray-900 tracking-tight'>
            <FontAwesomeIcon className='pr-2 text-xl text-cyan-800'  icon={faUsers} />
            Control de Usuarios</h2>
          <p className='text-2xs font-bold text-gray-400 uppercase tracking-wider'>Gestión de Accesos y Cuentas</p>
        </div>
        
        <div className='w-full sm:w-auto flex items-center gap-3 self-stretch sm:self-auto'>
          <div className='relative flex-1 sm:w-64'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-xs'>
              <FontAwesomeIcon className='pr-2 text-xl text-cyan-800'  icon={faMagnifyingGlass} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar por nombre o celular..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className='w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
            />
          </div>
          <button 
            onClick={handleNuevoUsuario}
            className='bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer whitespace-nowrap'
          >
            <FontAwesomeIcon className='pr-2 text-xs text-white'  icon={faCirclePlus} />
             Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Aquí abriremos la grilla bicolumna en el siguiente paso */}
      <div className='text-xs text-gray-400 font-bold uppercase'></div>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full'>
        
        {/* 📋 LADO IZQUIERDO: TABLA DE USUARIOS (Ocupa 7 de 12 columnas) */}
        <div className='lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden'>
          <div className='overflow-x-auto w-full'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-gray-50/70 border-b border-gray-100 text-2xs font-bold text-gray-400 uppercase tracking-wider'>
                  <th className='p-4'>Usuario / Celular</th>
                  <th className='p-4 hidden sm:table-cell'>Rol</th>
                  <th className='p-4'>Estado</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50 text-xs font-semibold text-gray-600'>
                {usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((user) => (
                    <tr 
                      key={user.id} 
                      onClick={() => {
                        setUsuarioSeleccionado(user);
                        setEsEdicion(false);
                      }}
                      className={`hover:bg-emerald-50/20 transition-colors cursor-pointer
                        ${usuarioSeleccionado?.id === user.id ? 'bg-emerald-50/40' : ''}
                      `}
                    >
                      <td className='p-4 flex flex-col gap-0.5'>
                        <span className='text-gray-900 font-bold'>{user.firstname} {user.lastname}</span>
                        <span className='text-gray-400 font-medium text-[11px]'>
                          <FontAwesomeIcon className='pr-2 text-xs text-emerald-800'  icon={faMobile} />
                           {user.numeroCelular}</span>
                      </td>
                      <td className='p-4 hidden sm:table-cell font-medium text-gray-500'>
                        {user.rol}
                      </td>
                      <td className='p-4'>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border
                          ${user.estado === 'activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-200'}
                        `}>
                          {user.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className='p-8 text-center text-gray-400 italic font-medium'>
                      No se encontraron usuarios activos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🧩 PASO 3: Aquí colocaremos el formulario del lado derecho */}
        <div className='lg:col-span-5 text-xs text-gray-400 font-bold uppercase p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-center'>
          {/* 📑 LADO DERECHO: FORMULARIO Y TIEMPOS DE AUDITORÍA (Ocupa 5 de 12 columnas) */}
        <div className='lg:col-span-5'>
          {usuarioSeleccionado ? (
            <div className='bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col gap-5'>
              
              {/* Encabezado Dinámico de la Tarjeta */}
              <div className='flex items-center justify-between border-b border-gray-50 pb-3'>
                <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                  {esEdicion ? (usuarioSeleccionado.id ? 'Modificar Perfil' : 'Alta de Usuario') : 'Información de Cuenta'}
                </h3>
                {!esEdicion && (
                  <button 
                    onClick={() => setEsEdicion(true)}
                    className='text-[11px] font-bold text-emerald-900 hover:text-emerald-800 transition-colors cursor-pointer'
                  >
                  <FontAwesomeIcon className='pr-2 text-xs text-emerald-800'  icon={faPenToSquare} />
                   Editar
                  </button>
                )}
              </div>

              {/* Formulario Inputs */}
              <div className='flex flex-col gap-4 text-xs font-semibold'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-2xs text-gray-400 uppercase tracking-wider font-bold'>First Name</label>
                    <input 
                      type="text" 
                      disabled={!esEdicion}
                      value={usuarioSeleccionado.firstname || ''}
                      onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, firstname: e.target.value})}
                      className='w-full p-2.5 bg-gray-50 disabled:bg-gray-50/40 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-2xs text-gray-400 uppercase tracking-wider font-bold'>Last Name</label>
                    <input 
                      type="text" 
                      disabled={!esEdicion}
                      value={usuarioSeleccionado.lastname || ''}
                      onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, lastname: e.target.value})}
                      className='w-full p-2.5 bg-gray-50 disabled:bg-gray-50/40 border border-gray-200 rounded-xl font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-1'>
                  <label className='text-2xs text-gray-400 uppercase tracking-wider font-bold'>Número Celular</label>
                  <input 
                    type="text" 
                    disabled={!esEdicion}
                    value={usuarioSeleccionado.numeroCelular || ''}
                    onChange={(e) => setUsuarioSeleccionado({...usuarioSeleccionado, numeroCelular: e.target.value})}
                    className='w-full p-2.5 bg-gray-50 disabled:bg-gray-50/40 border border-gray-200 rounded-xl font-mono font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                  />
                </div>

                {/* 🔒 SECCIÓN DE AUDITORÍA (Campos de Creación y Actualización) */}
                {usuarioSeleccionado.id && (
                  <div className='bg-gray-50 border border-gray-100/60 p-3 rounded-xl flex flex-col gap-2 mt-1 text-[11px] font-medium text-gray-500'>
                    <div className='flex justify-between items-center'>
                      <span>
                        <FontAwesomeIcon className='pr-2 text-xs text-emerald-800'  icon={faCalendarDays} />
                         Fecha creación:</span>
                      <span className='font-bold text-gray-700 font-mono'>{usuarioSeleccionado.createdAt}</span>
                    </div>
                    <div className='flex justify-between items-center border-t border-gray-200/50 pt-1.5'>
                      <span>
                        <FontAwesomeIcon className='pr-2 text-xs text-emerald-800'  icon={faArrowsRotate} />
                         Última actualización:</span>
                      <span className='font-bold text-emerald-900 font-mono'>{usuarioSeleccionado.updatedAt}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botonera Operacional */}
              {esEdicion && (
                <div className='flex gap-2 w-full pt-2 border-t border-gray-50'>
                  <button 
                    onClick={() => setEsEdicion(false)}
                    className='flex-1 py-2 px-3 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors cursor-pointer text-center'
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      console.log("Guardando datos en PostgreSQL:", usuarioSeleccionado);
                      setEsEdicion(false);
                    }}
                    className='flex-1 bg-emerald-900 hover:bg-emerald-800 text-white py-2 px-3 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer text-center'
                  >
                    Guardar
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className='bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-center text-xs text-gray-400 italic'>
              Selecciona un usuario del listado para ver su información.
            </div>
          )}
        </div>
        </div>

      </div> {/* Fin del contenedor bicolumna */}
    </div> // Fin del return principal
    
  );
}

export default UsersSettings;