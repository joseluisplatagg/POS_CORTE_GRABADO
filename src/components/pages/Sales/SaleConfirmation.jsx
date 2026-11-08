import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import SaleTotals from './SaleTotals'

const money = (amount) =>
  Number(amount || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

const RFC_PATTERN = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i

const SaleConfirmation = ({
  lines,
  subtotal,
  iva,
  total,
  ivaRate,
  requestsInvoice,
  rfc,
  businessName,
  onRequestsInvoiceChange,
  onRfcChange,
  onBusinessNameChange,
  onBack,
  onConfirm,
}) => {
  const [error, setError] = useState('')

  const chooseInvoice = (value) => {
    setError('')
    onRequestsInvoiceChange(value)
    if (!value) {
      onRfcChange('')
      onBusinessNameChange('')
    }
  }

  const handleConfirm = () => {
    if (requestsInvoice === null) {
      setError('Indica si el cliente solicita RFC.')
      return
    }
    if (requestsInvoice && !RFC_PATTERN.test(rfc.trim())) {
      setError('Captura un RFC válido de 12 o 13 caracteres.')
      return
    }
    setError('')
    onConfirm()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
      <section className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resumen de productos solicitados</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4">Servicio</th>
                <th className="p-4">Cant.</th>
                <th className="p-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600">
              {lines.map((line) => (
                <tr key={line.id}>
                  <td className="p-4">
                    <span className="block text-gray-900 font-bold">{line.name}</span>
                    <span className="text-[11px] text-gray-400 font-medium">{line.sku} · {money(line.price)}</span>
                  </td>
                  <td className="p-4 font-mono">{line.quantity}</td>
                  <td className="p-4 text-right font-mono text-gray-800">{money(line.price * line.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4">
          <SaleTotals subtotal={subtotal} iva={iva} total={total} ivaRate={ivaRate} />
        </div>
      </section>

      <section className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
          <FontAwesomeIcon className="text-cyan-800" icon={faFileInvoice} />
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">¿El cliente solicita RFC?</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => chooseInvoice(true)}
            className={`px-3 py-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
              requestsInvoice === true
                ? 'bg-emerald-900 text-white border-emerald-900'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-emerald-50'
            }`}
          >
            Sí, requiere factura
          </button>
          <button
            type="button"
            onClick={() => chooseInvoice(false)}
            className={`px-3 py-3 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
              requestsInvoice === false
                ? 'bg-emerald-900 text-white border-emerald-900'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-emerald-50'
            }`}
          >
            No, público en general
          </button>
        </div>

        {requestsInvoice && (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              RFC
              <input
                type="text"
                maxLength={13}
                value={rfc}
                onChange={(event) => onRfcChange(event.target.value.toUpperCase())}
                placeholder="XAXX010101000"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-semibold normal-case tracking-normal text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Razón social
              <input
                type="text"
                value={businessName}
                onChange={(event) => onBusinessNameChange(event.target.value)}
                placeholder="Nombre o razón social"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold normal-case tracking-normal text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
          </div>
        )}

        {error && (
          <p className="text-xs font-semibold text-rose-600">{error}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
          >
            <FontAwesomeIcon className="pr-2" icon={faArrowLeft} />
            Regresar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
          >
            Confirmar venta
          </button>
        </div>
      </section>
    </div>
  )
}

export default SaleConfirmation
