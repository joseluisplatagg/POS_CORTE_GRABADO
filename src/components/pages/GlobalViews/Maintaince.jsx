import React from 'react';

export default function Maintaince() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans antialiased text-gray-800">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 text-center relative">
        
        {/* TOP BRAND ACCENT BAR USING YOUR EXACT GRADIENT */}
        <div className="bg-linear-to-r from-emerald-950 via-emerald-800 to-cyan-700 h-3 w-full"></div>
        
        <div className="p-8 space-y-6">
          
          {/* INTERACTIVE PULSING ICON BADGE */}
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-2xs relative">
            <span className="text-3xl animate-bounce duration-1000">⚙️</span>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          {/* MAIN MESSAGE */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              Mantenimiento Programado
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight pt-2">
              Mejorando tu Plataforma
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto">
              Estamos realizando optimizaciones en los servidores del módulo de Finanzas y Contabilidad para ofrecerte mayor rapidez en tus conciliaciones fiscales.
            </p>
          </div>

          {/* SYSTEM PROGRESS INDICATOR BAR */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              <span>Progreso de Actualización</span>
              <span className="text-emerald-800 font-mono animate-pulse">Ejecutando Scripts...</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner relative">
              <div className="bg-linear-to-r from-emerald-800 to-cyan-600 h-full w-3/4 rounded-full transition-all duration-500 animate-pulse"></div>
            </div>
          </div>

          {/* ACTION / SUPPORT CONTACT */}
          <div className="pt-2">
            <p className="text-[11px] text-gray-400">
              ¿Necesitas acceso urgente a tus libros contables?
            </p>
            <a 
              href="mailto:soporte@tuempresa.com"
              className="inline-block mt-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors border-b border-emerald-800/30 hover:border-emerald-950 pb-0.5 cursor-pointer"
            >
              Contactar a Soporte TI
            </a>
          </div>

        </div>

        {/* FOOTER AUDIT TIMESTAMP */}
        <div className="bg-gray-50 py-3 text-[9px] text-gray-400 border-t border-gray-100 font-mono">
          Estimado de restauración: Menos de 15 minutos.
        </div>

      </div>
    </div>
  );
}