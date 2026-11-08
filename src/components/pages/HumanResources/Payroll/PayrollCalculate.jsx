import React, { useActionState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
async function calculatePayrollAction(prevState, formData) {
  const baseSalary = parseFloat(formData.get('baseSalary') || 0);
  const bonuses = parseFloat(formData.get('bonuses') || 0);
  const benefits = parseFloat(formData.get('benefits') || 0);
  const taxRate = parseFloat(formData.get('taxRate') || 0);
  const deductions = parseFloat(formData.get('deductions') || 0);

  // Simular latencia de procesamiento financiero
  await new Promise((resolve) => setTimeout(resolve, 600));

  // Cálculos lógicos
  const totalPerceptions = baseSalary + bonuses + benefits;
  const taxAmount = totalPerceptions * (taxRate / 100);
  const totalDeductions = taxAmount + deductions;
  const netPay = totalPerceptions - totalDeductions;

  return {
    success: true,
    results: {
      baseSalary,
      bonuses,
      benefits,
      totalPerceptions,
      taxAmount,
      deductions,
      totalDeductions,
      netPay
    }
  };
}

const PayrollCalculate = () =>{
    // Inicialización del estado del formulario con useActionState de React v19
  const [state, formAction, isCalculating] = useActionState(calculatePayrollAction, {
    success: false,
    results: null
  });

  const data = state.results;

const downloadPayrollPDF = (data) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter'
  });

  // --- PALETA DE COLORES CORPORATIVOS (Coherentes con tu UI) ---
  const primaryColor = '#022b1f'; // Emerald 950 (#022b1f)
  const accentColor = '#064e3b';   // Emerald 800 (#064e3b)
  const lightBg =  '#f0fdfa';   // Emerald 50  (#f0fdfa)

  // --- ENCABEZADO ESTILO PRESTIGIO ---
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 216, 38, 'F'); // Bloque superior completo

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('RECIBO DE NÓMINA (PREVISIÓN)', 14, 16);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(167, 243, 208); // Emerald 200 para subtítulos
  doc.text('MÓDULO DE RECURSOS HUMANOS / PROYECCIÓN FISCAL LFT', 14, 22);

  // --- METADATA DEL DOCUMENTO ---
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('PERIODO:', 150, 14);
  doc.setFont('helvetica', 'normal');
  doc.text('Quincena en Curso (Simulación)', 150, 19);
  doc.setFont('helvetica', 'bold');
  doc.text('FECHA DE EMISIÓN:', 150, 26);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('es-MX'), 150, 31);

  // --- DATOS GENERALES DEL TRABAJADOR ---
  doc.setTextColor(55, 65, 81);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('DATOS DEL RECEPTOR', 14, 48);
  
  doc.setLineWidth(0.3);
  doc.setDrawColor(209, 213, 219);
  doc.line(14, 50, 202, 50); // Línea divisoria

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Empresa / Patrón: Corporativo Interno S.A. de C.V.', 14, 56);
  doc.text('Moneda: MXN - Peso Mexicano', 14, 61);
  doc.text('Tipo de Régimen: Sueldos y Salarios', 14, 66);

  // --- TABLA DE DESGLOSE DE CONCEPTOS (Autotable) ---
  const tableRows = [
    ['P001', 'Sueldo Base Mensual (Ordinario)', `$${data.baseSalary.toFixed(2)}`, ''],
    ['P002', 'Bonos, Premios e Incentivos', `$${data.bonuses.toFixed(2)}`, ''],
    ['P003', 'Prestaciones de Ley y Beneficios Integrados', `$${data.benefits.toFixed(2)}`, ''],
    ['D001', 'Retención de Impuestos (ISR Est.)', '', `-$${data.taxAmount.toFixed(2)}`],
    ['D002', 'Otras Deducciones (IMSS / Ajustes)', '', `-$${data.deductions.toFixed(2)}`],
  ];

  doc.autoTable({
    startY: 74,
    head: [['Código', 'Concepto / Descripción', 'Percepciones (+)', 'Deducciones (-)']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: accentColor, fontStyle: 'bold', fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 20, fontStyle: 'bold' },
      1: { cellWidth: 90 },
      2: { halign: 'right', fontStyle: 'normal' },
      3: { halign: 'right', fontStyle: 'normal', textColor: [185, 28, 28] } // Texto rojo para deducciones
    },
    styles: { fontSize: 9, cellPadding: 3.5 },
  });

  // --- CUADRO DE RESUMEN FINAL ---
  let finalY = doc.lastAutoTable.finalY + 8;

  // Fondo destacado para el Neto Recibido
  doc.setFillColor(...lightBg);
  doc.rect(120, finalY, 82, 34, 'F');
  doc.setDrawColor(...accentColor);
  doc.rect(120, finalY, 82, 34, 'D');

  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Total Percepciones Brutas:', 124, finalY + 7);
  doc.text(`$${data.totalPerceptions.toFixed(2)}`, 200, finalY + 7, { align: 'right' });

  doc.setTextColor(185, 28, 28);
  doc.text('Total Deducciones Retenidas:', 124, finalY + 14);
  doc.text(`-$${data.totalDeductions.toFixed(2)}`, 200, finalY + 14, { align: 'right' });

  // Línea interna del cuadro
  doc.setDrawColor(204, 251, 241);
  doc.line(124, finalY + 19, 198, finalY + 19);

  // NETO GRANDE
  doc.setTextColor(...primaryColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('NETO RECIBIDO:', 124, finalY + 26);
  doc.setFontSize(13);
  doc.text(`$${data.netPay.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 200, finalY + 26, { align: 'right' });

  // --- SECCIÓN DE FIRMAS ---
  const firmaY = finalY + 50;
  doc.setDrawColor(156, 163, 175);
  doc.setLineWidth(0.2);
  
  // Línea firma patrón
  doc.line(25, firmaY, 85, firmaY);
  // Línea firma empleado
  doc.line(130, firmaY, 190, firmaY);

  doc.setTextColor(107, 114, 128);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Firma Autorizada RRHH', 55, firmaY + 5, { align: 'center' });
  doc.text('Firma de Conformidad Empleado', 160, firmaY + 5, { align: 'center' });

  // Pie de página legal informativo
  doc.setFontSize(7);
  doc.text('Este documento constituye únicamente una simulación de cálculo preliminar y carece de validez como comprobante fiscal digital (CFDI).', 108, 265, { align: 'center' });

  // Guardar archivo directamente en el navegador
  doc.save(`Recibo_Nomina_Proyeccion_${data.netPay.toFixed(0)}.pdf`);
};


  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans antialiased text-gray-800">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* ENCABEZADO CON EL MISMO GRADIENTE COHERENTE */}
        <header className="bg-linear-to-r from-emerald-950 via-emerald-800 to-cyan-700 px-8 py-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">Módulo Financiero RRHH</span>
              <h1 className="text-3xl font-bold tracking-tight mt-0.5">Cálculo y Proyección de Nómina</h1>
            </div>
            <div className="bg-white/10 backdrop-blur-xs px-4 py-2 rounded-lg border border-white/10">
              <p className="text-xs text-emerald-200 text-right">Estructura Fiscal</p>
              <p className="font-medium text-sm text-right">LFT / ISR General</p>
            </div>
          </div>
        </header>

        {/* SECCIÓN BI-COLUMNA: FORMULARIO Y RESULTADOS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
          
          {/* COLUMNA 1: FORMULARIO DE ENTRADAS (7 de 12 columnas) */}
          <form action={formAction} className="p-8 lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Percepciones del Colaborador</h2>
              <p className="text-xs text-gray-500">Ingresa el sueldo base y los montos adicionales correspondientes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Sueldo Base Mensual
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    name="baseSalary"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    defaultValue={data?.baseSalary ?? ""}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-hidden text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Bonos e Incentivos
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    name="bonuses"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    defaultValue={data?.bonuses ?? ""}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-hidden text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Prestaciones y Beneficios (Vales, Aguinaldo proporcional, etc.)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm">$</span>
                <input
                  type="number"
                  name="benefits"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  defaultValue={data?.benefits ?? ""}
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-hidden text-sm"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Retenciones y Obligaciones</h2>
              <p className="text-xs text-gray-500">Cargas fiscales, seguridad social y descuentos internos.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Tasa de Impuestos / ISR
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="taxRate"
                    required
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="16.0"
                    defaultValue={data?.taxRate ?? "16"}
                    className="w-full pr-8 pl-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-hidden text-sm"
                  />
                  <span className="absolute right-3.5 top-2.5 text-gray-400 text-sm">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Otras Deducciones (IMSS, Préstamos)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    name="deductions"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    defaultValue={data?.deductions ?? ""}
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-xs focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 outline-hidden text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isCalculating}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs cursor-pointer text-sm"
              >
                {isCalculating ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Procesando Desglose Financiero...
                  </>
                ) : (
                  'Calcular Nómina Completa'
                )}
              </button>
            </div>
          </form>

          {/* COLUMNA 2: RESULTADOS Y DESGLOSE (5 de 12 columnas) */}
          <aside className="p-8 lg:col-span-5 bg-gray-50 flex flex-col justify-between">
            {data ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Resumen de la Corrida Financiera</h3>
                  <p className="text-xs text-gray-500">Resultados calculados basados en las políticas vigentes.</p>
                </div>

                {/* Tarjeta de Pago Neto Principal */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-800 to-cyan-600"></div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sueldo Neto a Recibir</p>
                  <p className="text-3xl font-extrabold text-emerald-950 mt-1 font-mono">
                    ${data.netPay.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Desglose Analítico */}
                <div className="space-y-3">
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Detalles de Nómina</span>
                  
                  <div className="bg-white p-4 rounded-xl border border-gray-200 divide-y divide-gray-100 shadow-2xs space-y-2.5">
                    <div className="flex justify-between text-sm pt-0">
                      <span className="text-gray-600">Sueldo Base:</span>
                      <span className="font-semibold text-gray-900 font-mono">${data.baseSalary.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2.5">
                      <span className="text-gray-600">Bonos + Prestaciones:</span>
                      <span className="font-semibold text-emerald-700 font-mono">+ ${(data.bonuses + data.benefits).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2.5 font-medium text-gray-900">
                      <span>Total Percepciones Brutas:</span>
                      <span className="font-mono">${data.totalPerceptions.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2.5">
                      <span className="text-gray-600">Impuestos Retenidos:</span>
                      <span className="font-semibold text-rose-600 font-mono">- ${data.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2.5">
                      <span className="text-gray-600">Otras Deducciones:</span>
                      <span className="font-semibold text-rose-600 font-mono">- ${data.deductions.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2.5 font-medium text-rose-700">
                      <span>Total Deducciones:</span>
                      <span className="font-mono">- ${data.totalDeductions.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Visualización rápida de distribución de costos */}
                <div className="pt-2">
                  <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Proporción del Gasto</span>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                    <div 
                      style={{ width: `${(data.netPay / data.totalPerceptions) * 100}%` }} 
                      className="bg-emerald-700 h-full transition-all"
                      title="Sueldo Neto"
                    ></div>
                    <div 
                      style={{ width: `${(data.taxAmount / data.totalPerceptions) * 100}%` }} 
                      className="bg-amber-600 h-full transition-all"
                      title="Impuestos"
                    ></div>
                    <div 
                      style={{ width: `${(data.deductions / data.totalPerceptions) * 100}%` }} 
                      className="bg-rose-700 h-full transition-all"
                      title="Otras Deducciones"
                    ></div>
                  </div>
                  <div className="flex justify-between text-2xs text-gray-500 mt-1.5 font-medium">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-700 inline-block"></span> Neto</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-600 inline-block"></span> ISR</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-700 inline-block"></span> Deducc.</span>
                  </div>
                </div>

                {/* BOTÓN INTERACTIVO DE DESCARGA PDF */}
                <div className="pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => downloadPayrollPDF(data)}
                    className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-[0.99]"
                >
                    <span className="text-emerald-800">📄</span> Descargar Recibo de Nómina (PDF)
                </button>
                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-2xl">
                <div className="text-gray-300 text-4xl mb-2">📊</div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Esperando Parámetros</h3>
                <p className="text-xs text-gray-400 max-w-xs mt-1">
                  Completa los campos obligatorios del formulario a la izquierda y presiona calcular para proyectar la nómina.
                </p>
              </div>
            )}

            <div className="text-2xs text-gray-400 text-center mt-8 pt-4 border-t border-gray-200">
              Cálculos internos de estimación preliminar. No sustituye la timbración fiscal oficial del CFDI.
            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}

export default PayrollCalculate;