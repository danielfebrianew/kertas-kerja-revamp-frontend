'use client';

import React, { Suspense, useCallback, useRef, useState, useEffect } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { toast } from 'sonner';
import type { PohonKinerja } from '@/types/PohonPemda';
import type { PohonOpdResponse, TujuanOpd } from '@/types/PohonOpd';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Building2, Loader2 } from 'lucide-react';
import { FilterHeader } from '@/components/filter-header';
import PohonNode from './_components/PohonNode';
import { IconHome, IconCetak } from '@/components/ui/icons';
import { useConfirm } from '@/components/ui/confirm-dialog';
import Cookies from 'js-cookie';
import './treeflex.css';

function getCookieValue(name: string): string {
  try {
    const raw = Cookies.get(name);
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' ? parsed.value || '' : String(parsed);
  } catch {
    return '';
  }
}

function getCookieLabel(name: string): string {
  try {
    const raw = Cookies.get(name);
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' ? parsed.label || '' : '';
  } catch {
    return '';
  }
}

function mapPohonResponse(node: Record<string, unknown>): PohonKinerja {
  const { tema, childs, ...rest } = node;
  return {
    ...rest,
    nama_pohon: (node.nama_pohon as string) ?? (tema as string) ?? '',
    childs: Array.isArray(childs)
      ? (childs as Record<string, unknown>[]).map(mapPohonResponse)
      : undefined,
  } as PohonKinerja;
}

const IconAdd = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="mr-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M9 12h6" />
    <path d="M12 9v6" />
  </svg>
);

