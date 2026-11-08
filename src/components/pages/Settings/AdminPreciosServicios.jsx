import { useId, useMemo, useState, useTransition } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faMagnifyingGlass,
  faRotateLeft,
  faTags,
} from "@fortawesome/free-solid-svg-icons";

/* ------------------------------------------------------------------ */
/* Datos de ejemplo: sustituir por el CATALOG real (TanStack Query).   */
/* Estructura: { id, sku, name, price, category }                      */
/* ------------------------------------------------------------------ */
const CATALOG_INICIAL = [
  { id: 1, sku: "COR-ACR-03", name: "Corte láser en acrílico 3 mm", price: 85, category: "Corte" },
  { id: 2, sku: "COR-ACR-05", name: "Corte láser en acrílico 5 mm", price: 120, category: "Corte" },
  { id: 3, sku: "COR-MDF-03", name: "Corte láser en MDF 3 mm", price: 60, category: "Corte" },
  { id: 4, sku: "COR-MAD-06", name: "Corte láser en madera 6 mm", price: 95, category: "Corte" },
  { id: 5, sku: "GRB-MAD-01", name: "Grabado en madera", price: 75, category: "Grabado" },
  { id: 6, sku: "GRB-MET-01", name: "Grabado en metal anodizado", price: 140, category: "Grabado" },
  { id: 7, sku: "GRB-VID-01", name: "Grabado en vidrio", price: 110, category: "Grabado" },
  { id: 8, sku: "GRB-CUE-01", name: "Grabado en cuero", price: 90, category: "Grabado" },
  { id: 9, sku: "DIS-VEC-01", name: "Vectorizado de diseño", price: 180, category: "Diseño" },
];

const moneda = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

/** Devuelve un número válido (>= 0, máx. 2 decimales) o null. */
function parsePrecio(texto) {
  const limpio = String(texto).trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(limpio)) return null;
  return Number(limpio);
}

function variacion(anterior, nuevo) {
  if (anterior === 0) return null;
  return ((nuevo - anterior) / anterior) * 100;
}

/* Valor por defecto de onSave: simula una petición. Reemplazar por la mutación real. */
async function guardarSimulado(cambios) {
  await new Promise((r) => setTimeout(r, 700));
  return cambios;
}

