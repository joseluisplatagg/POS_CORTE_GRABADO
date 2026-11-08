import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faFilePdf, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import AgregarItemForm from "./AgregarItemForm";
import SalidaInventarioForm from "./SalidaInventarioForm";
import { primaryButton } from "./FormField";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

const initialItems = [
  { id: 1, sku: "TOR-0012", stock: 240, description: "Tornillo hexagonal 1/4 x 2 in", price: 1.8, type: "Refacción", department: "Mantenimiento" },
  { id: 2, sku: "CAB-0045", stock: 35, description: "Cable calibre 12 (rollo 100 m)", price: 780, type: "Materia prima", department: "Producción" },
  { id: 3, sku: "PIN-0230", stock: 18, description: "Pintura vinílica blanca 19 L", price: 1250.5, type: "Producto terminado", department: "Ventas" },
];

export default function InventoryControl() {
  const [items, setItems] = useState(initialItems);
  const [busqueda, setBusqueda] = useState('');

  const removeItem = (id) => setItems((current) => current.filter((i) => i.id !== id));

  

  const totalUnits = items.reduce((sum, i) => sum + i.stock, 0);
  const totalValue = items.reduce((sum, i) => sum + i.stock * i.price, 0);

  const today = () => new Date().toISOString().slice(0, 10);

  const exportExcel = async () => {
    const XLSX = await import("xlsx");
    const money = '"$"#,##0.00';

    const rows = [
      ["SKU", "Existencias", "Descripción", "Tipo", "Departamento", "Precio unitario", "Subtotal"],
    ];
    items.forEach((i) =>
      rows.push([i.sku, i.stock, i.description, i.type, i.department, i.price, i.stock * i.price]),
    );
    const sheet = XLSX.utils.aoa_to_sheet(rows);

    // Subtotales y totales como fórmulas para que el archivo siga siendo editable
    items.forEach((item, idx) => {
      const r = idx + 2;
      sheet[`F${r}`].z = money;
      sheet[`G${r}`] = { t: "n", f: `B${r}*F${r}`, v: item.stock * item.price, z: money };
    });
    const lastRow = items.length + 1;
    const totalRow = lastRow + 1;
    sheet[`A${totalRow}`] = { t: "s", v: "Total" };
    sheet[`B${totalRow}`] = { t: "n", f: `SUM(B2:B${lastRow})`, v: totalUnits };
    sheet[`G${totalRow}`] = { t: "n", f: `SUM(G2:G${lastRow})`, v: totalValue, z: money };
    sheet["!ref"] = `A1:G${totalRow}`;
    sheet["!cols"] = [{ wch: 14 }, { wch: 13 }, { wch: 38 }, { wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];

    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Inventario");
    XLSX.writeFile(book, `inventario-${today()}.xlsx`);
  };

  const exportPdf = async () => {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.text("Control de inventario", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generado el ${new Date().toLocaleDateString("es-MX")}`, 14, 25);

    autoTable(doc, {
      startY: 31,
      head: [["SKU", "Existencias", "Descripción", "Tipo", "Departamento", "Precio unitario", "Subtotal"]],
      body: items.map((i) => [
        i.sku,
        String(i.stock),
        i.description,
        i.type,
        i.department,
        mxn.format(i.price),
        mxn.format(i.stock * i.price),
      ]),
      foot: [["Total", String(totalUnits), "", "", "", "", mxn.format(totalValue)]],
      headStyles: { fillColor: [6, 95, 70] },
      footStyles: { fillColor: [241, 245, 249], textColor: 20 },
      columnStyles: {
        1: { halign: "right" },
        5: { halign: "right" },
        6: { halign: "right" },
      },
    });

    doc.save(`inventario-${today()}.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-lg">
        <header className="bg-gradient-to-r from-emerald-950 via-emerald-800 to-cyan-700 px-6 py-5 text-white text-center">
          <h1 className="text-2xl font-semibold">Control de inventario</h1>
          <p className="mt-1 text-sm text-emerald-100">
            Registra artículos, consulta el valor de tus existencias y da salida al material.
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Existencias</h2>
          <div className="flex flex-wrap gap-3">

            <div className='relative flex-1 sm:w-64'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 text-xs'>
              <FontAwesomeIcon className='pr-2 text-xl text-cyan-800'  icon={faMagnifyingGlass} />
            </span>
            <input 
              type="text" 
              placeholder="Buscar por SKU, descripcion ..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className='w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all'
            />
          </div>

            <button
              type="button"
              onClick={exportPdf}
              disabled={items.length === 0}
              className={primaryButton}
            >
              <FontAwesomeIcon icon={faFilePdf} />
              PDF
            </button>
            <button
              type="button"
              onClick={exportExcel}
              disabled={items.length === 0}
              className={primaryButton}
            >
              <FontAwesomeIcon icon={faFileExcel} />
              Genera Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold">SKU</th>
                <th scope="col" className="px-6 py-3 text-right font-semibold">Existencias</th>
                <th scope="col" className="px-6 py-3 font-semibold">Descripción</th>
                <th scope="col" className="px-6 py-3 font-semibold">Tipo</th>
                <th scope="col" className="px-6 py-3 font-semibold">Departamento</th>
                <th scope="col" className="px-6 py-3 text-right font-semibold">Precio unitario</th>
                <th scope="col" className="px-6 py-3 text-right font-semibold">Subtotal</th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                    Todavía no hay artículos. Llena el formulario y selecciona Agregar Item.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-emerald-50/50">
                    <td className="px-6 py-3 font-medium text-slate-900">{item.sku}</td>
                    <td className="px-6 py-3 text-right tabular-nums">{item.stock}</td>
                    <td className="px-6 py-3 text-slate-700">{item.description}</td>
                    <td className="px-6 py-3 text-slate-700">{item.type}</td>
                    <td className="px-6 py-3 text-slate-700">{item.department}</td>
                    <td className="px-6 py-3 text-right tabular-nums">{mxn.format(item.price)}</td>
                    <td className="px-6 py-3 text-right font-medium tabular-nums text-slate-900">
                      {mxn.format(item.stock * item.price)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Eliminar ${item.sku}`}
                        className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {items.length > 0 && (
              <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-semibold text-slate-900">
                <tr>
                  <th scope="row" className="px-6 py-3 text-left">Total</th>
                  <td className="px-6 py-3 text-right tabular-nums">{totalUnits}</td>
                  <td colSpan={4} />
                  <td className="px-6 py-3 text-right tabular-nums">{mxn.format(totalValue)}</td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>

      </div>
    </div>
  );
}