function OpdPohonContent() {
  const [tahun, setTahun] = useState(() => getCookieValue('tahun'));
  const [kodeOpd, setKodeOpd] = useState(() => getCookieValue('opd'));
  const [namaOpd, setNamaOpd] = useState(() => getCookieLabel('opd'));

  const confirm = useConfirm();
  const [pohonData, setPohonData] = useState<PohonKinerja[]>([]);
  const [tujuanOpd, setTujuanOpd] = useState<TujuanOpd[]>([]);
  const [loading, setLoading] = useState(!!tahun && !!kodeOpd);
  const fetchedRef = useRef<string | null>(null);

  const fetchKey = `${kodeOpd}/${tahun}`;

  const fetchPohonData = useCallback(async () => {
    if (!kodeOpd || !tahun) {
      setPohonData([]);
      setTujuanOpd([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetchApi<PohonOpdResponse>(
        `/pohon_kinerja_opd/findall/${kodeOpd}/${tahun}`
      );
      setNamaOpd(res.data?.nama_opd || namaOpd);
      setTujuanOpd(res.data?.tujuan_opd ?? []);
      const childs = res.data?.childs ?? [];
      setPohonData(
        childs.map((c) => mapPohonResponse(c as unknown as Record<string, unknown>))
      );
    } catch (err) {
      console.error('Failed to fetch pohon OPD:', err);
      toast.error('Gagal memuat pohon kinerja OPD');
    } finally {
      setLoading(false);
    }
  }, [kodeOpd, tahun, namaOpd]);

  useEffect(() => {
    if (!kodeOpd || !tahun) return;
    if (fetchedRef.current === fetchKey) return;
    fetchedRef.current = fetchKey;
    fetchPohonData();
  }, [fetchKey, fetchPohonData, kodeOpd, tahun]);

  const handleActivate = (newTahun: string, newKodeOpd: string) => {
    fetchedRef.current = null;
    setTahun(newTahun);
    setKodeOpd(newKodeOpd);
    setNamaOpd(getCookieLabel('opd'));
  };

  const handleDeleteNode = async (nodeId: number) => {
    const confirmed = await confirm();
    if (!confirmed) return;
    try {
      await fetchApi(`/pohon_kinerja_admin/delete/${nodeId}`, { method: 'DELETE' });
      toast.success('Node berhasil dihapus');
      fetchPohonData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus node';
      toast.error(message);
    }
  };

  return (
    <div className="px-6 py-6 md:px-10">
      <FilterHeader onActivate={handleActivate} />

      <p className="mt-4 text-sm text-muted-foreground flex items-center gap-1">
        <IconHome /> / OPD / <span className="text-foreground font-medium">Pohon Kinerja</span>
      </p>

      {(!tahun || !kodeOpd) && (
        <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">
          <Building2 className="mb-4 size-14 text-muted-foreground/30" />
          <p className="font-display text-lg font-medium text-muted-foreground">
            PILIH OPD DAN TAHUN DI HEADER TERLEBIH DAHULU
          </p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Gunakan dropdown di atas untuk memilih OPD dan tahun, lalu klik Aktifkan.
          </p>
        </div>
      )}

      {tahun && kodeOpd && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="size-6 animate-spin" />
                <p className="text-sm">Memuat pohon kinerja OPD...</p>
              </div>
            </div>
          ) : (
            <Card className="mt-6">
              <CardContent>
                <div className="overflow-x-auto py-8 flex justify-center w-full">
                  <div className="tf-tree tf-gap-sm">
                    <ul>
                      <li>
                        {/* Root OPD Node */}
                        <div className="tf-nc tf flex flex-col rounded-lg shadow-lg border-primary max-w-sm relative">
                          {/* Header */}
                          <div className="flex flex-col rounded-lg shadow-sm mb-2 border p-3 border-primary bg-primary text-primary-foreground">
                            <span className="text-xs text-center font-bold uppercase">
                              Pohon Kinerja OPD
                            </span>
                          </div>

                          {/* Body */}
                          <div className="bg-card p-2 rounded-b-lg">
                            <table className="w-full border-collapse text-xs">
                              <tbody>
                                <tr>
                                  <td className="border p-2 font-semibold text-foreground w-24">Perangkat Daerah</td>
                                  <td className="border p-2">{namaOpd}</td>
                                </tr>
                                <tr>
                                  <td className="border p-2 font-semibold text-foreground w-24">Kode OPD</td>
                                  <td className="border p-2">{kodeOpd}</td>
                                </tr>
                                {tujuanOpd.map((tujuan) => (
                                  <React.Fragment key={tujuan.id}>
                                    <tr>
                                      <td className="border p-2 font-semibold text-foreground w-24">Tujuan OPD</td>
                                      <td className="border p-2 font-medium">{tujuan.tujuan}</td>
                                    </tr>
                                    {tujuan.indikator.map((ind, iIdx) => (
                                      <React.Fragment key={iIdx}>
                                        <tr>
                                          <td className="border p-2 font-semibold text-foreground w-24">Indikator</td>
                                          <td className="border p-2">{ind.indikator}</td>
                                        </tr>
                                        <tr>
                                          <td className="border p-2 font-semibold text-foreground">Target/Satuan</td>
                                          <td className="border p-2">
                                            {ind.targets[0]?.target ?? '-'} / {ind.targets[0]?.satuan ?? '-'}
                                          </td>
                                        </tr>
                                      </React.Fragment>
                                    ))}
                                  </React.Fragment>
                                ))}
                                <tr>
                                  <td className="border p-2 font-semibold text-foreground w-24">Tahun</td>
                                  <td className="border p-2">{tahun}</td>
                                </tr>
                              </tbody>
                            </table>

                            {/* Action Buttons */}
                            <div className="flex-wrap">
                              <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">
                                <button
                                  type="button"
                                  className="px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                >
                                  <IconAdd /> Tambah Tujuan OPD
                                </button>
                              </div>

                              <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">
                                <button
                                  type="button"
                                  className="px-3 py-1 flex justify-center items-center whitespace-nowrap bg-gradient-to-r from-[#08C2FF] to-[#006BFF] hover:from-[#0584AD] hover:to-[#014CB2] text-white rounded-md transition-all shadow-sm"
                                >
                                  <IconCetak />
                                  <span className="font-semibold">Cetak Penuh Pohon Kinerja</span>
                                </button>
                              </div>

                              <div className="flex gap-3 justify-evenly my-4 hide-on-capture text-xs">
                                <button
                                  type="button"
                                  className="px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
                                >
                                  <IconAdd />
                                  <span className="font-semibold">Tampilkan Semua</span>
                                </button>
                                <button
                                  type="button"
                                  className="px-2 py-1 whitespace-nowrap flex justify-center rounded-md items-center bg-card border-2 border-destructive text-destructive hover:bg-destructive hover:text-white transition-colors"
                                >
                                  <IconAdd />
                                  <span className="font-semibold">Strategic</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tree Children */}
                        {pohonData.length > 0 && (
                          <ul>
                            {pohonData.map((node) => (
                              <PohonNode
                                key={node.id}
                                node={node}
                                onTreeRefresh={fetchPohonData}
                                onDeleteAction={handleDeleteNode}
                                isRoot
                              />
                            ))}
                          </ul>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default function OpdPohonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <OpdPohonContent />
    </Suspense>
  );
}
