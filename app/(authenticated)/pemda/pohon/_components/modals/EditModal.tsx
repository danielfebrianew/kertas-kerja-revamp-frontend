'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/fetcher';
import type { PohonKinerja, PohonIndikator } from '@/types/pohon';
import { getHeaderStyle } from '../../_utils';
import Cookies from 'js-cookie';

interface FormEditNodeProps {
  node: PohonKinerja;
  onCancel: () => void;
  onSuccess: () => void;
}

function getTahunFromCookie(): string {
  try {
    const raw = Cookies.get('tahun');
    if (raw) return JSON.parse(raw).value || '';
  } catch { /* ignore */ }
  return String(new Date().getFullYear());
}

export const FormEditNode: React.FC<FormEditNodeProps> = ({ node, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    tema: node.tema,
    keterangan: node.keterangan || '',
  });

  const [indikators, setIndikators] = useState<
    { id_indikator: string | null; nama_indikator: string; target: string; satuan: string; id_target: string | null }[]
  >(
    node.indikator?.map((ind: PohonIndikator) => ({
      id_indikator: ind.id_indikator,
      nama_indikator: ind.nama_indikator,
      target: ind.targets?.[0]?.target || '',
      satuan: ind.targets?.[0]?.satuan || '',
      id_target: ind.targets?.[0]?.id_target || null,
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

  const addIndikator = () => {
    setIndikators([
      ...indikators,
      { id_indikator: null, nama_indikator: '', target: '', satuan: '', id_target: null },
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
      const targetObj: Record<string, unknown> = {
        target: ind.target,
        satuan: ind.satuan,
        tahun,
      };
      if (ind.id_target) targetObj.id_target = ind.id_target;

      const indikatorObj: Record<string, unknown> = {
        nama_indikator: ind.nama_indikator,
        tahun,
        targets: [targetObj],
      };
      if (ind.id_indikator) indikatorObj.id_indikator = ind.id_indikator;

      return indikatorObj;
    });

    const payload = {
      parent: node.parent || null,
      tema: formData.tema,
      keterangan: formData.keterangan,
      tahun,
      jenis_pohon: node.jenis_pohon,
      level_pohon: node.level_pohon,
      status: 'UPDATE',
      indikators: indikatorsPayload,
    };

    try {
      await fetchApi(`/pohon-kinerja/${node.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      alert('Data berhasil diperbarui');
      onSuccess();
    } catch (error: unknown) {
      console.error('Update error:', error);
      const errMsg = error instanceof Error ? error.message : 'Gagal memperbarui data';
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border-2 border-border rounded-lg p-4 shadow-xl max-w-sm w-full relative text-left">
      <div
        className={`flex flex-col rounded-lg shadow-sm mb-4 border p-3 ${getHeaderStyle(node.jenis_pohon)}`}
      >
        <span className="text-xs text-center font-bold uppercase opacity-90">
          Edit {node.jenis_pohon}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
        <div>
          <label className="font-bold text-muted-foreground block mb-1">Nama {node.jenis_pohon}</label>
          <input
            type="text"
            name="tema"
            value={formData.tema}
            onChange={handleChange}
            className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none"
            placeholder="Masukkan nama..."
            required
          />
        </div>

        <div className="border border-form-highlight-border rounded p-2 bg-form-highlight-bg/50">
          <label className="font-bold text-form-highlight-text block mb-2 text-center border-b border-form-highlight-border pb-1">
            INDIKATOR
          </label>

          {indikators.map((ind, idx) => (
            <div key={idx} className="mb-4 border-b border-border pb-2 last:border-0 last:pb-0">
              <div className="mb-2">
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Nama Indikator {idx + 1}
                </label>
                <input
                  type="text"
                  value={ind.nama_indikator}
                  onChange={(e) => handleIndikatorChange(idx, 'nama_indikator', e.target.value)}
                  className="w-full border border-input rounded p-1.5 focus:border-ring outline-none"
                  placeholder="Contoh: Meningkatnya..."
                />
              </div>
              <div className="flex gap-2">
                <div className="w-1/3">
                  <label className="text-[10px] font-semibold text-muted-foreground">Target</label>
                  <input
                    type="text"
                    value={ind.target}
                    onChange={(e) => handleIndikatorChange(idx, 'target', e.target.value)}
                    className="w-full border border-input rounded p-1.5 focus:border-ring outline-none"
                  />
                </div>
                <div className="w-2/3">
                  <label className="text-[10px] font-semibold text-muted-foreground">Satuan</label>
                  <input
                    type="text"
                    value={ind.satuan}
                    onChange={(e) => handleIndikatorChange(idx, 'satuan', e.target.value)}
                    className="w-full border border-input rounded p-1.5 focus:border-ring outline-none"
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
            className="w-full mt-2 border border-dashed border-form-highlight-border text-form-highlight-text rounded p-1 hover:bg-form-highlight-bg transition"
          >
            + Tambah Indikator
          </button>
        </div>

        <div>
          <label className="font-bold text-muted-foreground block mb-1">Keterangan</label>
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
            className="flex-1 bg-destructive hover:bg-destructive/90 text-white py-2 rounded font-bold transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded font-bold transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </div>
  );
};
