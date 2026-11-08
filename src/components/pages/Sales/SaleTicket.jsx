import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReceipt } from '@fortawesome/free-solid-svg-icons'
import SaleTotals from './SaleTotals'

const money = (amount) =>
  Number(amount || 0).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

const SaleTicket = ({
  folio,
  issuedAt,
  lines,
  subtotal,
  iva,
  total,
  ivaRate,
  requestsInvoice,
  rfc,
  businessName,
  onNewSale,
}) => {
  const issuedLabel = new Date(issuedAt).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className="flex justify-center">
      <article className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <header className="bg-linear-to-r from-emerald-950 via-emerald-800 to-cyan-700 px-6 py-5 text-white text-center">
          <FontAwesomeIcon icon={faReceipt} className="text-emerald-200 mb-2" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-200">Sucursal Car Wash</p>
          <h3 className="text-lg font-black tracking-tight">Ticket de venta</h3>
          <p className="text-xs text-emerald-100 mt-1">Folio {folio}</p>
        </header>

        <div className="px-6 py-5 flex flex-col gap-4">
          <div className="flex justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            <span>Emisión</span>
            <span className="normal-case tracking-normal text-gray-700 font-mono">{issuedLabel}</span>
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider gap-3">
            <span>Cliente</span>
            <span className="normal-case tracking-normal text-right text-gray-700">
              {requestsInvoice ? (businessName || rfc) : 'Público en general'}
            </span>
          </div>
          {requestsInvoice && (
            <div className="flex justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <span>RFC</span>
              <span className="font-mono text-gray-800">{rfc}</span>
            </div>
          )}

          <ul className="border-y border-dashed border-gray-200 py-3 flex flex-col gap-3">
            {lines.map((line) => (
              <li key={line.id} className="flex items-start justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-gray-900">{line.name}</p>
                  <p className="text-[11px] text-gray-400 font-medium">
                    {line.quantity} × {money(line.price)}
                  </p>
                </div>
                <span className="font-mono font-bold text-gray-800">{money(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>

          <SaleTotals subtotal={subtotal} iva={iva} total={total} ivaRate={ivaRate} />

          <div className="text-center pt-2">
            <p className="text-sm font-black text-emerald-950">Gracias por su preferencia</p>
            <p className="text-xs font-semibold text-emerald-800 mt-1">Vuelva pronto</p>
          </div>

          <button
            type="button"
            onClick={onNewSale}
            className="bg-emerald-900 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xs cursor-pointer"
          >
            Nueva venta
          </button>
        </div>
      </article>
    </div>
  )
}

export default SaleTicket
