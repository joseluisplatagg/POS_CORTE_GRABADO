
import { GenericTable } from '../../../layouts/GenericTable'
// 1. Catálogo inicial de roles y sus permisos detallados por módulos
const ROLES_PERMISOS_MOCK = [
  {
    id: 'rol-1',
    nombre: 'Administrador',
    descripcion: 'Acceso total a las configuraciones del sistema, reportes y control de personal.',
    updatedAt: '2026-10-19 14:20',
    permisos: {
      usuarios: { leer: true, crear: true, editar: true, eliminar: true },
      expedientes: { leer: true, crear: true, editar: true, eliminar: true },
      citas: { leer: true, crear: true, editar: true, eliminar: true },
    }
  },
  {
    id: 'rol-2',
    nombre: 'Médico',
    descripcion: 'Lectura y edición de expedientes clínicos y control de su agenda de citas.',
    updatedAt: '2026-10-18 09:45',
    permisos: {
      usuarios: { leer: true, crear: false, editar: false, eliminar: false },
      expedientes: { leer: true, crear: true, editar: true, eliminar: false },
      citas: { leer: true, crear: true, editar: true, eliminar: true },
    }
  },
  {
    id: 'rol-3',
    nombre: 'Recepcionista',
    descripcion: 'Gestión exclusiva de asignación de citas y lectura básica de datos de contacto.',
    updatedAt: '2026-10-15 11:30',
    permisos: {
      usuarios: { leer: true, crear: false, editar: false, eliminar: false },
      expedientes: { leer: false, crear: false, editar: false, eliminar: false },
      citas: { leer: true, crear: true, editar: true, eliminar: false },
    }
  }
];

const COLUMNAS_MOCK = [
  { accessorKey: 'id', header: 'id' },
  { accessorKey: 'nombre', header: 'nombre' },
  { accessorKey: 'descripcion', header: 'descripcion' },
  { accessorKey: 'updatedAt', header: 'updatedAt' }
]


const EmployeeFiles = () =>{
    return(
      <div className="min-h-screen bg-gray-50 p-6 font-sans antialiased text-gray-800">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* ENCABEZADO CON EL GRADIENTE SOLICITADO */}
        <header className="bg-linear-to-r from-emerald-950 via-emerald-800 to-cyan-700 px-8 py-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Panel de Control</span>
              <h1 className="text-3xl font-bold tracking-tight mt-0.5">Plantilla de Colaboradores</h1>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-lg border border-white/10 text-right">
              <p className="text-xs text-emerald-200">Periodo de Nómina Activo</p>
              <p className="font-medium text-sm">Quincena en Curso (Revisión)</p>
            </div>
          </div>
        </header>

        {/* BARRA DE FILTRADO AVANZADO */}
        <section className="p-6 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <GenericTable data={ROLES_PERMISOS_MOCK} columns={COLUMNAS_MOCK} isEditable={true}/>
        </section>

        

      </div>
    </div>
    );
}

export default EmployeeFiles;