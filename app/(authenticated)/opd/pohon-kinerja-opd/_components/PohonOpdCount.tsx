// app/(authenticated)/opd/pohon-kinerja-opd/_components/PohonOpdCount.tsx

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { CrosscuttingEditModal } from './modals/CrosscuttingEditModal';
import { CrosscuttingCard } from './CrosscuttingCard';

interface DetailLevel {
  level: number;
  jenis_pohon: string;
  jumlah_pemda: number;
}

interface CountPokinResponse {
  code: number;
  status: string;
  data: {
    kode_opd: string;
    nama_opd: string;
    tahun: string;
    total_pemda: number;
    detail_level: DetailLevel[];
  } | null;
}

interface CrosscuttingResponse {
  code: number;
  status: string;
  data: {
    ditolak: number;
    pending: number;
  } | null;
}

const levelColors: Record<string, { row: string }> = {
  Strategic: {
    row: 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white',
  },
  Tactical: {
    row: 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
  },
  Operational: {
    row: 'border-green-500 text-green-500 hover:bg-green-500 hover:text-white',
  },
};

function getLevelColor(jenisPohon: string) {
  if (jenisPohon.includes('Strategic')) return levelColors.Strategic;
  if (jenisPohon.includes('Tactical')) return levelColors.Tactical;
  if (jenisPohon.includes('Operational')) return levelColors.Operational;
  return { row: 'border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white' };
}

interface PohonOpdCountProps {
  kodeOpd: string;
  tahun: string;
  namaOpd: string;
}

function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 12l5 5l10 -10" />
    </svg>
  );
}

function HourglassIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6.5 7h11" />
      <path d="M6.5 17h11" />
      <path d="M6 20v-2a6 6 0 1 1 12 0v2a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1z" />
      <path d="M6 4v2a6 6 0 1 0 12 0v-2a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1z" />
    </svg>
  );
}

export default function PohonOpdCount({ kodeOpd, tahun, namaOpd }: PohonOpdCountProps) {
  const [detailLevel, setDetailLevel] = useState<DetailLevel[]>([]);
  const [crosscutting, setCrosscutting] = useState({ ditolak: 0, pending: 0 });
  const [showModal, setShowModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const fetchedRef = useRef<string | null>(null);
  const fetchKey = `${kodeOpd}/${tahun}`;

  const fetchData = useCallback(async () => {
    try {
      const [countRes, crossRes] = await Promise.all([
        fetchApi<CountPokinResponse>({ type: 'auth',  method: 'GET',  url: `/pohon_kinerja_opd/count_pokin_pemda/${kodeOpd}/${tahun}` }),
        fetchApi<CrosscuttingResponse>({ type: 'auth',  method: 'GET',  url: `/crosscutting_menunggu/${kodeOpd}/${tahun}` }),
      ]);

      setDetailLevel(countRes.data?.data?.detail_level ?? []);
      setCrosscutting({
        ditolak: crossRes.data?.data?.ditolak ?? 0,
        pending: crossRes.data?.data?.pending ?? 0,
      });
    } catch {
      // silently fail, show defaults
    }
  }, [kodeOpd, tahun]);

  useEffect(() => {
    if (fetchedRef.current === fetchKey) return;
    fetchedRef.current = fetchKey;
    fetchData();
  }, [fetchKey, fetchData]);

  return (
    <>
      <div className="mb-6">
        {/* Header row */}
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h2 className="font-semibold text-base">Pohon Kinerja {namaOpd}</h2>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border hover:bg-muted transition-colors"
          >
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
            {collapsed ? 'Tampilkan' : 'Sembunyikan'}
          </button>
        </div>

        {/* Collapsible body */}
        <div
          className={`grid transition-all duration-300 ease-in-out ${collapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap justify-between gap-2">
              {/* Left Card - Pohon OPD Count */}
              <div className="flex flex-col justify-between border-2 max-w-[400px] min-w-[300px] px-3 py-2 rounded-xl">
                <h1 className="font-semibold border-b-2 py-1 text-center">Pohon OPD</h1>
                <div className="flex flex-col py-2 mt-1 justify-between">
                  <table>
                    <tbody className="flex flex-col gap-2">
                      {detailLevel.map((item) => {
                        const color = getLevelColor(item.jenis_pohon);
                        return (
                          <tr
                            key={item.level}
                            className={`flex items-center border ${color.row} cursor-pointer rounded-lg px-2`}
                          >
                            <td className="px-2 py-1 text-start min-w-[130px]">
                              <button type="button" className="font-semibold">{item.jenis_pohon}</button>
                            </td>
                            <td className="py-1">
                              <h1 className="font-semibold">:</h1>
                            </td>
                            <td className="flex justify-center px-2 py-1 text-center w-full items-center gap-1">
                              {item.jumlah_pemda} <HourglassIcon size={14} />
                            </td>
                            <td className="py-1">/</td>
                            <td className="flex justify-center px-2 py-1 text-center w-full items-center gap-1">
                              {item.jumlah_pemda} <CheckIcon size={14} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Card - Crosscutting Pending */}
              <CrosscuttingCard
                ditolak={crosscutting.ditolak}
                pending={crosscutting.pending}
                onEditClick={() => setShowModal(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {showModal && <CrosscuttingEditModal onClose={() => setShowModal(false)} />}
    </>
  );
}
