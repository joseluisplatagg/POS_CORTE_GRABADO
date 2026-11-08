const money = (amount) =>
  Number(amount || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

const SaleTotals = ({ subtotal, iva, total, ivaRate }) => {
  const rateLabel = `${Math.round(ivaRate * 100)}%`

  return (
    <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex flex-col gap-2 text-xs font-semibold text-gray-600">
      <div className="flex items-center justify-between">
        <span className="uppercase tracking-wider text-gray-400 font-bold">Subtotal</span>
        <span className="font-mono text-gray-800">{money(subtotal)}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="uppercase tracking-wider text-gray-400 font-bold">IVA ({rateLabel})</span>
        <span className="font-mono text-gray-800">{money(iva)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-emerald-200/70 pt-2">
        <span className="uppercase tracking-wider text-emerald-900 font-black">Total</span>
        <span className="font-mono text-base font-black text-emerald-950">{money(total)}</span>
      </div>
    </div>
  )
}

export default SaleTotals
