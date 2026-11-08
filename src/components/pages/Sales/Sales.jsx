import { useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCashRegister } from '@fortawesome/free-solid-svg-icons'
import PublicSale from './PublicSale'
import SaleConfirmation from './SaleConfirmation'
import SaleTicket from './SaleTicket'

const IVA_RATE = 0.16

const CATALOG = [
  { id: 'srv-01', sku: 'CL-MDF', name: 'Corte láser en MDF', price: 120, category: 'Corte' },
  { id: 'srv-02', sku: 'CL-ACR', name: 'Corte láser en acrílico', price: 220, category: 'Corte' },
  { id: 'srv-03', sku: 'GR-MAD', name: 'Grabado en madera', price: 180, category: 'Grabado' },
  { id: 'srv-04', sku: 'GR-MET', name: 'Grabado en metal', price: 80, category: 'Grabado' },
  { id: 'srv-05', sku: 'GR-LOG', name: 'Grabado de logotipo personalizado', price: 150, category: 'Personalización' },
  { id: 'srv-06', sku: 'DS-VEC', name: 'Diseño y vectorización de archivo', price: 35, category: 'Extra' },
]

const STEPS = ['Venta al público', 'Confirmación', 'Ticket']

const Sales = () => {
  const [step, setStep] = useState(0)
  const [lines, setLines] = useState([])
  const [requestsInvoice, setRequestsInvoice] = useState(null)
  const [rfc, setRfc] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [ticket, setTicket] = useState(null)

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
    [lines]
  )
  const iva = useMemo(() => subtotal * IVA_RATE, [subtotal])
  const total = subtotal + iva

  const addProduct = (product) => {
    setLines((current) => {
      const existing = current.find((line) => line.id === product.id)
      if (!existing) {
        return [...current, { ...product, quantity: 1 }]
      }
      return current.map((line) =>
        line.id === product.id ? { ...line, quantity: line.quantity + 1 } : line
      )
    })
  }

  const updateQuantity = (id, quantity) => {
    const nextQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 0
    if (nextQuantity < 1) {
      setLines((current) => current.filter((line) => line.id !== id))
      return
    }
    setLines((current) =>
      current.map((line) => (line.id === id ? { ...line, quantity: nextQuantity } : line))
    )
  }

  const removeLine = (id) => {
    setLines((current) => current.filter((line) => line.id !== id))
  }

  const confirmSale = () => {
    const folio = `CW-${Date.now().toString().slice(-6)}`
    setTicket({
      folio,
      issuedAt: new Date().toISOString(),
      lines,
      subtotal,
      iva,
      total,
      requestsInvoice,
      rfc,
      businessName,
    })
    setStep(2)
  }

  const startNewSale = () => {
    setLines([])
    setRequestsInvoice(null)
    setRfc('')
    setBusinessName('')
    setTicket(null)
    setStep(0)
  }

  return (
    <div className="w-full flex flex-col gap-6 text-left">
      <div className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-base font-black text-gray-900 tracking-tight">
            <FontAwesomeIcon className="pr-2 text-xl text-cyan-800" icon={faCashRegister} />
            Crear venta
          </h2>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Punto de venta · Sucursal Corte y Grabado 1
          </p>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {STEPS.map((label, index) => (
            <li
              key={label}
              className={`rounded-xl px-3 py-2 text-xs font-bold border ${
                index === step
                  ? 'bg-emerald-900 text-white border-emerald-900'
                  : index < step
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                    : 'bg-white text-gray-400 border-gray-100'
              }`}
            >
              {index + 1}. {label}
            </li>
          ))}
        </ol>
      </div>

      {step === 0 && (
        <PublicSale
          catalog={CATALOG}
          lines={lines}
          ivaRate={IVA_RATE}
          subtotal={subtotal}
          iva={iva}
          total={total}
          onAddProduct={addProduct}
          onUpdateQuantity={updateQuantity}
          onRemoveLine={removeLine}
          onContinue={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <SaleConfirmation
          lines={lines}
          subtotal={subtotal}
          iva={iva}
          total={total}
          ivaRate={IVA_RATE}
          requestsInvoice={requestsInvoice}
          rfc={rfc}
          businessName={businessName}
          onRequestsInvoiceChange={setRequestsInvoice}
          onRfcChange={setRfc}
          onBusinessNameChange={setBusinessName}
          onBack={() => setStep(0)}
          onConfirm={confirmSale}
        />
      )}

      {step === 2 && ticket && (
        <SaleTicket
          folio={ticket.folio}
          issuedAt={ticket.issuedAt}
          lines={ticket.lines}
          subtotal={ticket.subtotal}
          iva={ticket.iva}
          total={ticket.total}
          ivaRate={IVA_RATE}
          requestsInvoice={ticket.requestsInvoice}
          rfc={ticket.rfc}
          businessName={ticket.businessName}
          onNewSale={startNewSale}
        />
      )}
    </div>
  )
}

export default Sales
