'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/fetcher';
import type { PohonKinerja } from '@/types/PohonPemda';
import type { ChildInfo } from '../../_utils';
import { getHeaderStyle } from '../../_utils';
import { toast } from 'sonner';
import { getTahunFromCookie } from '@/lib/cookie';

interface FormAddChildModalProps {
  parentId: number;
  childInfo: ChildInfo;
  onCancel: () => void;
  onSuccess: (newNode: PohonKinerja) => void;
}


interface IndikatorState {
  indikator: string;
  keterangan: string;
  targets: { nilai: string | number; satuan: string }[];
}

export const FormAddChildModal: React.FC<FormAddChildModalProps> = ({
  parentId,
  childInfo,
  onCancel,
  onSuccess,
}) => {
  const tahun = getTahunFromCookie();
  const [namaPohon, setNamaPohon] = useState('');
  const [keteranganPohon, setKeteranganPohon] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [indikators, setIndikators] = useState<IndikatorState[]>([
    { indikator: '', keterangan: '', targets: [{ nilai: '', satuan: '' }] },
  ]);

  const addIndikator = () => {
    setIndikators([
      ...indikators,
      { indikator: '', keterangan: '', targets: [{ nilai: '', satuan: '' }] },
    ]);
  };

  const removeIndikator = (index: number) => {
    const next = [...indikators];
    next.splice(index, 1);
    setIndikators(next);
  };

  const handleIndikatorChange = (idx: number, field: 'indikator' | 'keterangan', value: string) => {
    const next = [...indikators];
    next[idx] = { ...next[idx], [field]: value };
    setIndikators(next);
  };

  const handleTargetChange = (indIdx: number, targetIdx: number, field: string, value: string) => {
    const next = [...indikators];
    const targets = [...next[indIdx].targets];
    targets[targetIdx] = { ...targets[targetIdx], [field]: value };
    next[indIdx] = { ...next[indIdx], targets };
    setIndikators(next);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      parent: parentId,
      nama_pohon: namaPohon,
      Keterangan: keteranganPohon,
      tahun,
      jenis_pohon: childInfo.nextJenis,
      level_pohon: childInfo.nextLevel,
      kode_opd: null,
      status: '',
      tagging: [],
      indikator: indikators.map((ind) => ({
        indikator: ind.indikator,
        target: ind.targets.map((t) => ({
          target: t.nilai,
          satuan: t.satuan,
        })),
      })),
    };

    try {
      const res = await fetchApi<{ data: PohonKinerja }>('/pohon_kinerja_admin/create', {
        method: 'POST',
        body: payload,
      });
      toast.success('Data berhasil ditambahkan');
      onSuccess({ ...res.data.data, childs: [] });
    } catch (error) {
      const code = (error as Error & { code?: number }).code;
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast.error(`${message}${code ? ` (${code})` : ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border-2 border-border rounded-lg p-4 shadow-xl min-w-[320px] max-w-sm w-full relative text-left">
      <div
        className={`flex flex-col rounded-lg shadow-sm mb-4 border p-3 ${getHeaderStyle(childInfo.nextJenis)}`}
      >
        <span className="text-xs text-center font-bold uppercase opacity-90">
          Tambah {childInfo.label}
        </span>
      </div>

      <form id="form-add-node" onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
        <div>
          <label className="font-bold text-foreground block mb-1">Nama {childInfo.label}</label>
          <input
            type="text"
            required
            placeholder="Masukkan nama..."
            value={namaPohon}
            onChange={(e) => setNamaPohon(e.target.value)}
            className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
          />
        </div>

        <div className="border border-foreground/40 rounded p-2 bg-form-highlight-bg/50">
          <label className="font-bold text-foreground block mb-2 text-center border-b border-form-highlight-border pb-1">
            INDIKATOR
          </label>

          {indikators.map((ind, idx) => (
            <div
              key={idx}
              className="mb-4 border-b border-border pb-2 last:border-0 last:pb-0"
            >
              <div className="mb-2">
                <label className="text-[10px] font-semibold text-black">
                  Nama Indikator {idx + 1}
                </label>
                <input
                  type="text"
                  required
                  value={ind.indikator}
                  onChange={(e) => handleIndikatorChange(idx, 'indikator', e.target.value)}
                  className="w-full bg-white border border-input rounded p-1.5 focus:border-ring outline-none"
                  placeholder="Contoh: Meningkatnya..."
                />
              </div>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className="text-[10px] font-semibold text-black">Target</label>
                  <input
                    type="text"
                    required
                    value={ind.targets[0].nilai}
                    onChange={(e) => handleTargetChange(idx, 0, 'nilai', e.target.value)}
                    className="w-full bg-white border border-input rounded p-1.5 focus:border-ring outline-none"
                    placeholder="Contoh: 100"
                  />
                </div>
                <div className="w-2/3">
                  <label className="text-[10px] font-semibold text-black">Satuan</label>
                  <input
                    type="text"
                    required
                    value={ind.targets[0].satuan}
                    onChange={(e) => handleTargetChange(idx, 0, 'satuan', e.target.value)}
                    className="w-full bg-white border border-input rounded p-1.5 focus:border-ring outline-none"
                    placeholder="Contoh: Persen/Dokumen"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeIndikator(idx)}
                className="text-destructive text-[10px] mt-1 hover:underline w-full text-right"
              >
                Hapus Indikator
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addIndikator}
            className="w-full mt-2 border border-dashed border-foreground/40 text-foreground rounded p-1 bg-white hover:bg-foreground/5 transition"
          >
            + Tambah Indikator
          </button>
        </div>

        <div>
          <label className="font-bold text-foreground block mb-1">Keterangan</label>
          <textarea
            rows={2}
            placeholder="Keterangan tambahan..."
            value={keteranganPohon}
            onChange={(e) => setKeteranganPohon(e.target.value)}
            className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
          />
        </div>

        <div className="flex gap-2 mt-2">
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
  );
};
