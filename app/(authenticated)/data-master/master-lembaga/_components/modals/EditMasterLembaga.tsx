'use client';

import { FormEvent, useEffect, useState } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { toast } from 'sonner';
import type { MasterLembagaItem, MasterLembagaResponse } from '@/types/master-lembaga';

interface EditMasterLembagaProps {
  idLembaga: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditMasterLembaga({
  idLembaga,
  onCancel,
  onSuccess,
}: EditMasterLembagaProps) {
  const [namaLembaga, setNamaLembaga] = useState('');
  const [kodeLembaga, setKodeLembaga] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoadingData(true);

      const response = await fetchApi<{
        code: number;
        status: string;
        data: {
          id: string;
          nama_lembaga: string;
          kode_lembaga: string;
        }[];
      }>({ url: '/lembaga/findall', type: 'auth', method: 'GET' });

      const list = response.data?.data ?? [];

      const selected = list.find((item) => item.id === idLembaga);

      if (selected) {
        setNamaLembaga(selected.nama_lembaga ?? '');
        setKodeLembaga(selected.kode_lembaga ?? '');
      } else {
        toast.error('Data lembaga tidak ditemukan');
      }

      setLoadingData(false);
    };

    fetchDetail();
  }, [idLembaga]);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetchApi({
      type: 'auth',
      url: `/lembaga/update/${idLembaga}`,
      method: 'PUT',
      body: {
        nama_lembaga: namaLembaga,
        kode_lembaga: kodeLembaga,
      },
    });

    if (response.status >= 200 && response.status < 300) {
      toast.success('Data lembaga berhasil diperbarui');
      onSuccess();
    } else {
      toast.error(response.data?.message ?? 'Gagal memperbarui data lembaga');
    }

    setIsLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-2xl rounded-lg border border-border bg-card p-6 shadow-xl mx-4">
        <h2 className="text-2xl font-display font-semibold tracking-tight mb-6">FORM EDIT LEMBAGA :</h2>

        {loadingData ? (
          <p className="text-muted-foreground">Memuat data lembaga...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold uppercase">NAMA LEMBAGA :</label>
              <input
                type="text"
                value={namaLembaga}
                onChange={(e) => setNamaLembaga(e.target.value)}
                required
                placeholder="masukkan Nama Lembaga"
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-lg outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-1 text-sm text-muted-foreground">*Nama Lembaga Harus Terisi</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase">KODE LEMBAGA :</label>
              <input
                type="text"
                value={kodeLembaga}
                onChange={(e) => setKodeLembaga(e.target.value)}
                required
                placeholder="masukkan kode lembaga"
                className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-lg outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-1 text-sm text-muted-foreground">*kode lembaga Harus Terisi</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-[#22c55e] py-2.5 text-2xl font-semibold text-white transition hover:bg-[#16a34a] disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="w-full rounded-md bg-[#e11d48] py-2.5 text-2xl font-semibold text-white transition hover:bg-[#be123c]"
            >
              Kembali
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
