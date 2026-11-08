import { useEffect, useRef } from "react";
import { primaryButton } from "./FormField";

/**
 * Aviso genérico de "guardado correctamente". Sirve para un item nuevo, una salida
 * o cualquier otro registro: el contenido llega por props.
 *
 * Props:
 *  - title: texto principal ("Item guardado")
 *  - message: texto secundario opcional
 *  - details: lista de { label, value } para resumir lo que se guardó
 *  - onClose: se llama al presionar el botón o al cumplirse autoCloseMs
 *  - closeLabel: texto del botón (por defecto "Entendido")
 *  - autoCloseMs: milisegundos para cerrarse solo; 0 lo deja abierto hasta que se cierre
 *
 * Para que el temporizador reinicie con cada aviso nuevo, usa una `key` distinta
 * en cada uno (por ejemplo key={notice.id}).
 */
export default function AvisoGuardado({
  title,
  message,
  details = [],
  onClose,
  closeLabel = "Entendido",
  autoCloseMs = 0,
}) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!autoCloseMs) return undefined;
    const timer = setTimeout(() => onCloseRef.current?.(), autoCloseMs);
    return () => clearTimeout(timer);
  }, [autoCloseMs]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-xl"
    >
      <div className="flex items-start gap-3 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
            />
          </svg>
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          {message && <p className="mt-0.5 text-sm text-slate-600">{message}</p>}

          {details.length > 0 && (
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
              {details.map(({ label, value }) => (
                <div key={label} className="contents">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="break-words font-medium text-slate-900">{value || "—"}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-4 py-3">
        <button type="button" onClick={onClose} className={primaryButton}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
