'use client';

import React, { useState } from 'react';
import { fetchApi } from '@/lib/fetcher';
import type { ChildInfo } from '../../_utils';
import { getHeaderStyle } from '../../_utils';
import Cookies from 'js-cookie';

interface FormAddChildModalProps {
  parentId: number;
  childInfo: ChildInfo;
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
      parentId,
      namaPohon,
      keterangan: keteranganPohon,
      tahun,
      jenisPohon: childInfo.nextJenis,
      levelPohon: childInfo.nextLevel,
      status: 'DRAFT',
      indikators: indikators.map((ind) => ({
        indikator: ind.indikator,
        keterangan: ind.keterangan,
        tahun,
        targets: ind.targets.map((t) => ({
          nilai: Number(t.nilai),
          satuan: t.satuan,
          tahun,
        })),
      })),
    };

    try {
      await fetchApi('/pohon-kinerja', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      onSuccess();
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menyimpan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col rounded-lg shadow-xl border border-border bg-card max-w-sm w-87.5 relative text-left">
      <div
        className={`flex flex-col rounded-lg shadow-sm mb-2 border p-3 mx-2 mt-2 ${getHeaderStyle(childInfo.nextJenis)}`}
      >
        <span className="text-xs text-center font-bold uppercase opacity-90">
          TAMBAH {childInfo.label}
        </span>
      </div>

      <div className="p-3 pt-0">
        <form id="form-add-node" onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase">
              Sub Tematik / Nama Pohon
            </label>
            <input
              type="text"
              required
              placeholder="Masukkan nama pohon..."
              value={namaPohon}
              onChange={(e) => setNamaPohon(e.target.value)}
              className="w-full border border-input rounded p-1.5 text-xs outline-none focus:border-ring transition"
            />
          </div>

          <div className="border border-form-highlight-border rounded p-2 bg-form-highlight-bg/30">
            <div className="text-center mb-2">
              <label className="text-[10px] font-bold text-form-highlight-text uppercase">
                INDIKATOR {childInfo.label} :
              </label>
            </div>

            {indikators.map((ind, idx) => (
              <div
                key={idx}
                className="mb-3 border-b border-border pb-2 last:border-0 last:pb-0"
              >
                <div className="mb-2">
                  <label className="text-[9px] font-bold text-muted-foreground">
                    NAMA INDIKATOR {idx + 1}:
                  </label>
                  <input
                    type="text"
                    required
                    value={ind.indikator}
                    onChange={(e) => handleIndikatorChange(idx, 'indikator', e.target.value)}
                    className="w-full border border-foreground rounded p-1.5 text-xs font-semibold"
                    placeholder={`Masukkan nama indikator ${idx + 1}`}
                  />
                </div>
                <div className="mb-2">
                  <label className="text-[9px] font-bold text-muted-foreground">TARGET:</label>
                  <input
                    type="number"
                    required
                    value={ind.targets[0].nilai}
                    onChange={(e) => handleTargetChange(idx, 0, 'nilai', e.target.value)}
                    className="w-full border border-input rounded p-1.5 text-xs bg-muted/50"
                    placeholder="Target"
                  />
                </div>
                <div className="mb-2">
                  <label className="text-[9px] font-bold text-muted-foreground">SATUAN:</label>
                  <input
                    type="text"
                    required
                    value={ind.targets[0].satuan}
                    onChange={(e) => handleTargetChange(idx, 0, 'satuan', e.target.value)}
                    className="w-full border border-input rounded p-1.5 text-xs bg-muted/50"
                    placeholder="Satuan"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeIndikator(idx)}
                  className="text-destructive text-[10px] hover:underline w-full text-right"
                >
                  Hapus Indikator
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addIndikator}
              className="w-full border border-form-highlight-border text-form-highlight-text rounded text-[10px] py-1 hover:bg-form-highlight-bg transition"
            >
              + Tambah Indikator
            </button>
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase">KETERANGAN:</label>
            <textarea
              rows={2}
              placeholder="Masukkan keterangan..."
              value={keteranganPohon}
              onChange={(e) => setKeteranganPohon(e.target.value)}
              className="w-full border border-input rounded p-1.5 text-xs outline-none focus:border-ring"
            />
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 rounded font-bold text-xs transition"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full bg-destructive hover:bg-destructive/90 text-white py-1.5 rounded font-bold text-xs transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
