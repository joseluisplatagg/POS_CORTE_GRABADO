import { flexRender } from '@tanstack/react-table'
import {
  useLegacyTable,
  getCoreRowModel,
  getPaginationRowModel ,
  getFilteredRowModel
} from '@tanstack/react-table/legacy'
import { useMemo, useState } from 'react'

export function GenericTable({ data, columns, isEditable = false, onEdit, onDelete }) {
  const [globalFilter, setGlobalFilter] = useState('')
  // Modificamos las columnas dinámicamente si se requiere edición
  const finalColumns = useMemo(() => {
    if (!isEditable) return columns

    // Añade la columna de acciones al final si isEditable es true
    return [
      ...columns,
      {
        id: 'actions',
        header: 'Acciones',
        cell: (info) => {
          const rowData = info.row.original // Entrega el objeto completo de la fila actual
          return (
            <div className="flex gap-3">
              <button
                onClick={() => onEdit?.(rowData)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors uppercase tracking-wider"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete?.(rowData)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors uppercase tracking-wider"
              >
                Eliminar
              </button>
            </div>
          )
        },
      },
    ]
  }, [columns, isEditable, onEdit, onDelete])

  const table = useLegacyTable({
    key: 'tabla-generica', // Requerido por TanStack en su modo legacy
    data,
    columns: finalColumns,
    state: {
      globalFilter, 
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),       
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: 5 },
    },
  })

  return (
    <div className="w-full space-y-4">

      {/* 6. Barra de Controles de Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Buscar en todos los campos..."
            className="w-full pl-4 pr-10 py-2 text-sm bg-white border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent placeholder-emerald-700/40 text-emerald-950 transition-all shadow-sm shadow-emerald-950/5"
          />
          {globalFilter && (
            <button
              onClick={() => setGlobalFilter('')}
              className="absolute right-3 top-2.5 text-xs font-bold text-emerald-600 hover:text-emerald-800 uppercase tracking-wider"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Agregar nuevo Empleado */}
        <div className="text-xs font-medium text-emerald-800/80">
          <button onClick={() => table.nextPage()}
            className="px-4 py-2 text-xs font-bold border border-emerald-900 bg-emerald-900 text-white hover:bg-emerald-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm shadow-emerald-950/20 rounded-lg">
            
            Registrar Empleado
          </button>
        </div>

        {/* Indicador de registros encontrados */}
        <div className="text-xs font-medium text-emerald-800/80">
          Mostrando {table.getFilteredRowModel().rows.length} de {data.length} registros
        </div>
      </div>

      {/* Contenedor Responsivo */}
      <div className="overflow-x-auto border border-emerald-100 rounded-xl shadow-lg shadow-emerald-950/5 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-emerald-900 border-b border-emerald-950 text-xs text-emerald-100 uppercase tracking-wider sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3 font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-emerald-50/60 bg-white">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-emerald-50 transition-colors duration-200 group">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-gray-700 whitespace-nowrap group-hover:text-emerald-950 font-medium">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between mt-4 px-2">
        <span className="text-xs font-semibold text-emerald-800/70">
          Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 text-xs font-bold border border-emerald-200/80 rounded-lg bg-white text-emerald-900 hover:bg-emerald-50 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm shadow-emerald-950/5"
          >
            Anterior
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 text-xs font-bold border border-emerald-900 bg-emerald-900 text-white hover:bg-emerald-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm shadow-emerald-950/20 rounded-lg"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
