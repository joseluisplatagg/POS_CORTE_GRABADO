import React, { useState, useTransition, useActionState } from 'react';

// Catálogo maestro de prestaciones y beneficios con su estatus fiscal inicial
const INITIAL_BENEFITS = [
  { id: 'BEN001', name: 'Vales de Despensa', type: 'Previsión Social', description: 'Monedero electrónico mensual exento hasta el tope legal de la UMA.', active: true, amount: 2500, isExempt: true },
  { id: 'BEN002', name: 'Fondo de Ahorro', type: 'Prestación Superior', description: 'Aportación duplicada por la empresa (Máximo 13% del sueldo base).', active: true, amount: 3200, isExempt: true },
  { id: 'BEN003', name: 'Seguro de Gastos Médicos (SGMM)', type: 'Seguro', description: 'Cobertura médica mayor para el colaborador y dependientes directos.', active: false, amount: 1800, isExempt: true },
  { id: 'BEN004', name: 'Bono de Productividad Mensual', type: 'Incentivo', description: 'Compensación variable sujeta al cumplimiento de metas de KPI.', active: false, amount: 4500, isExempt: false },
  { id: 'BEN005', name: 'Apoyo para Home Office', type: 'Previsión Social', description: 'Subsidio para el pago de internet y luz según la Ley de Teletrabajo.', active: true, amount: 600, isExempt: false },
];

// Acción de simulación fiscal (React v19 Server Action)
async function updateBenefitStatusAction(prevState, formData) {
  const benefitId = formData.get('benefitId');
  const nextState = formData.get('nextState') === 'true';

  // Simular retraso de procesamiento contable en la API
  await new Promise((resolve) => setTimeout(resolve, 400));

  return { success: true, benefitId, nextState };
}

