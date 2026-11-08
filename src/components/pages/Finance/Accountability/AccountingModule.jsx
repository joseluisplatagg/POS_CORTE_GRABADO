import React, { useState, useActionState, useTransition  } from 'react';

// Cuentas iniciales simuladas de una PyME
const INITIAL_BALANCE_DATA = {
  activoCirculante: [
    { code: '1101', name: 'Caja y Bancos', amount: 450000 },
    { code: '1102', name: 'Clientes / Cuentas por Cobrar', amount: 280000 },
    { code: '1103', name: 'Inventarios / Almacén', amount: 350000 }
  ],
  activoNoCirculante: [
    { code: '1201', name: 'Mobiliario y Equipo de Oficina', amount: 120000 },
    { code: '1202', name: 'Equipo de Cómputo', amount: 85000 },
    { code: '1203', name: 'Depreciación Acumulada', amount: -25000 }
  ],
  pasivoCortoPlazo: [
    { code: '2101', name: 'Proveedores', amount: 190000 },
    { code: '2102', name: 'Acreedores Diversos', amount: 45000 },
    { code: '2103', name: 'Impuestos por Pagar', amount: 35000 }
  ],
  pasivoLargoPlazo: [
    { code: '2201', name: 'Créditos Bancarios LP', amount: 200000 }
  ],
  capitalContable: [
    { code: '3101', name: 'Capital Social (Aportaciones)', amount: 600000 },
    { code: '3102', name: 'Utilidades Retenidas', amount: 195000 }
  ]
};

// Estructura contable base del Estado de Resultados de una PyME
const INITIAL_INCOME_DATA = {
  ingresos: [
    { code: '4101', name: 'Ventas Totales de Mercancías', amount: 1250000 },
    { code: '4102', name: 'Devoluciones y Descuentos sobre Ventas', amount: -35000 }
  ],
  costos: [
    { code: '5101', name: 'Costo de Ventas (Adquisiciones / Producción)', amount: 620000 }
  ],
  gastosOperativos: [
    { code: '6101', name: 'Gastos de Administración (Sueldos, Renta, Luz)', amount: 180000 },
    { code: '6102', name: 'Gastos de Venta (Marketing, Logística, Comisiones)', amount: 95000 },
    { code: '6103', name: 'Depreciaciones del Periodo', amount: 15000 }
  ],
  resultadoFinanciero: [
    { code: '7101', name: 'Gastos Financieros (Intereses de Créditos)', amount: 18000 },
    { code: '7102', name: 'Productos Financieros (Intereses Ganados)', amount: 4500 }
  ],
  impuestosFiscales: {
    tasaISR: 30, // 30% corporativo estándar
    tasaPTU: 10  // 10% participación de utilidades
  }
};

// Estructura contable base del Flujo de Efectivo de una PyME
const INITIAL_CASHFLOW_DATA = {
  operacion: [
    { code: '1101-O', name: 'Cobranza en Efectivo a Clientes', amount: 1320000 },
    { code: '1102-O', name: 'Pago en Efectivo a Proveedores de Mercancías', amount: -680000 },
    { code: '1103-O', name: 'Pago de Gastos Operativos y Nóminas', amount: -240000 },
    { code: '1104-O', name: 'Pago de Impuestos / Retenciones fiscales', amount: -45000 }
  ],
  inversion: [
    { code: '1201-I', name: 'Adquisición de Maquinaria y Equipo de Cómputo', amount: -85000 },
    { code: '1202-I', name: 'Venta de Activos Fijos Obsoletos', amount: 12000 }
  ],
  financiamiento: [
    { code: '1301-F', name: 'Obtención de Crédito Bancario Comercial', amount: 150000 },
    { code: '1302-F', name: 'Pago de Intereses y Amortización de Deuda', amount: -32000 },
    { code: '1303-F', name: 'Pago de Dividendos a Accionistas', amount: -50000 }
  ],
  saldosIniciales: {
    efectivoInicioPeriodo: 185000 // Saldo en bancos al primer día del mes/año
  }
};

const INITIAL_BALANZA_DATA = [
  // Cuentas de Activo (Naturaleza Deudora)
  { id: '1101', name: 'Caja y Bancos', type: 'Deudora', initial: 150000, debit: 450000, credit: 150000 },
  { id: '1102', name: 'Clientes y Cuentas por Cobrar', type: 'Deudora', initial: 220000, debit: 180000, credit: 120000 },
  { id: '1103', name: 'Almacén / Inventarios', type: 'Deudora', initial: 300000, debit: 150000, credit: 100000 },
  { id: '1201', name: 'Mobiliario y Equipo de Oficina', type: 'Deudora', initial: 120000, debit: 0, credit: 0 },
  
  // Cuentas de Pasivo (Naturaleza Acreedora)
  { id: '2101', name: 'Proveedores Nacionales', type: 'Acreedora', initial: 140000, debit: 90000, credit: 140000 },
  { id: '2102', name: 'Acreedores Diversos', type: 'Acreedora', initial: 30000, debit: 15000, credit: 30000 },
  { id: '2201', name: 'Créditos Bancarios LP', type: 'Acreedora', initial: 250000, debit: 50000, credit: 0 },
  
  // Cuentas de Capital (Naturaleza Acreedora)
  { id: '3101', name: 'Capital Social', type: 'Acreedora', initial: 600000, debit: 0, credit: 0 },
  { id: '3102', name: 'Utilidades Retenidas', type: 'Acreedora', initial: 195000, debit: 0, credit: 0 },
  
  // Cuentas de Ingresos (Naturaleza Acreedora)
  { id: '4101', name: 'Ingresos por Ventas', type: 'Acreedora', initial: 0, debit: 35000, credit: 1250000 },
  
  // Cuentas de Costos y Gastos (Naturaleza Deudora)
  { id: '5101', name: 'Costo de Ventas', type: 'Deudora', initial: 0, debit: 620000, credit: 0 },
  { id: '6101', name: 'Gastos de Administración', type: 'Deudora', initial: 0, debit: 180000, credit: 0 },
  { id: '6102', name: 'Gastos de Venta', type: 'Deudora', initial: 0, debit: 95000, credit: 0 },
  { id: '7101', name: 'Gastos Financieros', type: 'Deudora', initial: 0, debit: 18500, credit: 500 }
];

