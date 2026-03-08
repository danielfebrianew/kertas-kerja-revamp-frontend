'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { toast } from 'sonner';

interface BidangUrusan {
  kode_bidang_urusan: string;
  nama_bidang_urusan: string;
  tahun: string;
}

interface Periode {
  id: number;
  tahun_awal: string;
  tahun_akhir: string;
  jenis_periode: string;
  tahun_list: string[];
}

interface IndikatorState {
  nama_indikator: string;
  rumus_perhitungan: string;
  sumber_data: string;
  targets: { tahun: string; target: string; satuan: string }[];
}

interface AddTujuanOpdModalProps {
  kodeOpd: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export const AddTujuanOpdModal: React.FC<AddTujuanOpdModalProps> = ({
  kodeOpd,
  onCancel,
  onSuccess,
}) => {
  const [tujuan, setTujuan] = useState('');
  const [kodeBidangUrusan, setKodeBidangUrusan] = useState('');
  const [periodeId, setPeriodeId] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);

  const [bidangUrusanList, setBidangUrusanList] = useState<BidangUrusan[]>([]);
  const [periodeList, setPeriodeList] = useState<Periode[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState(true);

  const [indikators, setIndikators] = useState<IndikatorState[]>([]);

  const selectedPeriode = periodeList.find((p) => p.id === periodeId);

  // Fetch dropdown data on mount
  useEffect(() => {
    async function fetchDropdowns() {
      setLoadingDropdown(true);
      try {
        const [bidangRes, periodeRes] = await Promise.all([
          fetchApi<{ data: BidangUrusan[] }>({ type: 'auth', method: 'GET', url: `/bidang_urusan/findall/${kodeOpd}` }),
          fetchApi<{ data: Periode[] }>({ type: 'auth', method: 'GET', url: '/periode/findall' }),
        ]);
        setBidangUrusanList(bidangRes.data?.data ?? []);
        setPeriodeList(periodeRes.data?.data ?? []);
      } catch (err) {
        console.error('Failed to fetch dropdowns:', err);
        toast.error('Gagal memuat data dropdown');
      } finally {
        setLoadingDropdown(false);
      }
    }
    fetchDropdowns();
  }, [kodeOpd]);

  // When periode changes, update all indikator targets
  useEffect(() => {
    if (!selectedPeriode) return;
    setIndikators((prev) =>
      prev.map((ind) => ({
        ...ind,
        targets: selectedPeriode.tahun_list.map((tahun) => {
          const existing = ind.targets.find((t) => t.tahun === tahun);
          return existing ?? { tahun, target: '', satuan: '' };
        }),
      }))
    );
  }, [selectedPeriode]);

  const addIndikator = () => {
    const targets = selectedPeriode
      ? selectedPeriode.tahun_list.map((tahun) => ({ tahun, target: '', satuan: '' }))
      : [];
    setIndikators([
      ...indikators,
      { nama_indikator: '', rumus_perhitungan: '', sumber_data: '', targets },
    ]);
  };

  const removeIndikator = (index: number) => {
    const next = [...indikators];
    next.splice(index, 1);
    setIndikators(next);
  };

  const handleIndikatorChange = (idx: number, field: keyof Omit<IndikatorState, 'targets'>, value: string) => {
    const next = [...indikators];
    next[idx] = { ...next[idx], [field]: value };
    setIndikators(next);
  };

  const handleTargetChange = (indIdx: number, targetIdx: number, field: 'target' | 'satuan', value: string) => {
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
      kode_opd: kodeOpd,
      tujuan,
      kode_bidang_urusan: kodeBidangUrusan,
      periode_id: periodeId,
      indikator: indikators.map((ind) => ({
        nama_indikator: ind.nama_indikator,
        rumus_perhitungan: ind.rumus_perhitungan,
        sumber_data: ind.sumber_data,
        target: ind.targets.map((t) => ({
          tahun: t.tahun,
          target: t.target,
          satuan: t.satuan,
        })),
      })),
    };

    try {
      await fetchApi({
        type: 'auth',
        url: '/tujuan_opd/create',
        method: 'POST',
        body: payload,
      });
      toast.success('Tujuan OPD berhasil ditambahkan');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 p-6">
        <h2 className="text-lg font-bold text-center uppercase mb-4 border-b pb-3">
          Tambah Tujuan OPD
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          {/* Tujuan OPD */}
          <div>
            <label className="font-bold text-foreground block mb-1 uppercase text-xs">Tujuan OPD:</label>
            <textarea
              required
              rows={3}
              placeholder="masukkan Tujuan OPD"
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              className="w-full border border-input rounded-lg p-3 focus:ring-2 focus:ring-ring outline-none resize-y"
            />
          </div>

          {/* Bidang Urusan */}
          <div>
            <label className="font-bold text-foreground block mb-1 uppercase text-xs">Bidang Urusan:</label>
            {loadingDropdown ? (
              <p className="text-xs text-muted-foreground">Memuat...</p>
            ) : (
              <select
                required
                value={kodeBidangUrusan}
                onChange={(e) => setKodeBidangUrusan(e.target.value)}
                className="w-full border border-input rounded-lg p-3 focus:ring-2 focus:ring-ring outline-none appearance-none bg-card"
              >
                <option value="">Pilih Bidang Urusan</option>
                {bidangUrusanList.map((bu) => (
                  <option key={bu.kode_bidang_urusan} value={bu.kode_bidang_urusan}>
                    {bu.nama_bidang_urusan}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Periode */}
          <div>
            <label className="font-bold text-foreground block mb-1 uppercase text-xs">Periode:</label>
            {loadingDropdown ? (
              <p className="text-xs text-muted-foreground">Memuat...</p>
            ) : (
              <select
                required
                value={periodeId}
                onChange={(e) => setPeriodeId(e.target.value ? Number(e.target.value) : '')}
                className="w-full border border-input rounded-lg p-3 focus:ring-2 focus:ring-ring outline-none appearance-none bg-card"
              >
                <option value="">Pilih Periode</option>
                {periodeList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.tahun_awal} - {p.tahun_akhir} ({p.jenis_periode})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Indikator Section */}
          <div>
            <label className="font-bold text-foreground block mb-2 uppercase text-xs">Indikator Tujuan OPD :</label>

            {indikators.map((ind, idx) => (
              <div key={idx} className="border border-border rounded-lg p-4 mb-4 bg-muted/20">
                <div className="mb-3">
                  <label className="font-bold text-foreground block mb-1 uppercase text-xs">
                    Nama Indikator {idx + 1} :
                  </label>
                  <input
                    type="text"
                    required
                    value={ind.nama_indikator}
                    onChange={(e) => handleIndikatorChange(idx, 'nama_indikator', e.target.value)}
                    className="w-full border border-input rounded-lg p-3 focus:ring-2 focus:ring-ring outline-none"
                    placeholder={`Masukkan nama indikator ${idx + 1}`}
                  />
                </div>

                <div className="mb-3 border border-border rounded-lg p-3">
                  <label className="font-bold text-foreground block mb-1 uppercase text-xs">Rumus Perhitungan :</label>
                  <input
                    type="text"
                    value={ind.rumus_perhitungan}
                    onChange={(e) => handleIndikatorChange(idx, 'rumus_perhitungan', e.target.value)}
                    className="w-full border border-input rounded-lg p-3 focus:ring-2 focus:ring-ring outline-none"
                    placeholder="Masukkan Rumus Perhitungan"
                  />
                </div>

                <div className="mb-3 border border-border rounded-lg p-3">
                  <label className="font-bold text-foreground block mb-1 uppercase text-xs">Sumber Data :</label>
                  <input
                    type="text"
                    value={ind.sumber_data}
                    onChange={(e) => handleIndikatorChange(idx, 'sumber_data', e.target.value)}
                    className="w-full border border-input rounded-lg p-3 focus:ring-2 focus:ring-ring outline-none"
                    placeholder="Masukkan Sumber Data"
                  />
                </div>

                {/* Targets per tahun */}
                {ind.targets.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {ind.targets.map((t, tIdx) => (
                      <div key={t.tahun} className="border border-border rounded-lg p-3 bg-card">
                        <p className="text-center font-bold text-sm mb-2">{t.tahun}</p>
                        <div className="mb-2">
                          <label className="font-bold text-foreground block mb-1 uppercase text-[10px]">Target :</label>
                          <input
                            type="text"
                            value={t.target}
                            onChange={(e) => handleTargetChange(idx, tIdx, 'target', e.target.value)}
                            className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none text-xs"
                            placeholder="Masukkan target"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-foreground block mb-1 uppercase text-[10px]">Satuan :</label>
                          <input
                            type="text"
                            value={t.satuan}
                            onChange={(e) => handleTargetChange(idx, tIdx, 'satuan', e.target.value)}
                            className="w-full border border-input rounded p-2 focus:ring-2 focus:ring-ring outline-none text-xs"
                            placeholder="Masukkan satuan"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removeIndikator(idx)}
                  className="border border-destructive text-destructive rounded-lg px-3 py-1 text-xs hover:bg-destructive hover:text-white transition-colors"
                >
                  Hapus Indikator
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addIndikator}
              className="w-full border border-dashed border-foreground/40 text-foreground rounded-lg p-3 bg-card hover:bg-foreground/5 transition"
            >
              Tambah Indikator
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white py-3 rounded-lg font-bold transition-all disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="w-full bg-destructive/90 hover:bg-destructive text-white py-3 rounded-lg font-bold transition disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
