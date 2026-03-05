'use client'

import React, { useState, useEffect } from 'react'
import { fetchApi } from '@/lib/fetcher'
import { toast } from 'sonner'
import Select from 'react-select'

interface Props {
  nodeId: number
  onCancel: () => void
  onSuccess: () => void
}

interface PelaksanaOption {
  value: string
  label: string
}

export default function AddModalCascading({
  nodeId,
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
      const res = await fetchApi('/pelaksana/findall')
      const mapped = res.data.data.map((p: any) => ({
        value: p.id,
        label: p.nama
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

      await fetchApi(`/pohon_cascading/set_pelaksana/${nodeId}`, {
        method: 'PUT',
        body: {
          pelaksana: selected.map(s => s.value)
        }
      })

      toast.success('Pelaksana berhasil disimpan')
      onSuccess()

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border rounded-lg shadow-lg p-4 min-w-[320px] max-w-sm">

      <div className="border rounded-md p-2 text-center font-bold text-sm mb-3">
        EDIT PELAKSANA
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">

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
    </div>
  )
}