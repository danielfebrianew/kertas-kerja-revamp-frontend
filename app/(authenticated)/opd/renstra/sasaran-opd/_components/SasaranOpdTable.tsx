'use client';

import { useState, Fragment } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { SasaranOpdTableProps } from '../types';

const PAGE_SIZE_OPTIONS = [5, 10, 25];

export default function SasaranOpdTable({ rows, tahunList, onEdit, onDelete }: SasaranOpdTableProps) {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(rows.length / pageSize);
  const paginatedRows = rows.slice(page * pageSize, (page + 1) * pageSize);

  const thClass = 'text-center text-xs font-bold text-primary-foreground bg-primary border-r border-white/20 px-2 py-3 whitespace-normal';
  const tdClass = 'text-center text-xs border-r border-border px-2 py-2 align-middle whitespace-normal break-words';

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            {/* Baris 1: grup tahun */}
            <tr className="bg-primary">
              {/* kolom statis span 2 baris */}
              <th rowSpan={2} className={`${thClass} border-b border-white/20 w-[55px]`}>No</th>
              <th rowSpan={2} className={`${thClass} border-b border-white/20 min-w-[200px]`}>Strategic OPD</th>
              <th rowSpan={2} className={`${thClass} border-b border-white/20 min-w-[150px]`}>Pemilik</th>
              <th rowSpan={2} className={`${thClass} border-b border-white/20 min-w-[200px]`}>Sasaran OPD</th>
              <th rowSpan={2} className={`${thClass} border-b border-white/20 min-w-[180px]`}>Indikator</th>
              <th rowSpan={2} className={`${thClass} border-b border-white/20 min-w-[200px]`}>Rumus Perhitungan</th>
              <th rowSpan={2} className={`${thClass} border-b border-white/20 min-w-[120px]`}>Sumber Data</th>
              {tahunList.map((tahun) => (
                <th key={tahun} colSpan={2} className={`${thClass} border-b border-white/20 text-center`}>
                  {tahun}
                </th>
              ))}
              <th rowSpan={2} className={`${thClass} border-b border-white/20 w-[100px] border-r-0`}>Aksi</th>
            </tr>
            {/* Baris 2: Target & Satuan per tahun */}
            <tr className="bg-primary">
              {tahunList.map((tahun) => (
                <Fragment key={tahun}>
                  <th className={`${thClass} w-[100px]`}>Target</th>
                  <th className={`${thClass} w-[100px]`}>Satuan</th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={8 + tahunList.length * 2} className="text-center py-8 text-muted-foreground text-sm">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              paginatedRows.map((row, index) => (
                <tr key={row.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className={tdClass}>{page * pageSize + index + 1}</td>
                  <td className={tdClass}>
                    <div>{row.nama_pohon}</div>
                  </td>
                  <td className={tdClass}>
                    {Array.isArray(row.pelaksana) && row.pelaksana.length > 0
                      ? row.pelaksana.map((nama: string, i: number) => (
                          <div key={i} className="text-xs">{nama}</div>
                        ))
                      : '-'}
                  </td>
                  <td className={tdClass}>{row.sasaran}</td>
                  <td className={tdClass}>{row.indikator || '-'}</td>
                  <td className={tdClass}>{row.rumus_perhitungan || '-'}</td>
                  <td className={tdClass}>{row.sumber_data || '-'}</td>
                  {tahunList.map((tahun) => (
                    <Fragment key={tahun}>
                      <td className={tdClass}>{(row[`target_${tahun}`] as string) || '-'}</td>
                      <td className={tdClass}>{(row[`satuan_${tahun}`] as string) || '-'}</td>
                    </Fragment>
                  ))}
                  <td className={`${tdClass} border-r-0`}>
                    <div className="flex flex-col gap-2 items-center">
                      <button
                        onClick={() => onEdit(row.id_sasaran_opd)}
                        className="w-full px-3 py-1.5 flex justify-center items-center bg-[#22c55e] text-white hover:bg-green-600 rounded-md transition-colors text-xs font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(row.id_sasaran_opd)}
                        className="w-full px-3 py-1.5 flex justify-center items-center bg-[#e11d48] hover:bg-rose-700 text-white rounded-md transition-colors text-xs font-medium"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Baris per halaman:</span>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(0); }}
            className="border rounded px-2 py-1 text-sm bg-background text-foreground"
          >
            {PAGE_SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span>
            {rows.length === 0 ? '0' : `${page * pageSize + 1}–${Math.min((page + 1) * pageSize, rows.length)}`} dari {rows.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
