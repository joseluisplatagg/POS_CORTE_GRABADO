import React, { useState, useTransition, useActionState } from 'react';

// Catálogo maestro de facturas y obligaciones vigentes con proveedores
const INITIAL_INVOICES = [
  { id: 'FAC-8821', provider: 'Distribuidora Química del Centro', concept: 'Materia Prima Lote B', dueDate: '2026-11-05', amount: 145000, status: 'Pendiente', daysLeft: 14 },
  { id: 'FAC-9011', provider: 'Sistemas y Enlaces Digitales', concept: 'Servidores y Licencias Anuales', dueDate: '2026-10-24', amount: 35000, status: 'Por Vencer', daysLeft: 2 },
  { id: 'FAC-7412', provider: 'Arrendamientos Industriales S.A.', concept: 'Renta de Bodega Logística', dueDate: '2026-10-15', amount: 62000, status: 'Vencido', daysLeft: -7 },
  { id: 'FAC-9133', provider: 'Energía de México', concept: 'Suministro Eléctrico Planta 1', dueDate: '2026-11-20', amount: 18500, status: 'Pendiente', daysLeft: 29 },
];

// Server Action para procesar el pago de una factura (React v19)
async function processProviderPaymentAction(prevState, formData) {
  const invoiceId = formData.get('invoiceId');
  const bankAccount = formData.get('bankAccount');

  // Simular la latencia de la dispersión interbancaria (SPEI)
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (!bankAccount) {
    return { success: false, error: 'Debe seleccionar una cuenta bancaria de origen.' };
  }

  return { success: true, invoiceId, message: `Pago de la factura ${invoiceId} dispersado con éxito.` };
}
const AccountsPerPay = () =>{
    const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPendingFilter, startTransition] = useTransition();

  // React v19 useActionState para manejar la dispersión de pagos
  const [formState, formAction, isProcessing] = useActionState(async (prevState, formData) => {
    const result = await processProviderPaymentAction(prevState, formData);
    if (result.success) {
      setInvoices((prev) =>
        prev.map((fac) =>
          fac.id === result.invoiceId ? { ...fac, status: 'Liquidado', daysLeft: 0 } : fac
        )
      );
      setSelectedInvoice(null);
    }
    return result;
  }, null);

  // Filtrado optimizado con useTransition
  const handleFilterChange = (status) => {
    startTransition(() => {
      setFilterStatus(status);
    });
  };

  const filteredInvoices = invoices.filter(
    (fac) => filterStatus === 'Todos' || fac.status === filterStatus
  );

  // Métricas financieras del tablero CxP
  const totalOutstanding = invoices.filter(f => f.status !== 'Liquidado').reduce((sum, f) => sum + f.amount, 0);
  const totalVencido = invoices.filter(f => f.status === 'Vencido').reduce((sum, f) => sum + f.amount, 0);
  const totalPorVencer = invoices.filter(f => f.status === 'Por Vencer').reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="p-8 space-y-6">
      
      {/* SECCIÓN SUPERIOR: MÉTRICAS DE ANTIGÜEDAD DE SALDOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-3xs flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-slate-700 h-full"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total por Pagar</span>
            <p className="text-xl font-extrabold text-gray-900 font-mono mt-0.5">${totalOutstanding.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <span className="text-xl opacity-40">🧾</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-3xs flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-amber-500 h-full"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Compromisos por Vencer (7 días)</span>
            <p className="text-xl font-extrabold text-amber-700 font-mono mt-0.5">${totalPorVencer.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
          </div>
          <span className="text-xl opacity-40">⏳</span>
        </div>

        <div className={`p-4 rounded-xl border shadow-3xs flex justify-between items-center relative overflow-hidden ${totalVencido > 0 ? 'bg-rose-50/40 border-rose-100' : 'bg-white border-gray-200'}`}>
          <div className={`absolute top-0 left-0 w-1 h-full ${totalVencido > 0 ? 'bg-rose-600' : 'bg-gray-300'}`}></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Cartera Vencida / Expirada</span>
            <p className={`text-xl font-extrabold font-mono mt-0.5 ${totalVencido > 0 ? 'text-rose-600' : 'text-gray-900'}`}>
              ${totalVencido.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <span className="text-xl opacity-40">⚠️</span>
        </div>
      </div>

      {/* CONTENIDO MAESTRO: LISTADO DE FACTURAS + ACCIONES DE TESORERÍA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* TABLA PRINCIPAL DE PROVEEDORES (8 DE 12 COLUMNAS) */}
        <main className="lg:col-span-8 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Obligaciones Comerciales Activas</h3>
              <p className="text-xs text-gray-400 mt-0.5">Control de pasivos a corto plazo y facturación recibida.</p>
            </div>
            
            {/* Filtros rápidos de estatus */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
              {['Todos', 'Pendiente', 'Por Vencer', 'Vencido', 'Liquidado'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    filterStatus === status ? 'bg-white text-emerald-950 shadow-3xs font-bold' : 'text-gray-500'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {isPendingFilter && <div className="bg-emerald-50 text-emerald-800 text-[10px] text-center py-1 animate-pulse font-medium">Actualizando registros de proveedores...</div>}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-[9px] font-bold tracking-wider border-b border-gray-200">
                  <th className="py-3 px-4">Factura / Proveedor</th>
                  <th className="py-3 px-4">Concepto</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-4 text-center">Plazo</th>
                  <th className="py-3 px-4 text-center">Estatus</th>
                  <th className="py-3 px-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-gray-400 font-medium font-sans">No existen obligaciones registradas bajo este estatus.</td>
                  </tr>
                ) : (
                  filteredInvoices.map((fac) => (
                    <tr key={fac.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900 font-mono">{fac.id}</div>
                        <div className="text-gray-500 font-sans mt-0.5 font-medium">{fac.provider}</div>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-gray-600 max-w-[180px] truncate" title={fac.concept}>{fac.concept}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-right text-gray-900">${fac.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        {fac.status === 'Liquidado' ? (
                          <span className="text-gray-400">—</span>
                        ) : fac.daysLeft < 0 ? (
                          <span className="text-rose-600 font-bold">{Math.abs(fac.daysLeft)}d vencido</span>
                        ) : (
                          <span className="text-gray-700">{fac.daysLeft} días</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          fac.status === 'Liquidado' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                          fac.status === 'Vencido' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          fac.status === 'Por Vencer' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>{fac.status}</span>
                      </td>
                       <td className="py-3.5 px-4 text-right">
                        {fac.status !== 'Liquidado' ? (
                          <button
                            type="button"
                            onClick={() => setSelectedInvoice(fac)}
                            className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-800 hover:text-white px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            Pagar
                          </button>
                        ) : <span className="text-gray-300 text-center block">—</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>

        {/* PANEL LATERAL DE DISPERSIÓN BANCARIA (4 DE 12 COLUMNAS) */}
        <aside className="lg:col-span-4 bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-2xs min-h-[380px] flex flex-col justify-between">
          {selectedInvoice ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-gray-900 text-sm">Programación de SPEI / Egreso</h4>
                <button type="button" onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-gray-600 text-xs cursor-pointer">✕</button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-3xs space-y-2 mb-4">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Beneficiario</span>
                  <span className="text-xs font-bold text-gray-900">{selectedInvoice.provider}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Documento</span>
                    <span className="font-mono text-xs text-gray-600">{selectedInvoice.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Total a Dispersar</span>
                    <span className="font-mono text-xs font-bold text-emerald-950">${selectedInvoice.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Formulario de Transacción en React v19 */}
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="invoiceId" value={selectedInvoice.id} />
                
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1">Cuenta de Cargo (Origen)</label>
                  <select name="bankAccount" required className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs shadow-3xs focus:ring-2 focus:ring-emerald-700 outline-hidden cursor-pointer">
                    <option value="">-- Selecciona cuenta de banco --</option>
                    <option value="BBVA-MXN-4821">BBVA Corporativa Corriente (*4821)</option>
                    <option value="BANAMEX-MXN-9022">Citibanamex Operativa (*9022)</option>
                    <option value="SANTANDER-USD-1102">Santander Tesorería USD (*1102)</option>
                  </select>
                </div>

                {formState?.error && <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100">{formState.error}</p>}

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-3xs mt-2"
                >
                  {isProcessing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Autorizando Transferencia...
                    </>
                  ) : 'Autorizar Dispersión SPEI'}
                </button>
              </form>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl bg-white/40">
              <span className="text-2xl mb-1">🛡️</span>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tesorería Asegurada</h4>
              <p className="text-[11px] text-gray-400 max-w-[200px] mt-1 leading-relaxed">Selecciona el botón "Pagar" de cualquier factura del listado para autorizar un egreso interbancario.</p>
            </div>
          )}
          
          <div className="text-[9px] text-gray-400 text-center mt-6 pt-4 border-t border-gray-200">
            Toda transferencia requiere tokenización en firme y genera póliza de egreso automática.
          </div>
        </aside>
      </div>

    </div>
  );
}

export default AccountsPerPay;