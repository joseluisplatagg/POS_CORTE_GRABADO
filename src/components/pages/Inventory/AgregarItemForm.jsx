import { useActionState, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Field, { inputBase, borderFor, primaryButton } from "./FormField";
import AvisoGuardado  from "./AvisoGuardado";
// eslint-disable-next-line react-refresh/only-export-components
export const TIPOS = ["Materia prima", "Producto terminado", "Refacción", "Consumible", "Herramienta"];
// eslint-disable-next-line react-refresh/only-export-components
export const DEPARTAMENTOS = ["Almacén", "Producción", "Mantenimiento", "Ventas", "Compras"];

const emptyState = { errors: {}, values: {} };

const initialItems = [
  { id: 1, sku: "TOR-0012", stock: 240, description: "Tornillo hexagonal 1/4 x 2 in", price: 1.8, type: "Refacción", department: "Mantenimiento" },
  { id: 2, sku: "CAB-0045", stock: 35, description: "Cable calibre 12 (rollo 100 m)", price: 780, type: "Materia prima", department: "Producción" },
  { id: 3, sku: "PIN-0230", stock: 18, description: "Pintura vinílica blanca 19 L", price: 1250.5, type: "Producto terminado", department: "Ventas" },
];

/**
 * Props:
 *  - items: artículos actuales (para validar que el SKU no se repita)
 *  - onAdd(item): se llama con el artículo nuevo ya validado
 */
export default function AgregarItemForm() {
  const [items] = useState(initialItems);
  const [state, formAction, pending] = useActionState((_prev, formData) => {
    const values = {
      sku: String(formData.get("sku") ?? "").trim().toUpperCase(),
      stock: String(formData.get("stock") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      price: String(formData.get("price") ?? "").trim(),
      type: String(formData.get("type") ?? ""),
      department: String(formData.get("department") ?? ""),
    };

    const errors = {};
    if (!values.sku) errors.sku = "Escribe el SKU.";
    else if (items.some((i) => i.sku === values.sku)) errors.sku = "Este SKU ya está en la tabla.";

    if (values.stock === "" || !Number.isInteger(Number(values.stock)) || Number(values.stock) < 0)
      errors.stock = "Escribe un número entero de 0 o más.";

    if (!values.description) errors.description = "Escribe la descripción.";

    if (values.price === "" || Number.isNaN(Number(values.price)) || Number(values.price) < 0)
      errors.price = "Escribe un precio de 0 o más.";

    if (!TIPOS.includes(values.type)) errors.type = "Selecciona el tipo.";
    if (!DEPARTAMENTOS.includes(values.department)) errors.department = "Selecciona el departamento.";

    
    if (Object.keys(errors).length > 0) return { errors, values, saved: null };

    const item = { id: Date.now(), sku: values.sku, stock: Number(values.stock), description: values.description, price: Number(values.price), type: values.type, department: values.department };
    //onAdd(item);

   return {
      errors: {},
      values: {},
      saved: {
        id: item.id,
        title: "Item guardado",
        message: "El artículo se agregó al inventario.",
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

  // El state de la acción no se puede "limpiar" desde fuera, así que el cierre se guarda aparte
  const [dismissedId, setDismissedId] = useState(null);
  const saved = state.saved && state.saved.id !== dismissedId ? state.saved : null;

  const { errors, values } = state;

  return (
    <>
    <form action={formAction} noValidate className="border-b border-slate-200 p-6">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Agregar item</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        <Field label="SKU" error={errors.sku} className="lg:col-span-2">
          {(id, err) => (
            <input
              id={id}
              name="sku"
              defaultValue={values.sku}
              placeholder="TOR-0012"
              autoComplete="off"
              aria-invalid={!!errors.sku}
              aria-describedby={err}
              className={`${inputBase} ${borderFor(errors.sku)}`}
            />
          )}
        </Field>

        <Field label="Existencias" error={errors.stock} className="lg:col-span-2">
          {(id, err) => (
            <input
              id={id}
              name="stock"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              defaultValue={values.stock}
              placeholder="0"
              aria-invalid={!!errors.stock}
              aria-describedby={err}
              className={`${inputBase} ${borderFor(errors.stock)}`}
            />
          )}
        </Field>

        <Field label="Descripción" error={errors.description} className="sm:col-span-2 lg:col-span-5">
          {(id, err) => (
            <input
              id={id}
              name="description"
              defaultValue={values.description}
              placeholder="Nombre o detalle del artículo"
              autoComplete="off"
              aria-invalid={!!errors.description}
              aria-describedby={err}
              className={`${inputBase} ${borderFor(errors.description)}`}
            />
          )}
        </Field>

        <Field label="Precio unitario" error={errors.price} className="lg:col-span-3">
          {(id, err) => (
            <input
              id={id}
              name="price"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              defaultValue={values.price}
              placeholder="0.00"
              aria-invalid={!!errors.price}
              aria-describedby={err}
              className={`${inputBase} ${borderFor(errors.price)}`}
            />
          )}
        </Field>

        <Field label="Tipo" error={errors.type} className="lg:col-span-4">
          {(id, err) => (
            <select
              id={id}
              name="type"
              defaultValue={values.type ?? ""}
              aria-invalid={!!errors.type}
              aria-describedby={err}
              className={`${inputBase} ${borderFor(errors.type)}`}
            >
              <option value="" disabled>
                Selecciona un tipo
              </option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </Field>

        <Field label="Departamento" error={errors.department} className="lg:col-span-4">
          {(id, err) => (
            <select
              id={id}
              name="department"
              defaultValue={values.department ?? ""}
              aria-invalid={!!errors.department}
              aria-describedby={err}
              className={`${inputBase} ${borderFor(errors.department)}`}
            >
              <option value="" disabled>
                Selecciona un departamento
              </option>
              {DEPARTAMENTOS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </Field>

        <div className="flex items-end justify-end sm:col-span-2 lg:col-span-4">
          <button type="submit" disabled={pending} className={primaryButton}>
            <FontAwesomeIcon icon={faPlusCircle} />
            Agregar Item
          </button>
        </div>
      </div>
    </form>

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
