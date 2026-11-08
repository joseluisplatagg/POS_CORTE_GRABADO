// ui elements
import Title from "./Title";

export default function Hero({ title, image, className = "" }) {
  return (
    <div className="relative w-full min-h-50 flex flex-col items-center justify-center  overflow-hidden 
                      bg-linear-to-r from-emerald-950 via-emerald-800 to-cyan-700 text-white select-none
                      ">
  
    {/* Efecto de manchas de luz orgánicas del fondo */}
    <div 
      className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen"
      style={{
        backgroundImage: `radial-gradient(circle at 15% 45%, rgba(217, 70, 239, 0.55) 0%, transparent 50%), radial-gradient(circle at 85% 35%, rgba(37, 99, 235, 0.45) 0%, transparent 55%)`
      }}
    />

    {/* Contenedor central */}
    <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto w-full">
      {/* TÍTULO PRINCIPAL (Serif elegante con peso normal/ligero) */}
      <h4 className="font-serif italic md:not-italic text-4xl sm:text-6xl md:text-4xl lg:text-4xl font-normal tracking-normal text-white drop-shadow-md leading-[1.15]">
        {title || "Actualización"}
      </h4>

      {/* SUBTÍTULO (Sans-serif liviano con tracking amplio) */}
      <p className="mt-4 text-xs sm:text-sm md:text-base font-light tracking-[0.18em] uppercase text-white/95 max-w-2xl px-2">
      POS - Sistema de Gestión de Puntos de Venta
      </p>

    </div>
  </div>

  );
}
