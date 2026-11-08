
import { GenericTable } from '../../../layouts/GenericTable'
import React, { useState, useTransition, useActionState } from 'react';

// Datos simulados de empleados para la vista de RRHH
const INITIAL_EMPLOYEES = [
  { id: 'EMP001', name: 'Ana Martínez', dept: 'Tecnología', status: 'Retardo', timeIn: '09:25 AM', targetIn: '09:00 AM', hours: 7.5, anomaly: 'Retardo de 25 min' },
  { id: 'EMP002', name: 'Carlos Mendoza', dept: 'Operaciones', status: 'Inasistencia', timeIn: '--:--', targetIn: '08:00 AM', hours: 0, anomaly: 'Falta sin justificar' },
  { id: 'EMP003', name: 'Sofía Rodríguez', dept: 'Finanzas', status: 'A Tiempo', timeIn: '08:55 AM', targetIn: '09:00 AM', hours: 8.0, anomaly: 'Ninguna' },
  { id: 'EMP004', name: 'Luis Gerardo', dept: 'Tecnología', status: 'Fichaje Incompleto', timeIn: '09:00 AM', targetIn: '09:00 AM', hours: 4.0, anomaly: 'Olvidó marcar salida' },
];

const INITIAL_BENEFITS = [
  { id: 'BEN001', name: 'Vales de Despensa', type: 'Previsión Social', description: 'Monedero electrónico mensual exento hasta el tope legal de la UMA.', active: true, amount: 2500, isExempt: true },
  { id: 'BEN002', name: 'Fondo de Ahorro', type: 'Prestación Superior', description: 'Aportación duplicada por la empresa (Máximo 13% del sueldo base).', active: true, amount: 3200, isExempt: true },
  { id: 'BEN003', name: 'Seguro de Gastos Médicos (SGMM)', type: 'Seguro', description: 'Cobertura médica mayor para el colaborador y dependientes directos.', active: false, amount: 1800, isExempt: true },
  { id: 'BEN004', name: 'Bono de Productividad Mensual', type: 'Incentivo', description: 'Compensación variable sujeta al cumplimiento de metas de KPI.', active: false, amount: 4500, isExempt: false },
  { id: 'BEN005', name: 'Apoyo para Home Office', type: 'Previsión Social', description: 'Subsidio para el pago de internet y luz según la Ley de Teletrabajo.', active: true, amount: 600, isExempt: false },
];

// Acción de servidor simulada (React v19 Server Action)
async function justifyAbsenceAction(prevState, formData) {
  const employeeId = formData.get('employeeId');
  const reason = formData.get('reason');
  
  // Simular retraso de red de la API
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  if (!reason) {
    return { success: false, error: 'Debes seleccionar una justificación válida.' };
  }
  
  return { success: true, employeeId, message: `Empleado ${employeeId} justificado por: ${reason}` };
}


