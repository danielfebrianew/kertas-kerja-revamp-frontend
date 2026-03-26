// app/(authenticated)/opd/pohon-kinerja-opd/_components/modals/EditModal.tsx

'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/fetcher';
import type { PohonKinerja, PohonIndikator } from '@/types/PohonPemda';
import { getHeaderStyle } from '../../_utils';
import { toast } from 'sonner';
import { getTahunFromCookie } from '@/lib/cookie';

interface FormEditNodeProps {
  node: PohonKinerja;
  onCancel: () => void;
  onSuccess: (updatedNode: PohonKinerja) => void;
}


export const FormEditNode: React.FC<FormEditNodeProps> = ({ node, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama_pohon: node.nama_pohon,
    keterangan: node.keterangan || '',
  });

  const [indikators, setIndikators] = useState<
    {
      id_indikator: string | null;
      nama_indikator: string;
      targets: { id_target: string | null; target: string; satuan: string }[];
    }[]
  >(
    node.indikator?.map((ind: PohonIndikator) => ({
      id_indikator: ind.id_indikator,
      nama_indikator: ind.nama_indikator,
      targets: ind.targets?.map((t) => ({
        id_target: t.id_target || null,
        target: t.target || '',
        satuan: t.satuan || '',
      })) || [{ id_target: null, target: '', satuan: '' }],
    })) || []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIndikatorChange = (index: number, field: string, value: string) => {
    const next = [...indikators];
    next[index] = { ...next[index], [field]: value };
    setIndikators(next);
  };

  const handleTargetChange = (indIdx: number, targetIdx: number, field: string, value: string) => {
    const next = [...indikators];
    const targets = [...next[indIdx].targets];
    targets[targetIdx] = { ...targets[targetIdx], [field]: value };
    next[indIdx] = { ...next[indIdx], targets };
    setIndikators(next);
  };

  const addIndikator = () => {
    setIndikators([
      ...indikators,
      { id_indikator: null, nama_indikator: '', targets: [{ id_target: null, target: '', satuan: '' }] },
    ]);
  };

  const removeIndikator = (index: number) => {
    setIndikators(indikators.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const tahun = getTahunFromCookie();

    const indikatorsPayload = indikators.map((ind) => {
      const indikatorObj: Record<string, unknown> = {
        nama_indikator: ind.nama_indikator,
        tahun,
        targets: ind.targets.map((t) => {
          const targetObj: Record<string, unknown> = {
            target: t.target,
            satuan: t.satuan,
            tahun,
          };
          if (t.id_target) targetObj.id_target = t.id_target;
          return targetObj;
        }),
      };
      if (ind.id_indikator) indikatorObj.id_indikator = ind.id_indikator;

      return indikatorObj;
    });

    const payload = {
      parent: node.parent || null,
      nama_pohon: formData.nama_pohon,
      keterangan: formData.keterangan,
      tahun,
      jenis_pohon: node.jenis_pohon,
      level_pohon: node.level_pohon,
      status: 'UPDATE',
      indikators: indikatorsPayload,
    };

    try {
      const res = await fetchApi<{ data: { id: number; nama_pohon?: string; tema?: string; keterangan: string; jenis_pohon: string; level_pohon: number; is_active: boolean; jumlah_review: number; tagging: string | null } }>({
        url: `/pohon_kinerja_admin/update/${node.id}`,
        method: 'PUT',
        type: 'auth',
        body: payload,
      });
      toast.success('Data berhasil diperbarui');
      onSuccess({
        ...node,
        nama_pohon: res.data.data.nama_pohon ?? res.data.data.tema ?? node.nama_pohon,
        keterangan: res.data.data.keterangan,
        jenis_pohon: res.data.data.jenis_pohon,
        level_pohon: res.data.data.level_pohon,
        is_active: res.data.data.is_active,
        jumlah_review: res.data.data.jumlah_review,
        tagging: res.data.data.tagging,
        indikator: indikators.map((ind) => ({
          id_indikator: ind.id_indikator || '',
          id_pokin: String(node.id),
          nama_indikator: ind.nama_indikator,
          targets: ind.targets.map((t) => ({
            id_target: t.id_target || '',
            indikator_id: ind.id_indikator || '',
            target: t.target,
            satuan: t.satuan,
          })),
        })),
      });
    } catch (error: unknown) {
      const code = (error as Error & { code?: number }).code;
      const message = error instanceof Error ? error.message : 'Gagal memperbarui data';
      toast.error(`${message}${code ? ` (${code})` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border-2 border-border rounded-lg p-4 shadow-xl min-w-[320px] max-w-sm w-full relative text-left">
      <div
        className={`flex flex-col rounded-lg shadow-sm mb-4 border p-3 ${getHeaderStyle(node.jenis_pohon)}`}
      >
        <span className="text-xs text-center font-bold uppercase opacity-90">
          Edit {node.jenis_pohon}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
        <div>
          <label className="font-bold text-foreground block mb-1">Nama {node.jenis_pohon}</label>
          <input
            type="text"
            name="nama_pohon"
            value={formData.nama_pohon}
            onChange={handleChange}
            className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
            placeholder="Masukkan nama..."
            required
          />
        </div>

        <div className="border border-foreground/40 rounded p-2 bg-form-highlight-bg/50">
          <label className="font-bold text-foreground block mb-2 text-center border-b border-form-highlight-border pb-1">
            INDIKATOR
          </label>

          {indikators.map((ind, idx) => (
            <div key={idx} className="mb-4 border-b border-border pb-2 last:border-0 last:pb-0 ">
              <div className="mb-2">
                <label className="text-[10px] font-semibold text-black">
                  Nama Indikator {idx + 1}
                </label>
                <input
                  type="text"
                  value={ind.nama_indikator}
                  onChange={(e) => handleIndikatorChange(idx, 'nama_indikator', e.target.value)}
                  className="w-full bg-white border border-input rounded p-1.5 focus:border-ring outline-none"
                  placeholder="Contoh: Meningkatnya..."
                />
              </div>
              {ind.targets.map((t, tIdx) => (
                <div key={tIdx} className="flex gap-2">
                  <div className="w-1/3">
                    <label className="text-[10px] font-semibold text-black">Target</label>
                    <input
                      type="text"
                      value={t.target}
                      onChange={(e) => handleTargetChange(idx, tIdx, 'target', e.target.value)}
                      className="w-full bg-white border border-input rounded p-1.5 focus:border-ring outline-none"
                      placeholder="Contoh: 100"
                    />
                  </div>
                  <div className="w-2/3">
                    <label className="text-[10px] font-semibold text-black">Satuan</label>
                    <input
                      type="text"
                      value={t.satuan}
                      onChange={(e) => handleTargetChange(idx, tIdx, 'satuan', e.target.value)}
                      className="w-full bg-white border border-input rounded p-1.5 focus:border-ring outline-none"
                      placeholder="Contoh: Persen/Unit"
                    />
                  </div>
                </div>
              ))}
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
            name="keterangan"
            value={formData.keterangan}
            onChange={handleChange}
            rows={2}
            className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
            placeholder="Keterangan tambahan..."
          />
        </div>

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-destructive/90 hover:bg-destructive text-white py-2 rounded font-bold transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#3072D6]/90 hover:bg-[#3072D6] text-white py-2 rounded font-bold transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};