export default function AdminPreciosServicios({
  servicios = CATALOG_INICIAL,
  onSave = guardarSimulado,
}) {
  const idBusqueda = useId();
  const idCategoria = useId();
  const idAjuste = useId();

  const [vigentes, setVigentes] = useState(servicios);
  const [borradores, setBorradores] = useState({}); // { [id]: "texto del input" }
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [porcentaje, setPorcentaje] = useState("");
  const [estado, setEstado] = useState(null); // { tipo: "ok" | "error", texto }
  const [guardando, iniciarGuardado] = useTransition();

  const categorias = useMemo(
    () => ["Todas", ...new Set(vigentes.map((s) => s.category))],
    [vigentes],
  );

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return vigentes.filter(
      (s) =>
        (categoria === "Todas" || s.category === categoria) &&
        (!q || s.name.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q)),
    );
  }, [vigentes, busqueda, categoria]);

  /* Cambios válidos pendientes e inputs con error */
  const { cambios, invalidos } = useMemo(() => {
    const c = [];
    let inv = 0;
    for (const s of vigentes) {
      if (!(s.id in borradores)) continue;
      const nuevo = parsePrecio(borradores[s.id]);
      if (nuevo === null) inv += 1;
      else if (nuevo !== s.price) c.push({ ...s, nuevo });
    }
    return { cambios: c, invalidos: inv };
  }, [vigentes, borradores]);

  const hayPendientes = Object.keys(borradores).length > 0;

  function editar(id, texto) {
    setEstado(null);
    setBorradores((prev) => ({ ...prev, [id]: texto }));
  }

  function revertirFila(id) {
    setBorradores((prev) => {
      const { [id]: _omitido, ...resto } = prev;
      return resto;
    });
  }

  function descartarTodo() {
    setBorradores({});
    setEstado(null);
  }

  function aplicarAjuste() {
    const pct = Number(porcentaje.replace(",", "."));
    if (!Number.isFinite(pct) || porcentaje.trim() === "") return;
    setEstado(null);
    setBorradores((prev) => {
      const siguiente = { ...prev };
      for (const s of visibles) {
        const base = s.price * (1 + pct / 100);
        siguiente[s.id] = Math.max(0, Math.round(base * 100) / 100).toFixed(2);
      }
      return siguiente;
    });
  }

  function guardar() {
    if (!cambios.length || invalidos) return;
    iniciarGuardado(async () => {
      try {
        await onSave(cambios.map(({ id, sku, price, nuevo }) => ({ id, sku, anterior: price, nuevo })));
        const mapa = new Map(cambios.map((c) => [c.id, c.nuevo]));
        setVigentes((prev) => prev.map((s) => (mapa.has(s.id) ? { ...s, price: mapa.get(s.id) } : s)));
        setBorradores({});
        setEstado({
          tipo: "ok",
          texto: `${cambios.length} ${cambios.length === 1 ? "precio actualizado" : "precios actualizados"}.`,
        });
      } catch {
        setEstado({
          tipo: "error",
          texto: "No se pudieron guardar los precios. Revisa tu conexión e inténtalo de nuevo.",
        });
      }
    });
  }

  const campo =
    "rounded-lg border border-emerald-900/25 bg-white px-3 py-2 text-sm text-emerald-950 " +
    "placeholder:text-emerald-900/40 focus:border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-600/40";

  return (
    <div className="min-h-screen bg-emerald-50/60 text-emerald-950">
      {/* Encabezado con las clases solicitadas */}
      <header className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-cyan-700 px-6 py-5 text-white text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          <FontAwesomeIcon icon={faTags} className="mr-2" aria-hidden="true" />
          Precios de servicios
        </h1>
        <p className="mt-1 text-sm text-emerald-100">
          Revisa, edita y actualiza los precios del catálogo de corte y grabado láser.
        </p>
      </header>

      <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6">
        {/* Filtros y ajuste masivo */}
        <section
          aria-label="Filtros y ajuste de precios"
          className="grid gap-4 rounded-xl border border-emerald-900/15 bg-white p-4 shadow-sm md:grid-cols-[1fr_auto_auto]"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor={idBusqueda} className="text-sm font-medium">
              Buscar servicio
            </label>
            <div className="relative">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900/50"
              />
              <input
                id={idBusqueda}
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Nombre o SKU"
                className={`${campo} w-full pl-9`}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={idCategoria} className="text-sm font-medium">
              Categoría
            </label>
            <select
              id={idCategoria}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className={campo}
            >
              {categorias.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor={idAjuste} className="text-sm font-medium">
              Ajustar visibles (%)
            </label>
            <div className="flex gap-2">
              <input
                id={idAjuste}
                type="number"
                step="0.1"
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
                placeholder="Ej. 8 o -5"
                className={`${campo} w-28`}
              />
              <button
                type="button"
                onClick={aplicarAjuste}
                disabled={porcentaje.trim() === "" || !visibles.length}
                className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Aplicar
              </button>
            </div>
          </div>
        </section>

        {/* Tabla */}
        <section className="overflow-hidden rounded-xl border border-emerald-900/15 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <caption className="sr-only">Precios vigentes y nuevos de cada servicio</caption>
              <thead className="bg-emerald-900 text-white">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">SKU</th>
                  <th scope="col" className="px-4 py-3 font-medium">Servicio</th>
                  <th scope="col" className="px-4 py-3 font-medium">Categoría</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Precio vigente</th>
                  <th scope="col" className="px-4 py-3 font-medium">Nuevo precio</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Cambio</th>
                  <th scope="col" className="px-4 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/10">
                {visibles.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-emerald-900/70">
                      Ningún servicio coincide con la búsqueda. Cambia el texto o la categoría.
                    </td>
                  </tr>
                )}

                {visibles.map((s) => {
                  const editando = s.id in borradores;
                  const texto = editando ? borradores[s.id] : "";
                  const nuevo = editando ? parsePrecio(texto) : null;
                  const invalido = editando && nuevo === null;
                  const modificado = editando && nuevo !== null && nuevo !== s.price;
                  const delta = modificado ? variacion(s.price, nuevo) : null;
                  const errId = `err-${s.id}`;

                  return (
                    <tr key={s.id} className={modificado ? "bg-cyan-50" : invalido ? "bg-red-50" : undefined}>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{s.sku}</td>
                      <td className="px-4 py-3 font-medium">{s.name}</td>
                      <td className="px-4 py-3 text-emerald-900/80">{s.category}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                        {moneda.format(s.price)}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          inputMode="decimal"
                          aria-label={`Nuevo precio de ${s.name}`}
                          aria-invalid={invalido || undefined}
                          aria-describedby={invalido ? errId : undefined}
                          value={editando ? texto : s.price.toFixed(2)}
                          onFocus={() => !editando && editar(s.id, s.price.toFixed(2))}
                          onChange={(e) => editar(s.id, e.target.value)}
                          className={`${campo} w-28 text-right tabular-nums ${
                            invalido ? "border-red-600 focus:border-red-600 focus:ring-red-600/40" : ""
                          }`}
                        />
                        {invalido && (
                          <p id={errId} className="mt-1 text-xs text-red-700">
                            Usa un número con máximo 2 decimales.
                          </p>
                        )}
                      </td>
                      <td
                        className={`whitespace-nowrap px-4 py-3 text-right tabular-nums ${
                          delta === null ? "text-emerald-900/40" : delta > 0 ? "text-emerald-800" : "text-amber-700"
                        }`}
                      >
                        {delta === null ? "—" : `${delta > 0 ? "+" : ""}${delta.toFixed(1)}%`}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {editando && (
                          <button
                            type="button"
                            onClick={() => revertirFila(s.id)}
                            aria-label={`Restablecer precio de ${s.name}`}
                            title="Restablecer"
                            className="rounded-md p-2 text-emerald-900/70 hover:bg-emerald-100 hover:text-emerald-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-600"
                          >
                            <FontAwesomeIcon icon={faRotateLeft} aria-hidden="true" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Barra de guardado */}
        <section
          aria-label="Guardar cambios"
          className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-900/20 bg-white px-4 py-3 shadow-lg"
        >
          <p role="status" aria-live="polite" className="text-sm">
            {estado ? (
              <span className={estado.tipo === "ok" ? "text-emerald-800" : "text-red-700"}>{estado.texto}</span>
            ) : invalidos > 0 ? (
              <span className="text-red-700">
                Corrige {invalidos} {invalidos === 1 ? "precio" : "precios"} antes de guardar.
              </span>
            ) : cambios.length > 0 ? (
              <>
                <strong>{cambios.length}</strong> {cambios.length === 1 ? "cambio pendiente" : "cambios pendientes"}
              </>
            ) : (
              <span className="text-emerald-900/70">Sin cambios pendientes.</span>
            )}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={descartarTodo}
              disabled={!hayPendientes || guardando}
              className="rounded-lg border border-emerald-900/30 px-4 py-2 text-sm font-medium hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={guardar}
              disabled={!cambios.length || invalidos > 0 || guardando}
              className="rounded-lg bg-gradient-to-r from-emerald-950 via-emerald-800 to-cyan-700 px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" aria-hidden="true" />
              {guardando ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
