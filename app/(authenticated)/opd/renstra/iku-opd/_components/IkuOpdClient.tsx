'use client';

import { Suspense, useEffect, useState } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { FilterHeader } from '@/components/filter-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Loader2, Building2, Plus } from 'lucide-react';
import { getCookieValue, getCookieLabel } from '@/lib/cookie';
import { toast } from 'sonner';
import IkuOpdTable from './IkuOpdTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConfirm } from '@/components/ui/confirm-dialog';

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
    const row: any = {
      id: item.indikator_id,
      indikator_id: item.indikator_id,
      asal_iku: item.asal_iku,
      indikator: item.indikator,
      rumus_perhitungan: item.rumus_perhitungan,
      sumber_data: item.sumber_data,
      iku_active: item.iku_active,
    };

    for (const t of item.target ?? []) {
      tahunSet.add(t.tahun);
      row[`target_${t.tahun}`] = t.target;
      row[`satuan_${t.tahun}`] = t.satuan;
    }

    rows.push(row);
  }

  const tahunList = Array.from(tahunSet).sort();
  return { rows, tahunList };
}

function IkuOpdContent() {
  const [kodeOpd, setKodeOpd] = useState(() => getCookieValue('opd'));
  const [namaOpd, setNamaOpd] = useState(() => getCookieLabel('opd'));

  const [periodeOptions, setPeriodeOptions] = useState<Periode[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<Periode | null>(null);

  const [rows, setRows] = useState<any[]>([]);
  const [tahunList, setTahunList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const confirm = useConfirm();

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const ok = await confirm({
      title: currentActive ? 'Nonaktifkan IKU?' : 'Aktifkan IKU?',
      message: currentActive
        ? 'Indikator ini akan dipindahkan ke daftar IKU tidak aktif.'
        : 'Indikator ini akan dipindahkan ke daftar IKU aktif.',
      confirmLabel: currentActive ? 'Nonaktifkan' : 'Aktifkan',
      cancelLabel: 'Batal',
    });

    if (!ok) return;

    const response = await fetchApi({
      type: 'auth',
      method: 'PUT',
      url: `/indikator_utama/status/${id}`,
      body: { indikator_id: id, is_active: !currentActive },
    });

    if (response.status >= 200 && response.status < 300) {
      toast.success(currentActive ? 'IKU berhasil dinonaktifkan' : 'IKU berhasil diaktifkan');
      setRows((prev) =>
        prev.map((r) => (r.indikator_id === id ? { ...r, iku_active: !currentActive } : r))
      );
    } else {
      const errorMessage = (response.data as { message?: string } | null)?.message;
      toast.error(errorMessage ?? 'Gagal mengubah status IKU');
    }
  };

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
          url: `/indikator_utama/opd/${kodeOpd}/${tahun_awal}/${tahun_akhir}/${jenis_periode}`,
        });
        const { rows: flatRows, tahunList: years } = flattenRows(res.data?.data ?? []);
        setRows(flatRows);
        setTahunList(years);
      } catch {
        toast.error('Gagal memuat data IKU OPD');
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
                INDIKATOR KINERJA UTAMA OPD
                {selectedPeriode && (
                  <span className="text-muted-foreground font-normal text-base ml-2">
                    (PERIODE {selectedPeriode.tahun_awal} - {selectedPeriode.tahun_akhir})
                  </span>
                )}
              </h2>

              <div className="flex items-center gap-3">
                <select
                  value={
                    selectedPeriode
                      ? `${selectedPeriode.tahun_awal}-${selectedPeriode.tahun_akhir}-${selectedPeriode.jenis_periode}`
                      : ''
                  }
                  onChange={(e) => {
                    const found = periodeOptions.find(
                      (p) =>
                        `${p.tahun_awal}-${p.tahun_akhir}-${p.jenis_periode}` === e.target.value
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
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Loader2 className="size-6 animate-spin" />
                  <p className="text-sm">Memuat data IKU OPD...</p>
                </div>
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Building2 className="mb-4 size-14 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Tidak ada data IKU OPD.</p>
              </div>
            ) : (
              <Tabs defaultValue="aktif" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-3">
                  <TabsTrigger value="aktif">IKU yang aktif</TabsTrigger>
                  <TabsTrigger value="tidak-aktif">IKU yang tidak aktif</TabsTrigger>
                </TabsList>
                <TabsContent value="aktif" forceMount className="data-[state=inactive]:hidden">
                  <IkuOpdTable
                    rows={rows.filter((r) => r.iku_active === true)}
                    tahunList={tahunList}
                    onToggleActive={handleToggleActive}
                  />
                </TabsContent>
                <TabsContent value="tidak-aktif" forceMount className="data-[state=inactive]:hidden">
                  <IkuOpdTable
                    rows={rows.filter((r) => r.iku_active === false)}
                    tahunList={tahunList}
                    onToggleActive={handleToggleActive}
                  />
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function IkuOpdClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <IkuOpdContent />
    </Suspense>
  );
}
