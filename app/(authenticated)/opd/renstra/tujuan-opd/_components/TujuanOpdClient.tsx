'use client';

import { Suspense, useEffect, useState } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { FilterHeader } from '@/components/filter-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Loader2, Building2, Plus } from 'lucide-react';
import { getCookieValue, getCookieLabel } from '@/lib/cookie';
import { toast } from 'sonner';
import TujuanOpdTable from './TujuanOpdTable';

interface Periode {
  id: number;
  tahun_awal: string;
  tahun_akhir: string;
  jenis_periode: string;
  tahun_list: string[];
}

function flattenRows(apiData: any[]): { rows: any[]; tahunList: string[] } {
  const tahunSet = new Set<string>();
  const rows: any[] = [];

  for (const item of apiData) {
    const { kode_urusan, urusan, kode_bidang_urusan, nama_bidang_urusan, tujuan_opd } = item;
    const urusan_bidang = `${kode_urusan} – ${urusan}\n${kode_bidang_urusan} – ${nama_bidang_urusan}`;

    for (const tujuan of tujuan_opd ?? []) {
      for (const ind of tujuan.indikator ?? []) {
        const row: any = {
          id: `${tujuan.id_tujuan_opd}-${ind.id}`,
          id_tujuan_opd: tujuan.id_tujuan_opd,
          urusan_bidang,
          tujuan: tujuan.tujuan,
          indikator: ind.indikator,
          rumus_perhitungan: ind.rumus_perhitungan,
          sumber_data: ind.sumber_data,
        };

        for (const t of ind.target ?? []) {
          tahunSet.add(t.tahun);
          row[`target_${t.tahun}`] = t.target;
          row[`satuan_${t.tahun}`] = t.satuan;
        }

        rows.push(row);
      }

      if (!tujuan.indikator || tujuan.indikator.length === 0) {
        rows.push({
          id: `${tujuan.id_tujuan_opd}-no-ind`,
          id_tujuan_opd: tujuan.id_tujuan_opd,
          urusan_bidang,
          tujuan: tujuan.tujuan,
          indikator: '',
          rumus_perhitungan: '',
          sumber_data: '',
        });
      }
    }
  }

  const tahunList = Array.from(tahunSet).sort();
  return { rows, tahunList };
}

function TujuanOpdContent() {
  const [kodeOpd, setKodeOpd] = useState(() => getCookieValue('opd'));
  const [namaOpd, setNamaOpd] = useState(() => getCookieLabel('opd'));

  const [periodeOptions, setPeriodeOptions] = useState<Periode[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);

  const [rows, setRows] = useState<any[]>([]);
  const [tahunList, setTahunList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApi<{ data: Periode[] }>({ type: 'auth', method: 'GET', url: '/periode/findall' })
      .then((res) => {
        const list = res.data?.data ?? [];
        setPeriodeOptions(list);
        if (list.length > 0) setSelectedPeriode(list[0]);
      })
      .catch(() => toast.error('Gagal memuat periode'));
  }, []);

  useEffect(() => {
    if (!kodeOpd || !selectedPeriode) return;

    async function loadData() {
      try {
        setLoading(true);
        const { tahun_awal, tahun_akhir, jenis_periode } = selectedPeriode!;
        const res = await fetchApi({
          type: 'auth',
          method: 'GET',
          url: `/tujuan_opd/findall/${kodeOpd}/tahunawal/${tahun_awal}/tahunakhir/${tahun_akhir}/jenisperiode/${jenis_periode}`,
        });
        const { rows: flatRows, tahunList: years } = flattenRows(res.data?.data ?? []);
        setRows(flatRows);
        setTahunList(years);
      } catch {
        toast.error('Gagal memuat data tujuan OPD');
        setRows([]);
        setTahunList([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [kodeOpd, selectedPeriode]);

  const handleActivate = (newTahun: string, newKodeOpd: string) => {
    setKodeOpd(newKodeOpd);
    setNamaOpd(getCookieLabel('opd'));
  };

  return (
    <>
      <FilterHeader onActivate={handleActivate} />
      <div className="px-2">
        <div className="px-2">
          <Breadcrumb />
        </div>

        {!kodeOpd ? (
          <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="mb-4 size-14 text-muted-foreground/30" />
            <p className="font-display text-lg font-medium text-muted-foreground">
              PILIH OPD DAN TAHUN DI HEADER TERLEBIH DAHULU
            </p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Gunakan dropdown di atas untuk memilih OPD dan tahun
            </p>
          </div>
        ) : (
          <>
            <div className="mt-2 mb-3 flex items-center justify-between flex-wrap gap-2 px-2">
              <h2 className="font-display text-xl font-semibold tracking-tight">
                TUJUAN OPD
                {selectedPeriode && (
                  <span className="text-muted-foreground font-normal text-base ml-2">
                    (PERIODE {selectedPeriode.tahun_awal} - {selectedPeriode.tahun_akhir})
                  </span>
                )}
              </h2>

              <div className="flex items-center gap-3">
                <select
                  value={selectedPeriode ? `${selectedPeriode.tahun_awal}-${selectedPeriode.tahun_akhir}-${selectedPeriode.jenis_periode}` : ''}
                  onChange={(e) => {
                    const found = periodeOptions.find(
                      (p) => `${p.tahun_awal}-${p.tahun_akhir}-${p.jenis_periode}` === e.target.value
                    );
                    if (found) setSelectedPeriode(found);
                  }}
                  className="border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {periodeOptions.map((p) => (
                    <option
                      key={p.id}
                      value={`${p.tahun_awal}-${p.tahun_akhir}-${p.jenis_periode}`}
                    >
                      {p.tahun_awal} - {p.tahun_akhir} ({p.jenis_periode})
                    </option>
                  ))}
                </select>

                <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition">
                  <Plus className="size-4" />
                  Tambah Tujuan OPD
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin" />
                  <p className="text-sm">Memuat data tujuan OPD...</p>
                </div>
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Building2 className="mb-4 size-14 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Tidak ada data tujuan OPD.</p>
              </div>
            ) : (
              <TujuanOpdTable
                rows={rows}
                tahunList={tahunList}
                onEdit={(id) => console.log('edit', id)}
                onDelete={(id) => console.log('delete', id)}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function TujuanOpdClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <TujuanOpdContent />
    </Suspense>
  );
}
