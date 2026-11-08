import { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons'
import SaleTotals from './SaleTotals'

const money = (amount) =>
  Number(amount || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

const PublicSale = ({
  catalog,
  lines,
  ivaRate,
  subtotal,
  iva,
  total,
  onAddProduct,
  onUpdateQuantity,
  onRemoveLine,
  onContinue,
}) => {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return catalog
    return catalog.filter((product) =>
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  }, [catalog, query])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      <section className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col gap-3">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Buscar servicio</h3>
            <p className="text-[11px] font-medium text-gray-400">Cortes, grabados y extras de sucursal</p>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FontAwesomeIcon className="text-sm text-cyan-800" icon={faMagnifyingGlass} />
            </span>
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nombre, clave o categoría..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4">Servicio</th>
                <th className="p-4 hidden sm:table-cell">Precio</th>
                <th className="p-4 text-right">Agregar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600">
              {results.length > 0 ? results.map((product) => (
                <tr key={product.id} className="hover:bg-emerald-50/20">
                  <td className="p-4">
                    <span className="block text-gray-900 font-bold">{product.name}</span>
                    <span className="text-[11px] font-medium text-gray-400">{product.sku} · {product.category}</span>
                  </td>
                  <td className="p-4 hidden sm:table-cell font-mono text-gray-700">{money(product.price)}</td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => onAddProduct(product)}
                      className="bg-emerald-900 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-2xs cursor-pointer"
                    >
                      <FontAwesomeIcon className="pr-1.5 text-[10px]" icon={faPlus} />
                      Agregar
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-400 italic font-medium">
                    No hay servicios que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col gap-4">
        <div className="border-b border-gray-50 pb-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ticket en curso</h3>
          <p className="text-[11px] font-medium text-gray-400 mt-1">{lines.length} concepto{lines.length === 1 ? '' : 's'}</p>
        </div>

        {lines.length === 0 ? (
          <p className="text-xs text-gray-400 italic font-medium py-6 text-center">
            Agrega un servicio para calcular cantidades, subtotales e IVA.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {lines.map((line) => (
              <li key={line.id} className="border border-gray-100 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{line.name}</p>
                    <p className="text-[11px] text-gray-400 font-medium">{money(line.price)} c/u</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveLine(line.id)}
                    className="text-rose-600 hover:text-rose-800 cursor-pointer"
                    aria-label={`Quitar ${line.name}`}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(line.id, line.quantity - 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 text-emerald-900 hover:bg-emerald-50 cursor-pointer"
                      aria-label={`Disminuir ${line.name}`}
                    >
                      <FontAwesomeIcon icon={faMinus} className="text-[10px]" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={line.quantity}
                      onChange={(event) => onUpdateQuantity(line.id, Number(event.target.value))}
                      className="w-14 text-center py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(line.id, line.quantity + 1)}
                      className="w-7 h-7 rounded-lg border border-gray-200 text-emerald-900 hover:bg-emerald-50 cursor-pointer"
                      aria-label={`Aumentar ${line.name}`}
                    >
                      <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
                    </button>
                  </div>
                  <span className="text-xs font-mono font-bold text-gray-800">{money(line.price * line.quantity)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <SaleTotals subtotal={subtotal} iva={iva} total={total} ivaRate={ivaRate} />

        <button
          type="button"
          disabled={lines.length === 0}
          onClick={onContinue}
          className="bg-emerald-900 hover:bg-emerald-800 disabled:opacity-40 disabled:pointer-events-none text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
        >
          Continuar a confirmación
        </button>
      </section>
    </div>
  )
}

export default PublicSale
