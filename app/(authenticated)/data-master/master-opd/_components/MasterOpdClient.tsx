// app/(authenticated)/data-master/master-opd/_components/MasterOpdClient.tsx

'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Building2, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { fetchApi } from '@/lib/fetcher';
import { FilterHeader } from '@/components/filter-header';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { useConfirm } from '@/components/ui/confirm-dialog';
import type { OPDResponse } from '@/types/opd';
import AddModalMasterOpd from './modals/AddMasterOpd';
import EditModalMasterOpd from './modals/EditMasterOpd';
import MasterOpdTable, { type MasterOpdItem } from './MasterOpdTable';

function mapMasterOpdRows(response: OPDResponse): MasterOpdItem[] {
  return (response.data ?? []).map((item) => ({
    id: item.id,
    kode_perangkat_daerah: item.kode_opd,
    nama_perangkat_daerah: item.nama_opd,
    nama_kepala_perangkat_daerah: item.nama_kepala_opd,
    nip_kepala_perangkat_daerah: item.nip_kepala_opd,
    pangkat_kepala_perangkat_daerah: item.pangkat_kepala,
    kode_lembaga: item.id_lembaga?.id ?? '-',
    singkatan: item.singkatan ?? '',
    alamat: item.alamat ?? '',
    telepon: item.telepon ?? '',
    fax: item.fax ?? '',
    email: item.email ?? '',
    website: item.website ?? '',
  }));
}

function MasterOpdContent() {
  const [masterOpdData, setMasterOpdData] = useState<MasterOpdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<MasterOpdItem | null>(null);
  const fetchedRef = useRef(false);
  const confirm = useConfirm();

  const fetchMasterOpd = async () => {
    try {
      setLoading(true);
      const response = await fetchApi<OPDResponse>({ type: 'auth',  method: 'GET',  url: '/opd/findall' });

      if (response.status >= 400) {
        const error = new Error(response.message || 'Gagal memuat data Master OPD') as Error & { code?: number };
        error.code = response.status;
        throw error;
      }

      setMasterOpdData(mapMasterOpdRows(response.data));
    } catch (error) {
      console.error('Failed to fetch master OPD:', error);
      const code = (error as Error & { code?: number }).code;
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast.error(`${message}${code ? ` (${code})` : ''}`);
      setMasterOpdData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    void fetchMasterOpd();
  }, []);

  const handleDelete = async (item: MasterOpdItem) => {
    const confirmed = await confirm({
      title: 'Hapus?',
      message: `Apakah Anda yakin ingin menghapus ${item.nama_perangkat_daerah}?`,
      confirmLabel: 'Hapus',
      cancelLabel: 'Batal',
    });

    if (!confirmed) return;

    try {
      const response = await fetchApi({ type: 'auth',  url: `/opd/delete/${item.id}`, method: 'DELETE' });

      if (response.status >= 400) {
        const error = new Error(response.message || 'Gagal menghapus Master OPD') as Error & { code?: number };
        error.code = response.status;
        throw error;
      }

      toast.success('Master OPD berhasil dihapus');
      setMasterOpdData((prev) => prev.filter((row) => row.id !== item.id));
    } catch (error) {
      const code = (error as Error & { code?: number }).code;
      const message = error instanceof Error ? error.message : 'Terjadi kesalahan';
      toast.error(`${message}${code ? ` (${code})` : ''}`);
    }
  };

  return (
    <>
      <FilterHeader />
      <div className="px-2">
        <div className="px-2">
          <Breadcrumb />
        </div>


        <div className="mt-2 mb-3 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight px-2">Master OPD</h2>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-bold text-sm transition"
          >
            <Plus className="size-4" />
            Tambah OPD
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <p className="text-sm">Memuat data Master OPD...</p>
            </div>
          </div>
        ) : masterOpdData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Building2 className="mb-4 size-14 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Tidak ada data Master OPD.</p>
          </div>
        ) : (
          <MasterOpdTable data={masterOpdData} onEdit={setEditItem} onDelete={handleDelete} />
        )}

        {showAddModal && (
          <AddModalMasterOpd
            onCancel={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false);
              void fetchMasterOpd();
            }}
          />
        )}

        {editItem && (
          <EditModalMasterOpd
            item={editItem}
            onCancel={() => setEditItem(null)}
            onSuccess={() => {
              setEditItem(null);
              void fetchMasterOpd();
            }}
          />
        )}
      </div>
    </>
  );
}

export default function MasterOpdClient() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center px-6 py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <MasterOpdContent />
    </Suspense>
  );
}
