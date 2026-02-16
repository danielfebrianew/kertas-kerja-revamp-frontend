'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { Button } from '@/components/ui/button';
import { ChevronDown, Shield, Loader2 } from 'lucide-react';
import type { OPD, OPDResponse } from '@/types/opd';
import { getCookie, setCookie } from 'cookies-next';

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
        const parsed = JSON.parse(opdCookie.toString());
        setSelectedOpd(parsed.value || '');
      }
      if (tahunCookie) {
        const parsed = JSON.parse(tahunCookie.toString());
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
        const res = await fetchApi<OPDResponse>('/opd/findall');
        setOpdList(res.data?.data ?? []);
      } catch (err) {
        console.error('Failed to fetch OPD:', err);
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

    onActivate?.(selectedTahun, selectedOpd);
  };

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg bg-primary px-4 py-4 text-primary-foreground">
      {/* OPD Select */}
      <div className="min-w-[180px] flex-1">
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-primary-foreground/70">
          Pilih OPD:
        </label>
        {opdLoading ? (
          <div className="flex h-9 items-center gap-2 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 text-sm text-primary-foreground/70">
            <Loader2 className="size-3.5 animate-spin" />
            Memuat...
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedOpd}
              onChange={(e) => setSelectedOpd(e.target.value)}
              className="w-full appearance-none rounded-md border border-background/80 bg-background px-3 py-2 pr-10 text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-accent hover:bg-background/80"
            >
              <option value="" className="bg-background text-primary">Pilih OPD ...</option>
              {opdList.map((opd) => (
                <option key={opd.kode_opd} value={opd.kode_opd} className="bg-background text-primary">
                  {opd.nama_opd}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
          </div>
        )}
      </div>

      {/* Tahun Select */}
      <div className="min-w-[140px]">
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-primary-foreground/70">
          Pilih Tahun:
        </label>
        <div className="relative">
          <select
            value={selectedTahun}
            onChange={(e) => setSelectedTahun(e.target.value)}
            className="w-full appearance-none rounded-md border border-background/80 bg-background px-3 py-2 pr-10 text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-accent hover:bg-background/80"
          >
            <option value="" className="bg-background text-primary">Pilih Tahun ...</option>
            {TAHUN_OPTIONS.map((t) => (
              <option key={t.value} value={t.value} className="bg-background text-primary">
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
        </div>
      </div>

      {/* Aktifkan Button */}
      <Button
        size="sm"
        onClick={handleActivate}
        className="h-9 bg-background text-primary font-medium hover:bg-background/80 transition-colors border-primary-foreground/20"
        disabled={!selectedOpd || !selectedTahun}
      >
        Aktifkan
      </Button>

      {/* Super Admin Badge */}
      <div className="ml-auto flex h-9 items-center gap-1.5 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary/20 px-3 text-sm font-medium text-primary-foreground">
        <Shield className="size-3.5" />
        Super Admin
      </div>
    </div>
  );
}