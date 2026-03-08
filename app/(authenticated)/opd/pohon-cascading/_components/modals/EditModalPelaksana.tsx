'use client'

import React, { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/fetcher'
import { toast } from 'sonner'
import Select from 'react-select'

interface Props {
  node: any
  kodeOpd: string
  tahun: string
  onCancel: () => void
  onSuccess: (pelaksana: any[]) => void
}

interface PelaksanaOption {
  value: string
  label: string
}

export default function AddModalCascading({
  node,
  kodeOpd,
  tahun,
  onCancel,
  onSuccess,
}: Props) {

  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<PelaksanaOption[]>([])
  const [selected, setSelected] = useState<PelaksanaOption[]>([])

  useEffect(() => {
    loadPelaksana()
  }, [])

  async function loadPelaksana() {
    try {
      const res = await fetchApi({
        url: `/user/findbykodeopdandrole?kode_opd=${kodeOpd}&role=level_1`,
        method: 'GET',
        type: 'auth',
      })
      const mapped = res.data.data.map((p: any) => ({
        value: p.pegawai_id,
        label: p.nama_pegawai,
      }))
      setOptions(mapped)
    } catch {
      toast.error('Gagal memuat pelaksana')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {

      const res = await fetchApi({
        url: `/pohon_kinerja_admin/update/${node.id}`,
        method: 'PUT',
        type: 'auth',
        body: {
          nama_pohon: node.nama_pohon,
          kode_opd: kodeOpd,
          jenis_pohon: node.jenis_pohon,
          level_pohon: node.level_pohon,
          tahun: tahun,
          status: node.status ?? '',
          tagging: node.tagging ?? [],
          parent: node.parent ?? 0,
          indikator: (node.indikator ?? []).map((ind: any) => ({
            indikator: ind.nama_indikator,
            ...(ind.id_indikator ? { id_indikator: ind.id_indikator } : {}),
            target: (ind.targets ?? []).map((t: any) => ({
              target: t.target,
              satuan: t.satuan,
              ...(t.id_target ? { id_target: t.id_target } : {}),
            })),
          })),
          pelaksana: selected.map(s => ({ pegawai_id: s.value })),
        }
      })

      toast.success('Pelaksana berhasil disimpan')
      onSuccess(res.data.data.pelaksana ?? [])

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs py-1">

      <div className="border rounded-md p-2 text-center font-bold text-sm">
        EDIT PELAKSANA
      </div>

      <label className="font-semibold">
        PELAKSANA
      </label>

      <Select
        isMulti
        options={options}
        value={selected}
        onChange={(v) => setSelected(v as PelaksanaOption[])}
        placeholder="Pilih Pelaksana..."
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white rounded py-2 font-semibold"
      >
        {loading ? 'Menyimpan...' : 'Simpan'}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="bg-red-600 text-white rounded py-2 font-semibold"
      >
        Batal
      </button>

    </form>
  )
}