// Server Action para simular el guardado o actualización de saldos en la base de datos
async function updateAccountAmountAction(prevState, formData) {
  const accountCode = formData.get('accountCode');
  const sectionKey = formData.get('sectionKey');
  const newAmount = parseFloat(formData.get('newAmount') || 0);

  // Simular retraso de guardado en API financiera
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (isNaN(newAmount)) {
    return { success: false, error: 'Monto inválido.' };
  }

  return { success: true, accountCode, sectionKey, newAmount };
}

// Server Action simulada para ajustar rubros de ingresos o gastos en tiempo real
async function updateIncomeItemAction(prevState, formData) {
  const itemCode = formData.get('itemCode');
  const sectionKey = formData.get('sectionKey');
  const newAmount = parseFloat(formData.get('newAmount') || 0);

  // Simular latencia de recalculo financiero
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (isNaN(newAmount)) {
    return { success: false, error: 'Monto ingresado no es válido.' };
  }

  return { success: true, itemCode, sectionKey, newAmount };
}

// Server Action para actualizar movimientos o flujos de caja en tiempo real
async function updateCashflowItemAction(prevState, formData) {
  const itemCode = formData.get('itemCode');
  const sectionKey = formData.get('sectionKey');
  const newAmount = parseFloat(formData.get('newAmount') || 0);

  // Simular latencia de auditoría de tesorería
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (isNaN(newAmount)) {
    return { success: false, error: 'Monto inválido.' };
  }

  return { success: true, itemCode, sectionKey, newAmount };
}

