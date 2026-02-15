'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import AddModalTematik from './_components/modals/AddModalTematik';
import EditModalTematik from './_components/modals/EditModalTematik';
import { fetchApi } from '@/lib/fetcher';
import type { TematikPemdaItem, TematikPemdaResponse } from '@/types/tematik';
import { FilterHeader } from '@/components/filter-header';
import { IconHome } from '@/components/ui/icons';
import { Loader2, Palette, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirm } from '@/components/ui/confirm-dialog';
import Cookies from 'js-cookie';
import TematikTable from './_components/TematikTable';

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

function TematikContent() {
  const [tahun, setTahun] = useState(() => getTahunFromCookie());
  const [tematikList, setTematikList] = useState<TematikPemdaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const confirm = useConfirm();
  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!tahun) {
      setTematikList([]);
      return;
    }
    if (fetchedRef.current === tahun) return;
    fetchedRef.current = tahun;

    async function fetchTematik() {
      try {
        setLoading(true);
        const res = await fetchApi<TematikPemdaResponse>(
          `/tematik_pemda/${tahun}`
        );
        setTematikList(res.data.tematiks ?? []);
      } catch (err) {
        console.error('Failed to fetch tematik:', err);
        toast.error('Gagal memuat data tematik');
      } finally {
        setLoading(false);
      }
    }
    fetchTematik();
  }, [tahun]);

  const refetchTematik = async () => {
    if (!tahun) return;
    try {
      setLoading(true);
      const res = await fetchApi<TematikPemdaResponse>(`/tematik_pemda/${tahun}`);
      setTematikList(res.data.tematiks ?? []);
    } catch (err) {
      console.error('Failed to fetch tematik:', err);
      toast.error('Gagal memuat data tematik');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = (newTahun: string) => {
    fetchedRef.current = null;
    setTahun(newTahun);
  };

  const handleOpenAddModal = () => {
    setAddLoading(true);
    setTimeout(() => {
      setShowAddModal(true);
      setAddLoading(false);
    }, 300);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await confirm({ title: 'Hapus?', message: 'Apakah Anda yakin ingin menghapus tematik ini?' });
    if (!confirmed) return;
    try {
      await fetchApi(`/pohon_kinerja_admin/delete/${id}`, { method: 'DELETE' });
      toast.success('Tematik berhasil dihapus');
      setTematikList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      const code = (error as Error & { code?: number }).code;
      const message = error instanceof Error ? error.message : 'Gagal menghapus tematik';
      toast.error(`${message}${code ? ` (${code})` : ''}`);
    }
  };

  return (
    <div className="px-6 py-6 md:px-10">
      <FilterHeader onActivate={handleActivate} />

      <p className="mt-4 text-sm text-muted-foreground flex items-center gap-1">
        <IconHome /> / Pemda / <span className="text-foreground font-medium">Tematik</span>
      </p>

      {!tahun && (
        <div className="mt-10 flex flex-col items-center justify-center py-20 text-center">
          <Palette className="mb-4 size-14 text-muted-foreground/30" />
          <p className="font-display text-lg font-medium text-muted-foreground">
            PILIH TAHUN DI HEADER TERLEBIH DAHULU
          </p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Gunakan dropdown di atas untuk memilih OPD dan tahun, lalu klik Aktifkan.
          </p>
        </div>
      )}

      {tahun && (
        <>
          <div className="mt-6 mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Tematik Pemda{' '}
              <span className="text-muted-foreground font-normal text-lg">({tahun})</span>
            </h2>
            <button
              onClick={handleOpenAddModal}
              disabled={addLoading}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition disabled:opacity-50"
            >
              {addLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Tambah Tematik
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="size-6 animate-spin" />
                <p className="text-sm">Memuat data tematik...</p>
              </div>
            </div>
          ) : tematikList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Palette className="mb-4 size-14 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Tidak ada data tematik.</p>
            </div>
          ) : (
            <TematikTable data={tematikList} onEdit={(id) => setEditId(id)} onDelete={handleDelete} />
          )}

          {showAddModal && (
            <AddModalTematik
              onCancel={() => setShowAddModal(false)}
              onSuccess={() => {
                setShowAddModal(false);
                refetchTematik();
              }}
            />
          )}

          {editId !== null && (
            <EditModalTematik
              tematikId={editId}
              onCancel={() => setEditId(null)}
              onSuccess={() => {
                setEditId(null);
                refetchTematik();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function PemdaTematikPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <TematikContent />
    </Suspense>
  );
}
