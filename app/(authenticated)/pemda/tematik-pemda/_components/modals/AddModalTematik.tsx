'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { toast } from 'sonner';
import { getTahunFromCookie } from '@/lib/cookie';

interface IndikatorState {
  nama_indikator: string;
  targets: { target: string; satuan: string }[];
}

interface AddModalTematikProps {
  onCancel: () => void;
  onSuccess: () => void;
}


export default function AddModalTematik({ onCancel, onSuccess }: AddModalTematikProps) {
  const tahun = getTahunFromCookie();

  const [namaPohon, setNamaPohon] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [indikators, setIndikators] = useState<IndikatorState[]>([
    { nama_indikator: '', targets: [{ target: '', satuan: '' }] },
  ]);

  const addIndikator = () => {
    setIndikators([
      ...indikators,
      { nama_indikator: '', targets: [{ target: '', satuan: '' }] },
    ]);
  };

  const removeIndikator = (index: number) => {
    const next = [...indikators];
    next.splice(index, 1);
    setIndikators(next);
  };

  const handleIndikatorChange = (idx: number, value: string) => {
    const next = [...indikators];
    next[idx] = { ...next[idx], nama_indikator: value };
    setIndikators(next);
  };

  const handleTargetChange = (indIdx: number, field: 'target' | 'satuan', value: string) => {
    const next = [...indikators];
    const targets = [...next[indIdx].targets];
    targets[0] = { ...targets[0], [field]: value };
    next[indIdx] = { ...next[indIdx], targets };
    setIndikators(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      nama_pohon: namaPohon,
      jenis_pohon: 'Tematik',
      level_pohon: 0,
      keterangan,
      tahun,
      indikator: indikators.map((ind) => ({
        indikator: ind.nama_indikator,
        target: [
          {
            target: ind.targets[0].target,
            satuan: ind.targets[0].satuan,
          },
        ],
      })),
    };

    try {
      await fetchApi({ type: 'auth', 
        url: '/pohon_kinerja_admin/create',
        method: 'POST',
        body: JSON.stringify(payload),
      });
      toast.success('Tematik berhasil ditambahkan');
      onSuccess();
    } catch (error) {
      const code = (error as Error & { code?: number }).code;
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast.error(`${message}${code ? ` (${code})` : ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="bg-card border-2 border-border rounded-lg p-6 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <h2 className="font-display text-xl font-semibold tracking-tight mb-4">
          Tambah Tematik Pemda
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          <div>
            <label className="font-bold text-foreground block mb-1">Nama Tematik</label>
            <input
              type="text"
              required
              placeholder="Masukkan nama tematik..."
              value={namaPohon}
              onChange={(e) => setNamaPohon(e.target.value)}
              className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
            />
          </div>

          <div className="border border-foreground/40 rounded p-4 bg-form-highlight-bg/50">
            <label className="font-bold text-foreground block mb-2 text-center border-b border-form-highlight-border pb-1">
              INDIKATOR
            </label>

            {indikators.map((ind, idx) => (
              <div key={idx} className="mb-4 border-b border-border pb-2 last:border-0 last:pb-0">
                <div className="mb-2">
                  <label className="text-xs font-semibold text-foreground">
                    Nama Indikator {idx + 1}
                  </label>
                  <input
                    type="text"
                    required
                    value={ind.nama_indikator}
                    onChange={(e) => handleIndikatorChange(idx, e.target.value)}
                    className="w-full bg-white border border-input rounded p-1.5 focus:border-ring outline-none"
                    placeholder="Contoh: Meningkatnya..."
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <label className="text-xs font-semibold text-foreground">Target</label>
                    <input
                      type="text"
                      required
                      value={ind.targets[0].target}
                      onChange={(e) => handleTargetChange(idx, 'target', e.target.value)}
                      className="w-full bg-white border border-input rounded p-1.5 focus:border-ring outline-none"
                      placeholder="Contoh: 100"
                    />
                  </div>
                  <div className="w-2/3">
                    <label className="text-xs font-semibold text-foreground">Satuan</label>
                    <input
                      type="text"
                      required
                      value={ind.targets[0].satuan}
                      onChange={(e) => handleTargetChange(idx, 'satuan', e.target.value)}
                      className="w-full bg-white border border-input rounded p-1.5 focus:border-ring outline-none"
                      placeholder="Contoh: Persen/Dokumen"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeIndikator(idx)}
                  className="text-destructive text-xs mt-1 hover:underline w-full text-right"
                >
                  Hapus Indikator
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addIndikator}
              className="w-full mt-2 border border-dashed border-foreground/40 text-foreground rounded p-2 bg-white hover:bg-foreground/5 transition"
            >
              + Tambah Indikator
            </button>
          </div>

          <div>
            <label className="font-bold text-foreground block mb-1">Keterangan</label>
            <textarea
              rows={3}
              placeholder="Keterangan tambahan..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-destructive/90 hover:bg-destructive text-white py-2 rounded font-bold transition disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-[#3072D6]/90 hover:bg-[#3072D6] text-white py-2 rounded font-bold transition disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
