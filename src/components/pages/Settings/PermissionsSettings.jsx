import { useState } from 'react';

const ROLES_PERMISOS_MOCK = [
  {
    id: 'rol-1',
    nombre: 'Administrador',
    descripcion: 'Acceso total a las configuraciones del sistema, reportes y control de personal.',
    updatedAt: '2026-10-19 14:20',
    permisos: {
      usuarios: { leer: true, crear: true, editar: true, eliminar: true },
      precios: { leer: true, crear: true, editar: true, eliminar: true },
      ventas: { leer: true, crear: true, editar: true, eliminar: true },
    }
  },
  {
    id: 'rol-2',
    nombre: 'Supervisor',
    descripcion: 'Acceso limitado a la gestión de usuarios y expedientes, con control total sobre precios y servicios de corte y grabado láser.',
    updatedAt: '2026-10-18 09:45',
    permisos: {
      usuarios: { leer: true, crear: false, editar: false, eliminar: false },
      precios: { leer: true, crear: true, editar: true, eliminar: false },
      ventas: { leer: true, crear: true, editar: true, eliminar: true },
    }
  },
  {
    id: 'rol-3',
    nombre: 'Cajero',
    descripcion: 'Gestión de pagos y cobros, con acceso limitado a información de clientes.',
    updatedAt: '2026-10-15 11:30',
    permisos: {
      usuarios: { leer: true, crear: false, editar: false, eliminar: false },
      precios: { leer: false, crear: false, editar: false, eliminar: false },
      ventas: { leer: true, crear: true, editar: true, eliminar: false },
    }
  }
];