const AccountingModule = () => {
  // Estado para controlar la pestaña financiera activa
  const [activeTab, setActiveTab] = useState('balance');

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans antialiased text-gray-800">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* ENCABEZADO CORPORATIVO CON EL GRADIENTE PREMIUM */}
        <header className="bg-linear-to-r from-emerald-950 via-emerald-800 to-cyan-700 px-8 py-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                Dirección de Finanzas
              </span>
              <h1 className="text-3xl font-bold tracking-tight mt-0.5">
                Módulo de Contabilidad General
              </h1>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-lg border border-white/10 text-right">
              <p className="text-xs text-emerald-200">Ejercicio Fiscal Activo</p>
              <p className="font-mono font-bold text-sm">Año en Curso / Auditoría</p>
            </div>
          </div>
        </header>

        {/* MENÚ DE NAVEGACIÓN FINANCIERA (TABS) */}
        <nav className="flex bg-gray-100 border-b border-gray-200 px-6 pt-3 gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'balance', label: '🏛️ Balance General' },
            { id: 'resultados', label: '📊 Estado de Resultados' },
            { id: 'flujo', label: '💸 Flujo de Efectivo' },
            { id: 'balanza', label: '📑 Balanza de Comprobación' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-950 border-emerald-800 shadow-2xs'
                  : 'text-gray-500 hover:text-gray-900 border-transparent hover:bg-gray-50/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* CONTENEDOR DINÁMICO DE REPORTES CONTABLES */}
        <div className="min-h-[500px]">
          
          {/* INTERFAZ 1: BALANCE GENERAL */}
          {activeTab === 'balance' && (
            <div className="p-8 animate-fadeIn">
              <BalanceGeneralTab />
            </div>
          )}

          {/* INTERFAZ 2: ESTADO DE RESULTADOS */}
          {activeTab === 'resultados' && (
            <div className="p-8 animate-fadeIn">
              <EstadoResultadosTab />
            </div>
          )}

          {/* INTERFAZ 3: FLUJO DE EFECTIVO */}
          {activeTab === 'flujo' && (
            <div className="p-8 animate-fadeIn">
              <EstadoFlujoTab />
            </div>
          )}

          {/* INTERFAZ 4: BALANZA DE COMPROBACIÓN */}
          {activeTab === 'balanza' && (
            <div className="p-8 animate-fadeIn">
              <BalanzaComprobacionTab />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function BalanceGeneralTab() {
  const [balanceData, setBalanceData] = useState(INITIAL_BALANCE_DATA);
  const [editingAccount, setEditingAccount] = useState(null);

  // React v19 useActionState para gestionar la actualización asíncrona de los saldos contables
  const [formState, formAction, isSaving] = useActionState(async (prevState, formData) => {
    const result = await updateAccountAmountAction(prevState, formData);
    if (result.success) {
      setBalanceData((prev) => ({
        ...prev,
        [result.sectionKey]: prev[result.sectionKey].map((acc) =>
          acc.code === result.accountCode ? { ...acc, amount: result.newAmount } : acc
        )
      }));
      setEditingAccount(null); // Cerrar modal o panel de edición
    }
    return result;
  }, null);

  // Helper para sumar subtotales de las secciones
  const sumSection = (accounts) => accounts.reduce((sum, acc) => sum + acc.amount, 0);

  // Cálculos Financieros Estructurales
  const totalActivoCirculante = sumSection(balanceData.activoCirculante);
  const totalActivoNoCirculante = sumSection(balanceData.activoNoCirculante);
  const totalActivo = totalActivoCirculante + totalActivoNoCirculante;

  const totalPasivoCortoPlazo = sumSection(balanceData.pasivoCortoPlazo);
  const totalPasivoLargoPlazo = sumSection(balanceData.pasivoLargoPlazo);
  const totalPasivo = totalPasivoCortoPlazo + totalPasivoLargoPlazo;

  const totalCapitalContable = sumSection(balanceData.capitalContable);
  const totalPasivoMasCapital = totalPasivo + totalCapitalContable;

  // Validación de la Ecuación Contable (Diferencia debe ser cero)
  const diferenciaDoblePartida = Math.abs(totalActivo - totalPasivoMasCapital);
  const estaCuadrado = diferenciaDoblePartida < 0.01;

  // Renderizador de filas para reutilizar estructura limpia de Tailwind
  const renderRows = (accounts, sectionKey) =>
    accounts.map((acc) => (
      <tr key={acc.code} className="hover:bg-gray-50/70 transition-colors group">
        <td className="py-2.5 px-4 font-mono text-xs text-gray-400">{acc.code}</td>
        <td className="py-2.5 px-4 text-gray-700 font-medium text-xs">{acc.name}</td>
        <td className="py-2.5 px-4 font-mono text-xs text-right text-gray-900">
          ${acc.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </td>
        <td className="py-2.5 px-4 text-right">
          <button
            type="button"
            onClick={() => setEditingAccount({ ...acc, sectionKey })}
            className="text-[11px] font-bold text-emerald-800 opacity-0 group-hover:opacity-100 hover:text-emerald-950 transition-all cursor-pointer"
          >
            Editar
          </button>
        </td>
      </tr>
    ));

  return (
    <div className="p-8 space-y-6">
      
      {/* SECCIÓN SUPERIOR: VALIDACIÓN DE PARTIDA DOBLE */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs transition-all ${
        estaCuadrado 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
          : 'bg-rose-50 border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{estaCuadrado ? '⚖️' : '⚠️'}</span>
          <div>
            <h4 className="font-bold text-sm">Estado de Ecuación Contable</h4>
            <p className="text-xs opacity-80 mt-0.5">
              {estaCuadrado 
                ? 'El balance cumple perfectamente con el principio de partida doble.' 
                : `Descuadre detectado en libros. Diferencia de $${diferenciaDoblePartida.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN.`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xs font-bold uppercase tracking-wider block opacity-60">Diferencia</span>
          <span className="font-mono font-extrabold text-sm">
            ${diferenciaDoblePartida.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* CUERPO DEL REPORTES: COLUMNA IZQUIERDA (ACTIVOS) VS COLUMNA DERECHA (PASIVOS + CAPITAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* BLOQUE DE ACTIVOS (6 DE 12 COLUMNAS) */}
        <section className="lg:col-span-6 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/80 text-gray-500 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
                <th className="py-3 px-4 w-16">Código</th>
                <th className="py-3 px-4">Cuenta Activo</th>
                <th className="py-3 px-4 text-right w-36">Saldo</th>
                <th className="py-3 px-4 w-16 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-gray-50/50"><td colSpan="4" className="py-2 px-4 font-bold text-xs text-emerald-950">Activo Circulante</td></tr>
              {renderRows(balanceData.activoCirculante, 'activoCirculante')}
              <tr className="bg-emerald-50/30 font-semibold text-xs border-t-2 border-emerald-100">
                <td colSpan="2" className="py-3 px-4 text-emerald-900">Total Activo Circulante</td>
                <td className="py-3 px-4 font-mono text-right text-emerald-950">${totalActivoCirculante.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td></td>
              </tr>

              <tr className="bg-gray-50/50"><td colSpan="4" className="py-2 px-4 font-bold text-xs text-emerald-950">Activo No Circulante</td></tr>
              {renderRows(balanceData.activoNoCirculante, 'activoNoCirculante')}
              <tr className="bg-emerald-50/30 font-semibold text-xs border-t-2 border-emerald-100">
                <td colSpan="2" className="py-3 px-4 text-emerald-900">Total Activo No Circulante</td>
                <td className="py-3 px-4 font-mono text-right text-emerald-950">${totalActivoNoCirculante.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td></td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-emerald-950 text-white font-bold text-sm border-t">
                <td colSpan="2" className="py-4 px-4 rounded-bl-xl">TOTAL ACTIVO</td>
                <td className="py-4 px-4 font-mono text-right">${totalActivo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td className="rounded-br-xl"></td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* BLOQUE DE PASIVOS Y CAPITAL (6 DE 12 COLUMNAS) */}
        <section className="lg:col-span-6 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs space-y-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/80 text-gray-500 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
                <th className="py-3 px-4 w-16">Código</th>
                <th className="py-3 px-4">Cuenta Pasivo y Capital</th>
                <th className="py-3 px-4 text-right w-36">Saldo</th>
                <th className="py-3 px-4 w-16 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-gray-50/50"><td colSpan="4" className="py-2 px-4 font-bold text-xs text-cyan-950">Pasivo Corto Plazo</td></tr>
              {renderRows(balanceData.pasivoCortoPlazo, 'pasivoCortoPlazo')}
              <tr className="bg-cyan-50/30 font-semibold text-xs border-t-2 border-cyan-100">
                <td colSpan="2" className="py-3 px-4 text-cyan-900">Total Pasivo Corto Plazo</td>
                <td className="py-3 px-4 font-mono text-right text-cyan-950">${totalPasivoCortoPlazo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td></td>
              </tr>

             <tr className="bg-gray-50/50"><td colSpan="4" className="py-2 px-4 font-bold text-xs text-cyan-950">Pasivo Largo Plazo</td></tr>
              {renderRows(balanceData.pasivoLargoPlazo, 'pasivoLargoPlazo')}
              <tr className="bg-cyan-50/30 font-semibold text-xs border-t-2 border-cyan-100">
                <td colSpan="2" className="py-3 px-4 text-cyan-900">Total Pasivo Largo Plazo</td>
                <td className="py-3 px-4 font-mono text-right text-cyan-950">${totalPasivoLargoPlazo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td></td>
              </tr>

              <tr className="bg-gray-50/50"><td colSpan="4" className="py-2 px-4 font-bold text-xs text-amber-950">Capital Contable</td></tr>
              {renderRows(balanceData.capitalContable, 'capitalContable')}
              <tr className="bg-amber-50/30 font-semibold text-xs border-t-2 border-amber-100">
                <td colSpan="2" className="py-3 px-4 text-amber-900">Total Capital Contable</td>
                <td className="py-3 px-4 font-mono text-right text-amber-950">${totalCapitalContable.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td></td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white font-bold text-sm border-t">
                <td colSpan="2" className="py-4 px-4 rounded-bl-xl">TOTAL PASIVO + CAPITAL</td>
                <td className="py-4 px-4 font-mono text-right">${totalPasivoMasCapital.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                <td className="rounded-br-xl"></td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>

      {/* PANEL FLOTANTE / AJUSTE MANUAL DE AJUSTES CONTABLES */}
      {editingAccount && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-sm w-full space-y-4 animate-scaleUp">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Ajuste de Saldo de Cuenta</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Ref: {editingAccount.code} — {editingAccount.name}</p>
            </div>
            
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="accountCode" value={editingAccount.code} />
              <input type="hidden" name="sectionKey" value={editingAccount.sectionKey} />
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Nuevo Saldo Contable</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    name="newAmount"
                    required
                    step="0.01"
                    placeholder="0.00"
                    defaultValue={editingAccount.amount}
                    className="w-full pl-7 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-hidden"
                  />
                </div>
              </div>

              {formState?.error && <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">{formState.error}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingAccount(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Guardando...' : 'Aplicar Ajuste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function EstadoResultadosTab() {
  const [incomeData, setIncomeData] = useState(INITIAL_INCOME_DATA);
  const [editingItem, setEditingItem] = useState(null);

  // React v19 useActionState para gestionar las modificaciones asíncronas
  const [formState, formAction, isSaving] = useActionState(async (prevState, formData) => {
    const result = await updateIncomeItemAction(prevState, formData);
    if (result.success) {
      setIncomeData((prev) => ({
        ...prev,
        [result.sectionKey]: prev[result.sectionKey].map((item) =>
          item.code === result.itemCode ? { ...item, amount: result.newAmount } : item
        )
      }));
      setEditingItem(null);
    }
    return result;
  }, null);

  const sumSection = (items) => items.reduce((sum, item) => sum + item.amount, 0);

  // --- CÁLCULO DE LA CASCADA FINANCIERA ---
  const totalIngresosNetos = sumSection(incomeData.ingresos);
  const totalCostos = sumSection(incomeData.costos);
  
  // 1. Utilidad Bruta
  const utilidadBruta = totalIngresosNetos - totalCostos;
  const margenBruto = totalIngresosNetos > 0 ? (utilidadBruta / totalIngresosNetos) * 100 : 0;

  const totalGastosOperativos = sumSection(incomeData.gastosOperativos);
  
  // 2. Utilidad de Operación (EBIT)
  const utilidadOperacion = utilidadBruta - totalGastosOperativos;
  const margenOperativo = totalIngresosNetos > 0 ? (utilidadOperacion / totalIngresosNetos) * 100 : 0;

  // Resultado Integral de Financiamiento (RIF)
  const totalRIF = sumSection(incomeData.resultadoFinanciero); // Gastos son positivos, productos financieros restan carga
  const utilidadAntesImpuestos = utilidadOperacion - totalRIF;

  // Impuestos Provisiones (ISR y PTU si la utilidad es positiva)
  const isrProvision = utilidadAntesImpuestos > 0 ? utilidadAntesImpuestos * (incomeData.impuestosFiscales.tasaISR / 100) : 0;
  const ptuProvision = utilidadAntesImpuestos > 0 ? utilidadAntesImpuestos * (incomeData.impuestosFiscales.tasaPTU / 100) : 0;
  const totalImpuestos = isrProvision + ptuProvision;

  // 3. Utilidad Neta Final
  const utilidadNeta = utilidadAntesImpuestos - totalImpuestos;
  const margenNeto = totalIngresosNetos > 0 ? (utilidadNeta / totalIngresosNetos) * 100 : 0;

  // Renderizador de filas estándar para el reporte
  const renderRows = (items, sectionKey) =>
    items.map((item) => (
      <tr key={item.code} className="hover:bg-gray-50/70 transition-colors group text-xs text-gray-700">
        <td className="py-2 px-4 font-mono text-gray-400 w-16">{item.code}</td>
        <td className="py-2 px-4 font-medium">{item.name}</td>
        <td className="py-2 px-4 font-mono text-right w-36 text-gray-900">
          {item.amount < 0 ? '-' : ''}${Math.abs(item.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </td>
        <td className="py-2 px-4 text-right w-16">
          <button
            type="button"
            onClick={() => setEditingItem({ ...item, sectionKey })}
            className="text-[11px] font-bold text-emerald-800 opacity-0 group-hover:opacity-100 hover:text-emerald-950 transition-all cursor-pointer"
          >
            Editar
          </button>
        </td>
      </tr>
    ));

  return (
    <div className="p-8 space-y-6">
      
      {/* SECCIÓN KPI SUPERIOR: MÉTRICAS ESENCIALES DE RENTABILIDAD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-3xs flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-emerald-800 h-full"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Margen Bruto</span>
            <p className="text-xl font-extrabold text-gray-900 font-mono mt-0.5">{margenBruto.toFixed(1)}%</p>
          </div>
          <span className="text-xl opacity-40">🏭</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-3xs flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-cyan-600 h-full"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Margen Operativo</span>
            <p className="text-xl font-extrabold text-gray-900 font-mono mt-0.5">{margenOperativo.toFixed(1)}%</p>
          </div>
          <span className="text-xl opacity-40">⚙️</span>
        </div>

        <div className={`p-4 rounded-xl border shadow-3xs flex justify-between items-center relative overflow-hidden ${
          utilidadNeta >= 0 ? 'bg-emerald-50/40 border-emerald-100' : 'bg-rose-50/40 border-rose-100'
        }`}>
          <div className={`absolute top-0 left-0 w-1 h-full ${utilidadNeta >= 0 ? 'bg-emerald-950' : 'bg-rose-600'}`}></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Margen Neto Final</span>
            <p className="text-xl font-extrabold text-gray-900 font-mono mt-0.5">{margenNeto.toFixed(1)}%</p>
          </div>
          <span className="text-xl opacity-40">{utilidadNeta >= 0 ? '📈' : '📉'}</span>
        </div>
      </div>

      {/* REPORTE FINANCIERO ESTRUCTURADO EN CASCADA */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs max-w-4xl mx-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100/80 text-gray-500 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Rubros / Conceptos Operativos</th>
              <th className="py-3 px-4 text-right">Monto</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            
            {/* INGRESOS */}
            <tr className="bg-gray-50/40"><td colSpan="4" className="py-1.5 px-4 font-bold text-xs text-emerald-950">Ingresos de Actividad</td></tr>
            {renderRows(incomeData.ingresos, 'ingresos')}
            <tr className="bg-gray-50/20 font-semibold text-xs">
              <td colSpan="2" className="py-2.5 px-4 text-gray-600 pl-6">(=) Ventas Netas Totales</td>
              <td className="py-2.5 px-4 font-mono text-right text-gray-900">${totalIngresosNetos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>

            {/* COSTOS */}
            <tr className="bg-gray-50/40"><td colSpan="4" className="py-1.5 px-4 font-bold text-xs text-emerald-950">Costos Operacionales</td></tr>
            {renderRows(incomeData.costos, 'costos')}
            
            {/* ESCALÓN 1: UTILIDAD BRUTA */}
            <tr className="bg-emerald-50/30 font-bold text-xs border-y border-emerald-100">
              <td colSpan="2" className="py-3 px-4 text-emerald-950 uppercase tracking-wide">(=) UTILIDAD BRUTA</td>
              <td className="py-3 px-4 font-mono text-right text-emerald-950">${utilidadBruta.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>

            {/* GASTOS OPERATIVOS */}
            <tr className="bg-gray-50/40"><td colSpan="4" className="py-1.5 px-4 font-bold text-xs text-emerald-950">Gastos de Operación</td></tr>
            {renderRows(incomeData.gastosOperativos, 'gastosOperativos')}
            <tr className="bg-gray-50/20 font-semibold text-xs">
              <td colSpan="2" className="py-2.5 px-4 text-gray-600 pl-6">Total Gastos Operativos</td>
              <td className="py-2.5 px-4 font-mono text-right text-gray-900">-${totalGastosOperativos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>

            {/* ESCALÓN 2: UTILIDAD DE OPERACIÓN */}
            <tr className="bg-cyan-50/30 font-bold text-xs border-y border-cyan-100">
              <td colSpan="2" className="py-3 px-4 text-cyan-950 uppercase tracking-wide">(=) UTILIDAD DE OPERACIÓN (EBIT)</td>
              <td className="py-3 px-4 font-mono text-right text-cyan-950">${utilidadOperacion.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>

            {/* RESULTADO FINANCIERO */}
            <tr className="bg-gray-50/40"><td colSpan="4" className="py-1.5 px-4 font-bold text-xs text-emerald-950">Resultado Integral de Financiamiento (RIF)</td></tr>
            {renderRows(incomeData.resultadoFinanciero, 'resultadoFinanciero')}

            {/* UTILIDAD ANTES DE IMPUESTOS */}
            <tr className="font-semibold text-xs bg-gray-50/50">
              <td colSpan="2" className="py-2.5 px-4 uppercase text-gray-700 tracking-wide">(=) Utilidad Antes de Impuestos</td>
              <td className="py-2.5 px-4 font-mono text-right text-gray-900">${utilidadAntesImpuestos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>

            {/* PROVISIÓN DE IMPUESTOS */}
            <tr className="bg-gray-50/40"><td colSpan="4" className="py-1.5 px-4 font-bold text-xs text-emerald-950">Provisiones Fiscales del Ejercicio</td></tr>
            <tr className="text-xs text-gray-700">
              <td className="py-2 px-4 font-mono text-gray-400">PROP</td>
              <td className="py-2 px-4 font-medium">Provisión de Impuesto sobre la Renta (ISR {incomeData.impuestosFiscales.tasaISR}%)</td>
              <td className="py-2 px-4 font-mono text-right text-gray-950">-${isrProvision.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>
            <tr className="text-xs text-gray-700">
              <td className="py-2 px-4 font-mono text-gray-400">PROP</td>
              <td className="py-2 px-4 font-medium">Participación de los Trabajadores en las Utilidades (PTU {incomeData.impuestosFiscales.tasaPTU}%)</td>
              <td className="py-2 px-4 font-mono text-right text-gray-950">-${ptuProvision.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>

          </tbody>
          <tfoot>
            <tr className={`text-white font-bold text-sm border-t ${utilidadNeta >= 0 ? 'bg-emerald-950' : 'bg-rose-950'}`}>
              <td colSpan="2" className="py-4 px-4 rounded-bl-xl uppercase tracking-wider">(=) UTILIDAD NETA DEL EJERCICIO</td>
              <td className="py-4 px-4 font-mono text-right">${utilidadNeta.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td className="rounded-br-xl"></td>
            </tr>
          </tfoot>
        </table>
      </section>

      {/* PANEL FLOTANTE / AJUSTE DE CUENTAS DE RESULTADOS */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-sm w-full space-y-4 animate-scaleUp">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Modificar Registro de Resultados</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Ref: {editingItem.code} — {editingItem.name}</p>
            </div>
            
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="itemCode" value={editingItem.code} />
              <input type="hidden" name="sectionKey" value={editingItem.sectionKey} />
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Monto del Periodo</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    name="newAmount"
                    required
                    step="0.01"
                    placeholder="0.00"
                    defaultValue={editingItem.amount}
                    className="w-full pl-7 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-hidden"
                  />
                </div>
              </div>

              {formState?.error && <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">{formState.error}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Guardando...' : 'Aplicar Ajuste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function EstadoFlujoTab() {
  const [cashflowData, setCashflowData] = useState(INITIAL_CASHFLOW_DATA);
  const [editingItem, setEditingItem] = useState(null);

  // React v19 useActionState para gestionar flujos monetarios asíncronos
  const [formState, formAction, isSaving] = useActionState(async (prevState, formData) => {
    const result = await updateCashflowItemAction(prevState, formData);
    if (result.success) {
      setCashflowData((prev) => ({
        ...prev,
        [result.sectionKey]: prev[result.sectionKey].map((item) =>
          item.code === result.itemCode ? { ...item, amount: result.newAmount } : item
        )
      }));
      setEditingItem(null);
    }
    return result;
  }, null);

  const sumSection = (items) => items.reduce((sum, item) => sum + item.amount, 0);

  // --- CÁLCULO DE FLUJOS Y CONCILIACIÓN FINAL ---
  const flujoNetoOperacion = sumSection(cashflowData.operacion);
  const flujoNetoInversion = sumSection(cashflowData.inversion);
  const flujoNetoFinanciamiento = sumSection(cashflowData.financiamiento);

  // Incremento o disminución neta de efectivo total
  const incrementoNetoEfectivo = flujoNetoOperacion + flujoNetoInversion + flujoNetoFinanciamiento;

  // Conciliación con caja inicial
  const efectivoAlInicio = cashflowData.saldosIniciales.efectivoInicioPeriodo;
  const efectivoAlFinal = efectivoAlInicio + incrementoNetoEfectivo;

  // Renderizador de filas estándar con formateo de signos contables
  const renderRows = (items, sectionKey) =>
    items.map((item) => (
      <tr key={item.code} className="hover:bg-gray-50/70 transition-colors group text-xs text-gray-700">
        <td className="py-2.5 px-4 font-mono text-gray-400 w-20">{item.code}</td>
        <td className="py-2.5 px-4 font-medium">{item.name}</td>
        <td className={`py-2.5 px-4 font-mono text-right w-36 font-semibold ${item.amount < 0 ? 'text-rose-600' : 'text-emerald-800'}`}>
          {item.amount < 0 ? '-' : ''}${Math.abs(item.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
        </td>
        <td className="py-2.5 px-4 text-right w-16">
          <button
            type="button"
            onClick={() => setEditingItem({ ...item, sectionKey })}
            className="text-[11px] font-bold text-emerald-800 opacity-0 group-hover:opacity-100 hover:text-emerald-950 transition-all cursor-pointer"
          >
            Editar
          </button>
        </td>
      </tr>
    ));

  return (
    <div className="p-8 space-y-6">
      
      {/* SECCIÓN KPI SUPERIOR: SALDOS DE CAJA EN TIEMPO REAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Efectivo al Inicio</span>
            <p className="text-xl font-extrabold text-gray-900 font-mono mt-0.5">${efectivoAlInicio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <span className="text-xl opacity-40">🏁</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Variación del Periodo</span>
            <p className={`text-xl font-extrabold font-mono mt-0.5 ${incrementoNetoEfectivo >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {incrementoNetoEfectivo >= 0 ? '+' : ''}${incrementoNetoEfectivo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <span className="text-xl opacity-40">🔄</span>
        </div>

        <div className="bg-emerald-950 p-4 rounded-xl text-white shadow-3xs flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">Disponibilidad en Bancos</span>
            <p className="text-xl font-extrabold font-mono mt-0.5">${efectivoAlFinal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <span className="text-xl opacity-40">💰</span>
        </div>
      </div>

      {/* REPORTE DE TESORERÍA COMPLETO */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs max-w-4xl mx-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100/80 text-gray-500 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Rubros de Flujo Monetario</th>
              <th className="py-3 px-4 text-right">Flujo Neto</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            
            {/* OPERACIÓN */}
            <tr className="bg-gray-50/40"><td colSpan="4" className="py-1.5 px-4 font-bold text-xs text-emerald-950">1. Actividades de Operación</td></tr>
            {renderRows(cashflowData.operacion, 'operacion')}
            <tr className="bg-emerald-50/20 font-bold text-xs border-y border-emerald-100/60">
              <td colSpan="2" className="py-2.5 px-4 text-emerald-900 pl-6">(=) Flujo Neto de Actividades de Operación</td>
              <td className={`py-2.5 px-4 font-mono text-right ${flujoNetoOperacion >= 0 ? 'text-emerald-800' : 'text-rose-600'}`}>
                ${flujoNetoOperacion.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </td>
              <td></td>
            </tr>

            {/* INVERSION */}
            <tr className="bg-gray-50/40"><td colSpan="4" className="py-1.5 px-4 font-bold text-xs text-emerald-950">2. Actividades de Inversión</td></tr>
            {renderRows(cashflowData.inversion, 'inversion')}
            <tr className="bg-cyan-50/20 font-bold text-xs border-y border-cyan-100/60">
              <td colSpan="2" className="py-2.5 px-4 text-cyan-900 pl-6">(=) Flujo Neto de Actividades de Inversión</td>
              <td className={`py-2.5 px-4 font-mono text-right ${flujoNetoInversion >= 0 ? 'text-emerald-800' : 'text-rose-600'}`}>
                ${flujoNetoInversion.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </td>
              <td></td>
            </tr>

            {/* FINANCIAMIENTO */}
            <tr className="bg-gray-50/40"><td colSpan="4" className="py-1.5 px-4 font-bold text-xs text-emerald-950">3. Actividades de Financiamiento</td></tr>
            {renderRows(cashflowData.financiamiento, 'financiamiento')}

            <tr className="bg-amber-50/20 font-bold text-xs border-y border-amber-100/60">
              <td colSpan="2" className="py-2.5 px-4 text-amber-900 pl-6">(=) Flujo Neto de Actividades de Financiamiento</td>
              <td className={`py-2.5 px-4 font-mono text-right ${flujoNetoFinanciamiento >= 0 ? 'text-emerald-800' : 'text-rose-600'}`}>
                \${flujoNetoFinanciamiento.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </td>
              <td></td>
            </tr>

            {/* CONCILIACIÓN FINAL */}
            <tr className="bg-gray-100/60"><td colSpan="4" className="py-2 px-4 font-bold text-xs text-gray-900">Conciliación de Saldos</td></tr>
            <tr className="text-xs text-gray-700 font-medium">
              <td colSpan="2" className="py-2.5 px-4 pl-6">Incremento / (Disminución) Neto en el Efectivo</td>
              <td className={`py-2.5 px-4 font-mono text-right ${incrementoNetoEfectivo >= 0 ? 'text-emerald-800' : 'text-rose-600'}`}>
                \${incrementoNetoEfectivo.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </td>
              <td></td>
            </tr>
            <tr className="text-xs text-gray-700 border-b border-gray-200">
              <td colSpan="2" className="py-2.5 px-4 pl-6">Efectivo y Equivalentes al Inicio del Periodo</td>
              <td className="py-2.5 px-4 font-mono text-right text-gray-900">\${efectivoAlInicio.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td></td>
            </tr>

          </tbody>
          <tfoot>
            <tr className="bg-emerald-950 text-white font-bold text-sm border-t">
              <td colSpan="2" className="py-4 px-4 rounded-bl-xl uppercase tracking-wider">(=) EFECTIVO Y EQUIVALENTES AL FINAL DEL PERIODO</td>
              <td className="py-4 px-4 font-mono text-right">\${efectivoAlFinal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td className="rounded-br-xl"></td>
            </tr>
          </tfoot>
        </table>
      </section>

        {/* PANEL FLOTANTE / AJUSTE DE CUENTAS DE FLUJO */}

      {editingItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 max-w-sm w-full space-y-4 animate-scaleUp">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Modificar Flujo de Caja</h3>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Ref: {editingItem.code} — {editingItem.name}</p>
            </div>
            
            <form action={formAction} className="space-y-4">
              <input type="hidden" name="itemCode" value={editingItem.code} />
              <input type="hidden" name="sectionKey" value={editingItem.sectionKey} />
              
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Monto de Liquidez</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 text-sm">\$</span>
                  <input
                    type="number"
                    name="newAmount"
                    required
                    step="0.01"
                    placeholder="0.00"
                    defaultValue={editingItem.amount}
                    className="w-full pl-7 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-700 outline-hidden"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Nota: Usa montos negativos para salidas de efectivo (egresos).</span>
              </div>

              {formState?.error && <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg">{formState.error}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Guardando...' : 'Aplicar Ajuste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
  );


}
 
function BalanzaComprobacionTab() {
  const [balanza] = useState(INITIAL_BALANZA_DATA);
  const [search, setSearch] = useState('');
  const [isPendingFilter, startTransition] = useTransition();

  // Filtrado ultra fluido utilizando useTransition para grandes catálogos de cuentas (SAT)
  const filteredBalanza = balanza.filter(
    (account) =>
      account.name.toLowerCase().includes(search.toLowerCase()) ||
      account.id.includes(search)
  );

  // --- CÁLCULO INMEDIATO DE MOVIMIENTOS Y SALDOS FINALES ---
  let totalInitialDeudor = 0;
  let totalInitialAcreedor = 0;
  let totalDebits = 0;
  let totalCredits = 0;
  let totalFinalDeudor = 0;
  let totalFinalAcreedor = 0;

  // Procesar e iterar de forma matemática la matriz completa
  balanza.forEach((acc) => {
    // 1. Saldos Iniciales
    if (acc.type === 'Deudora') totalInitialDeudor += acc.initial;
    else totalInitialAcreedor += acc.initial;

    // 2. Cargos y Abonos
    totalDebits += acc.debit;
    totalCredits += acc.credit;

    // 3. Obtención analítica de saldos finales por naturaleza contable
    if (acc.type === 'Deudora') {
      const finalSaldo = acc.initial + acc.debit - acc.credit;
      totalFinalDeudor += finalSaldo;
    } else {
      const finalSaldo = acc.initial + acc.credit - acc.debit;
      totalFinalAcreedor += finalSaldo;
    }
  });

  // Validaciones clave de cuadre contable aritmético
  const columnasCuadradas = 
    Math.abs(totalInitialDeudor - totalInitialAcreedor) < 0.01 &&
    Math.abs(totalDebits - totalCredits) < 0.01 &&
    Math.abs(totalFinalDeudor - totalFinalAcreedor) < 0.01;

  return (
    <div className="p-8 space-y-6">
      
      {/* COMPONENTE INTERACTIVO DE REVISIÓN PERICIAL */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-3xs transition-all ${
        columnasCuadradas 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
          : 'bg-rose-50 border-rose-200 text-rose-950'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-xl">{columnasCuadradas ? '📋' : '⚠️'}</span>
          <div>
            <h4 className="font-bold text-sm">Validación de Cierre de Libros</h4>
            <p className="text-xs opacity-80 mt-0.5">
              {columnasCuadradas 
                ? 'Todas las columnas (Saldos Iniciales, Movimientos y Saldos Finales) se encuentran perfectamente sumadas y cuadradas.' 
                : 'Se detectó una discrepancia numérica en las sumas de cargo/abono de las cuentas.'}
            </p>
          </div>
        </div>
        <div className="bg-white/50 border border-current/10 px-3 py-1.5 rounded-lg text-xs font-bold font-mono">
          Estatus: {columnasCuadradas ? 'AUTORIZADA' : 'REVISIÓN REQUERIDA'}
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA TÉCNICA */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Buscar por código de cuenta o nombre (ej: 1101)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-2 bg-white border border-gray-300 rounded-xl shadow-3xs focus:ring-2 focus:ring-emerald-700 outline-hidden text-xs transition-all"
        />
      </div>

      {/* TABLA DE BALANZA CON FORMATO MULTI-COLUMNA DE AUDITORÍA */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            {/* Fila superior agrupada */}
            <tr className="bg-gray-100/80 text-gray-500 uppercase text-[9px] font-extrabold tracking-wider border-b border-gray-200 text-center divide-x divide-gray-200">
              <th className="py-2 px-4 text-left w-20" rowSpan="2">Código</th>
              <th className="py-2 px-4 text-left" rowSpan="2">Título de la Cuenta Contable</th>
              <th className="py-2 px-4 w-52" colSpan="2">Saldos Iniciales</th>
              <th className="py-2 px-4 w-52" colSpan="2">Movimientos del Periodo</th>
              <th className="py-2 px-4 w-52" colSpan="2">Saldos Finales</th>
            </tr>
            {/* Columnas individuales de Deudor y Acreedor */}
            <tr className="bg-gray-50 text-gray-600 uppercase text-[9px] font-bold tracking-wider border-b border-gray-200 text-right divide-x divide-gray-100">
              <th className="py-2 px-3 w-26">Deudor</th>
              <th className="py-2 px-3 w-26">Acreedor</th>
              <th className="py-2 px-3 w-26">Debe (Cargos)</th>
              <th className="py-2 px-3 w-26">Haber (Abonos)</th>
              <th className="py-2 px-3 w-26">Deudor</th>
              <th className="py-2 px-3 w-26">Acreedor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-mono text-[11px] text-gray-700">
            {filteredBalanza.map((acc) => {
              // Calcular los saldos finales en caliente para renderizado eficiente
              const finalDeudor = acc.type === 'Deudora' ? acc.initial + acc.debit - acc.credit : 0;
              const finalAcreedor = acc.type === 'Acreedora' ? acc.initial + acc.credit - acc.debit : 0;

              return (
                <tr key={acc.id} className="hover:bg-gray-50/80 transition-colors divide-x divide-gray-100/50">
                  <td className="py-2 px-4 font-bold text-gray-400 text-left">{acc.id}</td>
                  <td className="py-2 px-4 font-sans text-gray-900 text-left font-medium">{acc.name}</td>
                  
                  {/* Saldos Iniciales */}
                  <td className="py-2 px-3 text-right text-gray-600">{acc.type === 'Deudora' ? `$${acc.initial.toLocaleString('es-MX')}` : '\$-'}</td>
                  <td className="py-2 px-3 text-right text-gray-600">{acc.type === 'Acreedora' ? `$${acc.initial.toLocaleString('es-MX')}` : '\$-'}</td>
                  
                  {/* Movimientos */}
                  <td className="py-2 px-3 text-right text-emerald-800">{acc.debit > 0 ? `$${acc.debit.toLocaleString('es-MX')}` : '\$-'}</td>
                  <td className="py-2 px-3 text-right text-rose-700">{acc.credit > 0 ? `$${acc.credit.toLocaleString('es-MX')}` : '\$-'}</td>
                  
                  {/* Saldos Finales */}
                  <td className="py-2 px-3 text-right text-gray-900 font-bold">{finalDeudor > 0 ? `$${finalDeudor.toLocaleString('es-MX')}` : '\$-'}</td>
                  <td className="py-2 px-3 text-right text-gray-900 font-bold">{finalAcreedor > 0 ? `$${finalAcreedor.toLocaleString('es-MX')}` : '\$-'}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            {/* Fila totalizadora maestra de doble línea contable */}
            <tr className="bg-emerald-950 text-white font-bold text-[11px] text-right divide-x divide-emerald-900 border-t-4 border-double border-emerald-900">
              <td colSpan="2" className="py-3 px-4 text-left font-sans tracking-wide rounded-bl-xl">SUMAS IGUALES</td>
              <td className="py-3 px-3">\${totalInitialDeudor.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td className="py-3 px-3">\${totalInitialAcreedor.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td className="py-3 px-3">\${totalDebits.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td className="py-3 px-3">\${totalCredits.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td className="py-3 px-3">\${totalFinalDeudor.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
              <td className="py-3 px-3 rounded-br-xl">\${totalFinalAcreedor.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>
      </section>
      
    </div>
  );
}

export default AccountingModule;
