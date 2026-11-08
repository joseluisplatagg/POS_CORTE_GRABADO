import { useId } from "react";

export const inputBase =
  "w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 " +
  "focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600";

export const borderFor = (error) => (error ? "border-red-500" : "border-slate-300");

export const primaryButton =
  "inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export default function Field({ label, error, className = "", children }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children(id, error ? `${id}-error` : undefined)}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