const EmployeeAttendence = () =>{
    return(
        <div className='w-full flex flex-col gap-2 animate-fade-in text-left'>
        
                    <HRAttendanceModule />
                </div>
    );
}

 function HRAttendanceModule() {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('Todos');
  const [isPendingFilter, startTransition] = useTransition();
  const [selectedEmp, setSelectedEmp] = useState(null);

  // React v19 useActionState para manejar el formulario de justificación
  const [formState, formAction, isSaving] = useActionState(async (prevState, formData) => {
    const result = await justifyAbsenceAction(prevState, formData);
    if (result.success) {
      // Actualizar el estado de forma reactiva tras la acción exitosa
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === result.employeeId
            ? { ...emp, status: 'Justificado', anomaly: 'Justificado por RRHH' }
            : { ...emp }
        )
      );
      setSelectedEmp(null); // Cerrar panel de acción rápida
    }
    return result;
  }, null);

  // Manejo de búsqueda usando useTransition para mantener la UI responsiva
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.id.includes(search);
    const matchesDept = selectedDept === 'Todos' || emp.dept === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans antialiased text-gray-800">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* ENCABEZADO CON EL GRADIENTE SOLICITADO */}
        <header className="bg-linear-to-r from-emerald-950 via-emerald-800 to-cyan-700 px-8 py-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Panel de Control</span>
              <h1 className="text-3xl font-bold tracking-tight mt-0.5">Tiempos e Inasistencias de Personal</h1>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-lg border border-white/10 text-right">
              <p className="text-xs text-emerald-200">Periodo de Nómina Activo</p>
              <p className="font-medium text-sm">Quincena en Curso (Revisión)</p>
            </div>
          </div>
        </header>

        {/* BARRA DE FILTRADO AVANZADO */}
        <section className="p-6 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por nombre o ID de empleado..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-hidden transition-all text-sm"
              />
            </div>
            <select
              value={selectedDept}
              onChange={(e) => startTransition(() => setSelectedDept(e.target.value))}
              className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 shadow-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-hidden text-sm cursor-pointer"
            >
              <option value="Todos">Todos los Departamentos</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Operaciones">Operaciones</option>
              <option value="Finanzas">Finanzas</option>
            </select>
          </div>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-colors shadow-xs">
              Exportar CSV
            </button>
            <button className="bg-emerald-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-900 transition-colors shadow-xs">
              Cierre de Quincena
            </button>
          </div>
        </section>

        {/* CONTENIDO PRINCIPAL: TABLA + ACCIÓN RÁPIDA */}
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200 min-h-[450px]">
          
          {/* TABLA DE ASISTENCIAS */}
          <main className="flex-1 overflow-x-auto">
            {isPendingFilter && (
              <div className="bg-emerald-50 text-emerald-800 px-4 py-1 text-xs text-center animate-pulse">
                Filtrando listado en tiempo real...
              </div>
            )}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-xs font-bold tracking-wider border-b border-gray-200">
                  <th className="py-4 px-6">Empleado</th>
                  <th className="py-4 px-6">Departamento</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6">Entrada Registrada</th>
                  <th className="py-4 px-6">Horas Obj.</th>
                  <th className="py-4 px-6">Anomalías / Alertas</th>
                  <th className="py-4 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-400 font-medium">
                      No se encontraron registros coincidentes.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-900">{emp.name}</div>
                        <div className="text-xs text-gray-500 font-mono">{emp.id}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{emp.dept}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          emp.status === 'A Tiempo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          emp.status === 'Retardo' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          emp.status === 'Justificado' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-mono text-gray-700">{emp.timeIn}</td>
                      <td className="py-4 px-6 font-medium text-gray-900">{emp.hours} hrs</td>
                      <td className="py-4 px-6">
                        <span className={emp.anomaly !== 'Ninguna' && emp.status !== 'Justificado' ? 'text-rose-600 font-medium' : 'text-gray-500'}>
                          {emp.anomaly}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {emp.status !== 'A Tiempo' && emp.status !== 'Justificado' ? (
                          <button
                            onClick={() => setSelectedEmp(emp)}
                            className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-800 hover:text-white px-3 py-1.5 rounded-lg transition-all"
                          >
                            Resolver
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </main>
          {/* PANEL LATERAL DE ACCIÓN RÁPIDA (RECURSOS HUMANOS) */}
          {selectedEmp && (
            <aside className="w-full lg:w-80 bg-gray-50 p-6 flex flex-col justify-between border-t lg:border-t-0 border-gray-200">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-base font-bold text-gray-900">Justificar Incidencia</h3>
                  <button 
                    onClick={() => setSelectedEmp(null)}
                    className="text-gray-400 hover:text-gray-600 text-lg p-1"
                  >
                    ✕
                  </button>
                </div>
                <div className="mb-4 bg-white p-3 rounded-xl border border-gray-200 shadow-xs">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Colaborador</p>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedEmp.name}</p>
                  <p className="text-xs text-rose-600 font-medium mt-1">Problema: {selectedEmp.anomaly}</p>
                </div>

                {/* Formulario que utiliza las nuevas APIs de React v19 Form Actions */}
                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="employeeId" value={selectedEmp.id} />
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Motivo de Autorización
                    </label>
                    <select 
                      name="reason" 
                      required
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm shadow-xs focus:ring-2 focus:ring-emerald-700 outline-hidden"
                    >
                      <option value="">-- Selecciona un motivo --</option>
                      <option value="Incapacidad Médica">Incapacidad Médica</option>
                      <option value="Permiso con Goce de Sueldo">Permiso con Goce de Sueldo</option>
                      <option value="Falla Técnica de Sistema">Falla Técnica de Sistema</option>
                      <option value="Retardo Tolerado/Comisión">Retardo Tolerado/Comisión</option>
                    </select>
                  </div>

                  {formState?.error && (
                    <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-100">
                      {formState.error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full mt-2 bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isSaving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Guardando...
                      </>
                    ) : (
                      'Aplicar Justificación'
                    )}
                  </button>
                </form>
              </div>
              <div className="text-[10px] text-gray-400 text-center mt-6 pt-4 border-t border-gray-200">
                Toda modificación queda registrada en la bitácora de auditoría de RRHH.
              </div>
            </aside>
          )}
        </div>

      </div>
    </div>
  );
}
export default EmployeeAttendence;