const Benefits = () =>{

        const [benefits, setBenefits] = useState(INITIAL_BENEFITS);
  const [filterType, setFilterType] = useState('Todos');
  const [isPendingFilter, startTransition] = useTransition();

  // React v19 useActionState para gestionar el guardado y recálculo fiscal de fondo
  const [formState, formAction, isUpdating] = useActionState(async (prevState, formData) => {
    const result = await updateBenefitStatusAction(prevState, formData);
    if (result.success) {
      setBenefits((prev) =>
        prev.map((b) => (b.id === result.benefitId ? { ...b, active: result.nextState } : b))
      );
    }
    return result;
  }, null);

  // Filtrado optimizado con useTransition
  const handleFilterChange = (type) => {
    startTransition(() => {
      setFilterType(type);
    });
  };

  const filteredBenefits = benefits.filter(
    (b) => filterType === 'Todos' || b.type === filterType
  );

  // Cálculos financieros en tiempo real de la bolsa de beneficios
  const totalAllocated = benefits.filter((b) => b.active).reduce((sum, b) => sum + b.amount, 0);
  const totalExempt = benefits.filter((b) => b.active && b.isExempt).reduce((sum, b) => sum + b.amount, 0);
  const totalTaxable = benefits.filter((b) => b.active && !b.isExempt).reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans antialiased text-gray-800">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* ENCABEZADO CON GRADIENTE COHERENTE */}
        <header className="bg-linear-to-r from-emerald-950 via-emerald-800 to-cyan-700 px-8 py-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Estructura de Compensaciones</span>
              <h1 className="text-3xl font-bold tracking-tight mt-0.5">Beneficios y Previsión Social</h1>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-lg border border-white/10 text-right">
              <p className="text-xs text-emerald-200">Presupuesto Mensual Integrado</p>
              <p className="font-mono font-bold text-lg">${totalAllocated.toLocaleString('es-MX')} MXN</p>
            </div>
          </div>
        </header>

        {/* CONTENIDO EN DOS COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          
          {/* PANEL IZQUIERDO: CATÁLOGO Y SWITCHES (8 DE 12 COLUMNAS) */}
          <main className="p-8 lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Catálogo de Paquetes Activos</h2>
                <p className="text-xs text-gray-500">Enciende o apaga las prestaciones globales de la plantilla.</p>
              </div>
              
              {/* Filtros rápidos por Tipo */}
              <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-medium self-start sm:self-center">
                {['Todos', 'Previsión Social', 'Prestación Superior', 'Incentivo'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleFilterChange(type)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      filterType === type 
                        ? 'bg-white text-emerald-950 shadow-2xs font-semibold' 
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {type === 'Todos' ? 'Todos' : type.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {isPendingFilter && (
              <p className="text-xs text-emerald-700 animate-pulse bg-emerald-50 p-2 rounded-lg text-center font-medium">
                Actualizando catálogo...
              </p>
            )}

            {/* LISTA DE TARJETAS DE BENEFICIOS */}
            <div className="space-y-4">
              {filteredBenefits.map((benefit) => (
                <div 
                  key={benefit.id} 
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    benefit.active 
                      ? 'bg-white border-emerald-200 shadow-2xs' 
                      : 'bg-gray-50/50 border-gray-200 opacity-70'
                  }`}
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-sm">{benefit.name}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide border ${
                        benefit.isExempt 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {benefit.isExempt ? 'Exento ISR' : 'Gravable'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    <div className="text-right">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">Monto Est.</span>
                      <span className="font-mono text-sm font-bold text-gray-900">${benefit.amount.toLocaleString()}</span>
                    </div>

                    {/* FORMULARIO DE ACCIÓN DE RECONEXIÓN CON REACT v19 ACTIONS */}
                    <form action={formAction}>
                      <input type="hidden" name="benefitId" value={benefit.id} />
                      <input type="hidden" name="nextState" value={!benefit.active} />
                      
                      {/* INTERRUPTOR (SWITCH) ESTILIZADO CON TAILWIND */}
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-emerald-700 ${
                          benefit.active ? 'bg-emerald-800' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            benefit.active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* PANEL DERECHO: MEDIDORES DE BALANCE FISCAL (4 DE 12 COLUMNAS) */}
          <aside className="p-8 lg:col-span-4 bg-gray-50 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Análisis e Impacto Fiscal</h3>
                <p className="text-xs text-gray-500">Distribución de exenciones aplicadas para la deducción corporativa.</p>
              </div>

              {/* Indicadores numéricos resumidos */}
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-3xs">
                  <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                    <span>Bolsa Exenta (ISR)</span>
                    <span className="text-emerald-700 font-mono">
                      {totalAllocated > 0 ? ((totalExempt / totalAllocated) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <p className="text-xl font-extrabold text-emerald-950 font-mono">${totalExempt.toLocaleString()}</p>
                  
                  {/* Barra de Progreso Interna */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                    <div 
                      style={{ width: `${totalAllocated > 0 ? (totalExempt / totalAllocated) * 100 : 0}%` }} 
                      className="bg-emerald-700 h-full transition-all duration-300"
                    ></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-3xs">
                  <div className="flex justify-between items-center text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                    <span>Bolsa Gravable (ISR)</span>
                    <span className="text-amber-700 font-mono">
                      {totalAllocated > 0 ? ((totalTaxable / totalAllocated) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900 font-mono">${totalTaxable.toLocaleString()}</p>
                  
                  {/* Barra de Progreso Interna */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                    <div 
                      style={{ width: `${totalAllocated > 0 ? (totalTaxable / totalAllocated) * 100 : 0}%` }} 
                      className="bg-amber-600 h-full transition-all duration-300"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Nota informativa de topes legales */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl text-xs space-y-1.5 text-emerald-950">
                <p className="font-bold flex items-center gap-1">
                  <span>💡</span> Límites de Previsión Social (LISR)
                </p>
                <p className="text-emerald-900/80 leading-relaxed">
                  Para que los conceptos de previsión social permanezcan exentos, la suma de los salarios y estas prestaciones no debe exceder el equivalente a 7 veces la UMA elevada al año.
                </p>
              </div>
            </div>

            <div className="text-[10px] text-gray-400 text-center mt-8 pt-4 border-t border-gray-200">
              La activación de estos beneficios inyecta los montos directamente en la columna de percepciones del calculador de nómina.
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}

export default Benefits;