'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { Button } from '@/components/ui/button';
import { ChevronDown, Shield, Loader2 } from 'lucide-react';
import type { OPD, OPDResponse } from '@/types/opd';
import { getCookie, setCookie } from 'cookies-next';
import { toast } from 'sonner';

interface FilterHeaderProps {
  onActivate?: (tahun: string, kodeOpd: string) => void;
}

const TAHUN_OPTIONS = Array.from({ length: 7 }, (_, i) => {
  const year = new Date().getFullYear() - 5 + i;
  return { label: `Tahun ${year}`, value: String(year) };
});

export function FilterHeader({ onActivate }: FilterHeaderProps) {
  const [opdList, setOpdList] = useState<OPD[]>([]);
  const [opdLoading, setOpdLoading] = useState(true);
  const fetchedRef = useRef(false);

  const [selectedOpd, setSelectedOpd] = useState('');
  const [selectedTahun, setSelectedTahun] = useState('');

  useEffect(() => {
    try {
      const opdCookie = getCookie('opd');
      const tahunCookie = getCookie('tahun');
      if (opdCookie) {
        const rawStr = typeof opdCookie === 'string' ? opdCookie : String(opdCookie);
        const parsed = JSON.parse(rawStr);
        setSelectedOpd(parsed.value || '');
      }
      if (tahunCookie) {
        const rawStr = typeof tahunCookie === 'string' ? tahunCookie : String(tahunCookie);
        const parsed = JSON.parse(rawStr);
        setSelectedTahun(parsed.value || '');
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetchOPD() {
      try {
        setOpdLoading(true);
        const res = await fetchApi<OPDResponse>({ type: 'auth',  method: 'GET',  url: '/opd/findall' });
        const data = res.data?.data;
        setOpdList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch OPD:', err);
        setOpdList([]);
      } finally {
        setOpdLoading(false);
      }
    }
    fetchOPD();
  }, []);

  const handleActivate = () => {
    if (!selectedOpd || !selectedTahun) {
      alert('Pilih OPD dan Tahun terlebih dahulu');
      return;
    }

    const opdItem = opdList.find((o) => o.kode_opd === selectedOpd);
    const tahunItem = TAHUN_OPTIONS.find((t) => t.value === selectedTahun);

    setCookie(
      'opd',
      JSON.stringify({
        label: opdItem?.nama_opd ?? selectedOpd,
        value: selectedOpd,
      })
    );
    setCookie(
      'tahun',
      JSON.stringify({
        label: tahunItem?.label ?? `Tahun ${selectedTahun}`,
        value: selectedTahun,
      })
    );

    const namaOpd = opdItem?.nama_opd ?? selectedOpd;
    toast.success(`OPD ${namaOpd} (${selectedTahun}) berhasil diaktifkan`);

    onActivate?.(selectedTahun, selectedOpd);
  };

  return (
    <nav className="flex w-full items-center border-b bg-white py-3 px-6 md:px-10">

      {/* Center group */}
      <div className="flex flex-1 items-center justify-center gap-4">

        {/* OPD Select */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            OPD:
          </label>
          {opdLoading ? (
            <div className="flex h-8 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
              <Loader2 className="size-3.5 animate-spin" />
              Memuat...
            </div>
          ) : (
            <div className="relative w-[240px]">
              <select
                value={selectedOpd}
                onChange={(e) => setSelectedOpd(e.target.value)}
                className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-1.5 pr-8 text-sm font-medium text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              >
                <option value="">Pilih OPD ...</option>
                {opdList.map((opd) => (
                  <option key={opd.kode_opd} value={opd.kode_opd}>
                    {opd.nama_opd}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            </div>
          )}
        </div>

        {/* Tahun Select */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Tahun:
          </label>
          <div className="relative w-[130px]">
            <select
              value={selectedTahun}
              onChange={(e) => setSelectedTahun(e.target.value)}
              className="w-full appearance-none rounded-md border border-slate-300 bg-white px-3 py-1.5 pr-8 text-sm font-medium text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="">Pilih Tahun ...</option>
              {TAHUN_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        {/* Aktifkan Button */}
        <Button
          size="sm"
          onClick={handleActivate}
          className="h-8 bg-slate-900 text-white hover:bg-slate-800"
        >
          Aktifkan
        </Button>

        {/* Super Admin Badge */}
        <div className="flex h-8 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-600">
          <Shield className="size-3.5" />
          Super Admin
        </div>

      </div>

    </nav>
  );
}