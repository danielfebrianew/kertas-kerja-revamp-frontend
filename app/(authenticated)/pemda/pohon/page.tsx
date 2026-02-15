'use client';

import { Suspense, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/fetcher';
import { toast } from 'sonner';
import type { TematikItem, PohonKinerja, TematikResponse, PohonPemdaResponse } from '@/types/pohon';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from '@/components/ui/card';
import { TreePine, ChevronDown, Loader2 } from 'lucide-react';
import { FilterHeader } from '@/components/filter-header';
import PohonNode from './_components/PohonNode';
import Cookies from 'js-cookie';
import { IconHome } from '@/components/ui/icons';
import { useConfirm } from '@/components/ui/confirm-dialog';
import './treeflex.css';

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

function getTahunFromCookie(): string {
  try {
    const raw = Cookies.get('tahun');
    if (!raw) return '';
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' ? parsed.value || '' : String(parsed);
  } catch {
    const raw = Cookies.get('tahun');
    if (raw && /^\d{4}$/.test(raw)) return raw;
    toast.error('Format cookie tahun tidak valid');
  }
  return '';
}

function PohonContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [tahun, setTahun] = useState(() => getTahunFromCookie());
  const selectedId = searchParams.get('id') ?? '';

  const confirm = useConfirm();
  const [tematikList, setTematikList] = useState<TematikItem[]>([]);
  const [pohonData, setPohonData] = useState<PohonKinerja[]>([]);
  const [loading, setLoading] = useState(false);
  const [tematikLoading, setTematikLoading] = useState(false);
  const tematikFetchedRef = useRef<string | null>(null);

  // Fetch tematik when tahun changes
  useEffect(() => {
    if (!tahun) {
      setTematikList([]);
      return;
    }
    if (tematikFetchedRef.current === tahun) return;
    tematikFetchedRef.current = tahun;

    async function fetchTematik() {
      try {
        setTematikLoading(true);
        const res = await fetchApi<TematikResponse>(
          `/pohon_kinerja/tematik/${tahun}`
        );
        setTematikList(res.data ?? []);
      } catch (err) {
        console.error('Failed to fetch tematik:', err);
      } finally {
        setTematikLoading(false);
      }
    }
    fetchTematik();
  }, [tahun]);

  const fetchPohonData = useCallback(async () => {
    if (!selectedId) {
      setPohonData([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetchApi<PohonPemdaResponse>(
        `/pohon_kinerja_admin/tematik/${selectedId}`
      );
      setPohonData(res.data ? [mapPohonResponse(res.data as unknown as Record<string, unknown>)] : []);
    } catch (err) {
      console.error('Failed to fetch pohon:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchPohonData();
  }, [fetchPohonData]);

  const handleActivate = (newTahun: string) => {
    tematikFetchedRef.current = null;
    setTahun(newTahun);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('id');
    router.push(`?${params.toString()}`);
  };

  const handleSelect = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set('id', id);
    } else {
      params.delete('id');
    }
    router.push(`?${params.toString()}`);
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
      {/* Filter Header */}
      <FilterHeader onActivate={handleActivate} />

      {/* Breadcrumb */}
      <p className="mt-4 text-sm text-muted-foreground flex items-center gap-1">
        <IconHome /> / Pemda / <span className="text-foreground font-medium">Pohon Kinerja</span>
      </p>

      {/* No tahun selected */}
      {!tahun && (
        <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">
          <TreePine className="mb-4 size-14 text-muted-foreground/30" />
          <p className="font-display text-lg font-medium text-muted-foreground">
            PILIH TAHUN DI HEADER TERLEBIH DAHULU
          </p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Gunakan dropdown di atas untuk memilih OPD dan tahun, lalu klik Aktifkan.
          </p>
        </div>
      )}

      {/* Content when tahun is active */}
      {tahun && (
        <>
          <div className="mt-6 mb-6 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Pohon Kinerja Pemda
            </h2>
          </div>

          <Card className="mb-6 bg-primary text-primary-foreground border-primary">
            <CardHeader className="text-center">
              <CardDescription className="text-background/80 flex justify-center w-full">
                Pilih tematik untuk menampilkan pohon kinerja.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-sm justify-center w-full mx-auto ">
                {tematikLoading ? (
                  <div className="flex items-center gap-2 text-sm text-primary-foreground/70 ">
                    <Loader2 className="size-4 animate-spin" />
                    Memuat data tematik...
                  </div>
                ) : (
                  <div className="relative flex justify-center w-full">
                    <select
                      value={selectedId}
                      onChange={(e) => handleSelect(e.target.value)}
                      className="w-full appearance-none rounded-md border border-background/20 bg-background px-3 py-2 pr-10 text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="" className="bg-background text-primary">Pilih Tematik</option>
                      {tematikList.map((item) => (
                        <option key={item.id} value={item.id} className="bg-background text-primary">
                          {item.nama_pohon}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedId && (
            <Card>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <Loader2 className="size-6 animate-spin" />
                      <p className="text-sm">Memuat pohon kinerja...</p>
                    </div>
                  </div>
                ) : pohonData.length === 0 ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <TreePine className="size-10 opacity-40" />
                      <p className="text-sm">Tidak ada data pohon kinerja.</p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto py-8 flex justify-center w-full">
                    <div className="tf-tree tf-gap-sm">
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
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!selectedId && !tematikLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <TreePine className="mb-4 size-14 text-muted-foreground/30" />
              <p className="font-display text-lg font-medium text-muted-foreground">
                Pilih tematik untuk memulai
              </p>
              <p className="mt-1 text-sm text-muted-foreground/60">
                Gunakan dropdown di atas untuk memilih tematik yang ingin ditampilkan.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PemdaPohonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PohonContent />
    </Suspense>
  );
}