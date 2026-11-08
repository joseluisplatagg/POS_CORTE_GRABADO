import { useActionState, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import Field, { inputBase, borderFor, primaryButton } from "./FormField";
import { DEPARTAMENTOS } from "./AgregarItemForm";
import AvisoGuardado from "./AvisoGuardado";

const emptyState = { errors: {}, values: {} };

const dateFormat = new Intl.DateTimeFormat("es-MX", { dateStyle: "short", timeStyle: "short" });

/**
 * Props:
 *  - items: artículos disponibles para dar salida
 *  - salidas: historial de salidas ya registradas (más reciente primero)
 *  - onRegister({ itemId, quantity, destination, notes }): se llama con la salida validada
 */
const initialItems = [
  { id: 1, sku: "TOR-0012", stock: 240, description: "Tornillo hexagonal 1/4 x 2 in", price: 1.8, type: "Refacción", department: "Mantenimiento" },
  { id: 2, sku: "CAB-0045", stock: 35, description: "Cable calibre 12 (rollo 100 m)", price: 780, type: "Materia prima", department: "Producción" },
  { id: 3, sku: "PIN-0230", stock: 18, description: "Pintura vinílica blanca 19 L", price: 1250.5, type: "Producto terminado", department: "Ventas" },
];
export default function SalidaInventarioForm() {
  const [items, setItems] = useState(initialItems);
  const [salidas, setSalidas] = useState([]);
  
   const registerSalida = ({ itemId, quantity, destination, notes }) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    setItems((current) =>
      current.map((i) => (i.id === itemId ? { ...i, stock: i.stock - quantity } : i)),
    );
    setSalidas((current) => [
      {
        id: Date.now(),
        date: new Date(),
        sku: item.sku,
        quantity,
        destination,
        notes,
      },
      ...current,
    ]);
  };

  const [state, formAction, pending] = useActionState((_prev, formData) => {
    const values = {
      itemId: String(formData.get("itemId") ?? ""),
      quantity: String(formData.get("quantity") ?? "").trim(),
      destination: String(formData.get("destination") ?? "").trim(),
      notes: String(formData.get("notes") ?? "").trim(),
    };

    const item = items.find((i) => String(i.id) === values.itemId);
    const quantity = Number(values.quantity);

    const errors = {};
    if (!item) errors.itemId = "Selecciona un artículo.";

    if (values.quantity === "" || !Number.isInteger(quantity) || quantity < 1)
      errors.quantity = "Escribe un número entero de 1 o más.";
    else if (item && quantity > item.stock) errors.quantity = `Solo hay ${item.stock} en existencia.`;

    if (!values.destination) errors.destination = "Indica el destino.";

    registerSalida({
      itemId: item.id,
      quantity,
      destination: values.destination,
      notes: values.notes,
    });

    if (Object.keys(errors).length > 0) return { errors, values, saved: null };

    //const item = { id: Date.now(), sku: values.sku, stock: Number(values.stock), description: values.description, price: Number(values.price), type: values.type, department: values.department };
    //onAdd(item);

   return {
      errors: {},
      values: {},
      saved: {
        id: item.id,
        title: "Registro de salida exitoso",
        message: "El artículo se ha registrado como salida.",
        details: [
          { label: "SKU", value: item.sku },
          { label: "Descripción", value: item.description },
          { label: "Existencias", value: item.stock },
          { label: "Tipo", value: item.type },
          { label: "Departamento", value: item.department },
        ],
      },
    };
  }, emptyState);

  const [dismissedId, setDismissedId] = useState(null);
  const saved = state.saved && state.saved.id !== dismissedId ? state.saved : null;
  const { errors, values } = state;

  return (
    <>
    <section className="border-t border-slate-200">
      <form action={formAction} noValidate className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Registrar salida</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          <Field label="Artículo" error={errors.itemId} className="sm:col-span-2 lg:col-span-5">
            {(id, err) => (
              <select
                id={id}
                name="itemId"
                defaultValue={values.itemId ?? ""}
                disabled={items.length === 0}
                aria-invalid={!!errors.itemId}
                aria-describedby={err}
                className={`${inputBase} ${borderFor(errors.itemId)} disabled:bg-slate-100`}
              >
                <option value="" disabled>
                  {items.length === 0 ? "No hay artículos registrados" : "Selecciona un artículo"}
                </option>
                {items.map((i) => (
                  <option key={i.id} value={i.id} disabled={i.stock === 0}>
                    {`${i.sku} - ${i.description} (${i.stock} en existencia)`}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <Field label="Cantidad" error={errors.quantity} className="lg:col-span-2">
            {(id, err) => (
              <input
                id={id}
                name="quantity"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                defaultValue={values.quantity}
                placeholder="0"
                aria-invalid={!!errors.quantity}
                aria-describedby={err}
                className={`${inputBase} ${borderFor(errors.quantity)}`}
              />
            )}
          </Field>

          <Field label="Destino" error={errors.destination} className="lg:col-span-5">
            {(id, err) => (
              <>
                <input
                  id={id}
                  name="destination"
                  list="destinos-sugeridos"
                  defaultValue={values.destination}
                  placeholder="Departamento, cliente o sucursal"
                  autoComplete="off"
                  aria-invalid={!!errors.destination}
                  aria-describedby={err}
                  className={`${inputBase} ${borderFor(errors.destination)}`}
                />
                <datalist id="destinos-sugeridos">
                  {DEPARTAMENTOS.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
              </>
            )}
          </Field>

          <Field label="Observaciones" error={errors.notes} className="sm:col-span-2 lg:col-span-12">
            {(id, err) => (
              <textarea
                id={id}
                name="notes"
                rows={3}
                maxLength={300}
                defaultValue={values.notes}
                placeholder="Opcional: motivo, folio de entrega, quién recibe"
                aria-describedby={err}
                className={`${inputBase} ${borderFor(errors.notes)} resize-y`}
              />
            )}
          </Field>
        </div>

        <div className="mt-5 flex justify-end">
          <button type="submit" disabled={pending || items.length === 0} className={primaryButton}>
            <FontAwesomeIcon icon={faTruck} />
            Registrar salida
          </button>
        </div>
      </form>

      <div className="overflow-x-auto border-t border-slate-200">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">Fecha</th>
              <th scope="col" className="px-6 py-3 font-semibold">SKU</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold">Cantidad</th>
              <th scope="col" className="px-6 py-3 font-semibold">Destino</th>
              <th scope="col" className="px-6 py-3 font-semibold">Observaciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {salidas.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Aún no hay salidas registradas.
                </td>
              </tr>
            ) : (
              salidas.map((s) => (
                <tr key={s.id} className="hover:bg-emerald-50/50">
                  <td className="whitespace-nowrap px-6 py-3 text-slate-600">{dateFormat.format(s.date)}</td>
                  <td className="px-6 py-3 font-medium text-slate-900">{s.sku}</td>
                  <td className="px-6 py-3 text-right tabular-nums">{s.quantity}</td>
                  <td className="px-6 py-3 text-slate-700">{s.destination}</td>
                  <td className="px-6 py-3 text-slate-600">{s.notes || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>

    {saved && (
        <AvisoGuardado
          key={saved.id}
          title={saved.title}
          message={saved.message}
          details={saved.details}
          autoCloseMs={8000}
          onClose={() => setDismissedId(saved.id)}
        />
      )}
    </>
  );
}