const PermissionsSettings = () => {
  // Estados para controlar qué rol está activo y si se están editando sus permisos
  const [rolSeleccionado, setRolSeleccionado] = useState(ROLES_PERMISOS_MOCK[0]);
  const [esEdicion, setEsEdicion] = useState(false);

  return (
    <div className='w-full flex flex-col gap-6 animate-fade-in text-left'>
      
      {/* ENCABEZADO PRINCIPAL */}
      <div className='w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='flex flex-col gap-0.5'>
          <h2 className='text-base font-black text-gray-900 tracking-tight'>Roles y Permisos</h2>
          <p className='text-2xs font-bold text-gray-400 uppercase tracking-wider'>Seguridad y Niveles de Acceso</p>
        </div>
      </div>

      {/* 💻 CONTENEDOR BICOLUMNA */}
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full'>
        
        {/* 🔑 LADO IZQUIERDO: SELECCIÓN DE ROLES (Ocupa 4 de 12 columnas) */}
        <div className='lg:col-span-4 flex flex-col gap-3 w-full'>
          <span className='text-2xs font-bold text-gray-400 uppercase tracking-wider px-1'>Roles Disponibles</span>
          
          <div className='flex flex-col gap-2.5 w-full'>
            {ROLES_PERMISOS_MOCK.map((rol) => (
              <button
                key={rol.id}
                type="button"
                onClick={() => {
                  setRolSeleccionado(rol);
                  setEsEdicion(false);
                }}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-1.5
                  ${rolSeleccionado?.id === rol.id 
                    ? 'bg-emerald-900 border-emerald-900 text-white shadow-sm shadow-emerald-950/20' 
                    : 'bg-white border-gray-100 text-gray-700 hover:border-emerald-200 hover:bg-emerald-50/10'
                  }`}
              >
                <div className='flex justify-between items-center w-full'>
                  <span className={`text-xs font-bold ${rolSeleccionado?.id === rol.id ? 'text-white' : 'text-gray-900'}`}>
                    {rol.nombre}
                  </span>
                  <span className={`text-[9px] font-mono ${rolSeleccionado?.id === rol.id ? 'text-emerald-200' : 'text-gray-400'}`}>
                    {rol.id}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed font-medium ${rolSeleccionado?.id === rol.id ? 'text-emerald-100/80' : 'text-gray-400'}`}>
                  {rol.descripcion}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 📊 LADO DERECHO: MATRIZ DE PERMISOS POR MÓDULO (Ocupa 8 de 12 columnas) */}
        <div className='lg:col-span-8 w-full'>
          {rolSeleccionado ? (
            <div className='bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col gap-6 w-full'>
              
              {/* Encabezado del Panel de Control */}
              <div className='flex items-center justify-between border-b border-gray-50 pb-3 w-full'>
                <div className='flex flex-col gap-0.5'>
                  <span className='text-[10px] text-emerald-900 font-bold uppercase tracking-wider'>Configuración de Seguridad</span>
                  <h3 className='text-sm font-black text-gray-900'>Permisos asignados a: {rolSeleccionado.nombre}</h3>
                </div>
                {!esEdicion && (
                  <button 
                    onClick={() => setEsEdicion(true)}
                    className='text-[11px] font-bold text-emerald-900 hover:text-emerald-800 transition-colors cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100/50'
                  >
                    ⚙️ Modificar Matriz
                  </button>
                )}
              </div>

              {/* 🛡️ TABLA MATRIZ DE PERMISOS */}
              <div className='overflow-x-auto w-full border border-gray-100 rounded-xl shadow-3xs'>
                <table className='w-full border-collapse text-left bg-white'>
                  <thead>
                    <tr className='bg-gray-50/70 border-b border-gray-100 text-2xs font-bold text-gray-400 uppercase tracking-wider'>
                      <th className='p-4 font-black text-gray-500'>Módulo del Sistema</th>
                      <th className='p-4 text-center'>Leer</th>
                      <th className='p-4 text-center'>Crear</th>
                      <th className='p-4 text-center'>Editar</th>
                      <th className='p-4 text-center'>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-50 text-xs font-semibold text-gray-600'>
                    {Object.entries(rolSeleccionado.permisos).map(([modulo, acciones]) => (
                      <tr key={modulo} className='hover:bg-gray-50/40 transition-colors'>
                        {/* Nombre del Módulo */}
                        <td className='p-4 font-bold text-gray-800 capitalize flex flex-col gap-0.5'>
                          <span>{modulo}</span>
                          <span className='text-[10px] text-gray-400 font-normal font-mono'>/api/v1/{modulo}</span>
                        </td>

                        {/* Mapeo Dinámico de Checkboxes / Estados */}
                        {Object.entries(acciones).map(([accion, valor]) => (
                          <td key={accion} className='p-4 text-center' onClick={(e) => e.stopPropagation()}>
                            <div className='flex justify-center items-center'>
                              <input 
                                type="checkbox" 
                                disabled={!esEdicion}
                                checked={valor}
                                onChange={(e) => {
                                  // Lógica de actualización del estado local de la matriz
                                  const nuevosPermisos = { ...rolSeleccionado.permisos };
                                  nuevosPermisos[modulo][accion] = e.target.checked;
                                  setRolSeleccionado({ ...rolSeleccionado, permisos: nuevosPermisos });
                                }}
                                className='w-4 h-4 rounded text-emerald-900 border-gray-300 focus:ring-emerald-500 focus:ring-2 accent-emerald-900 disabled:opacity-75 disabled:cursor-not-allowed transition-all'
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

               {/* 🔒 SECCIÓN DE AUDITORÍA Y CONTROL DE FECHAS */}
              <div className='bg-gray-50 border border-gray-100/60 p-3 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] font-medium text-gray-500 w-full'>
                <div className='flex items-center gap-1.5'>
                  <span>🛡️</span>
                  <span>Seguridad de Endpoints verificada en PostgreSQL</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span>Última modificación de permisos:</span>
                  <span className='font-bold text-emerald-900 font-mono'>{rolSeleccionado.updatedAt}</span>
                </div>
              </div>

              {/* 🔘 BOTONERA DE ACCIÓN OPERACIONAL */}
              {esEdicion && (
                <div className='flex gap-3 w-full justify-end pt-2 border-t border-gray-50'>
                  <button 
                    type="button"
                    onClick={() => setEsEdicion(false)}
                    className='px-5 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl text-xs font-bold transition-colors cursor-pointer'
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      console.log("Enviando nueva matriz de permisos a la base de datos:", rolSeleccionado);
                      setEsEdicion(false);
                    }}
                    className='bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer'
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className='bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-center text-xs text-gray-400 italic w-full'>
              Selecciona un rol del listado izquierdo para auditar sus accesos.
            </div>
          )}
        </div> {/* Fin de lg:col-span-8 */}

      </div> {/* Fin del contenedor bicolumna */}
    </div> // Fin del return principal
  );
}

export default PermissionsSettings;